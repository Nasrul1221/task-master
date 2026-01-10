const pool = require('../db/db')

// CRUD
async function createTask(req, res) {
    try {
        const {categoryId, title, content} = req.body

        const createdTask = await pool.query('INSERT INTO tasks (user_id, category_id, title, task_content) VALUES ($1, $2, $3, $4) RETURNING *', [userId, categoryId, title, content])

        res.json(createdTask.rows[0])
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

async function readTasks(req, res) {
    try {
        const userId = req.user.id
        const {category, search} = req.query

        let query = 'SELECT tasks.*, categories.name AS category_name FROM tasks LEFT JOIN categories ON tasks.category_id = categories.id WHERE tasks.user_id = $1';
        let parameters = [userId]
        let i = 2
        
        if (category) {
            query += ` AND categories.name = $${i++}`
            parameters.push(category)
        }
        
        if (search && search.trim() !== '') {
            const editedSearch = `%${search}%`
            query += ` AND tasks.title ILIKE $${i++}`
            parameters.push(editedSearch)
        }

        const tasks = await pool.query(query, parameters)

        res.json({
            count: tasks.rowCount,
            tasks: tasks.rows,
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

async function readTaskDetail(req, res) {
    try {
        const {userId} = req.body
        const {taskId} = req.params

        const task = await pool.query('SELECT * FROM tasks WHERE user_id = $1 AND id = $2', [userId, taskId])

        if (!task.rows[0]) {
            res.status(404).json({
                errors: [
                    {
                        msg: 'Not found'
                    }
                ]
            })
            
            return
        }

        res.json({
            task: task.rows[0]
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

async function updateTask(req, res) {    
    try {
        const {title, content, category_id, userId} = req.body
        const {taskId} = req.params

        const updatedTask = await pool.query('UPDATE tasks SET title = $1, task_content = $2, category_id = $3, updated_at = NOW() WHERE user_id = $4 AND id = $5 RETURNING title, task_content, category_id', [title, content, category_id, userId, taskId])

        if (updatedTask.rowCount === 0) {
            res.status(404).json({
                errors: [
                    {
                        msg: 'Not found'
                    }
                ]
            })

            return
        }

        res.json({
            updatedTask
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

async function deleteTask(req, res) {
    try {
        const {userId} = req.body
        const {taskId} = req.params

        const deletedTask = await pool.query('DELETE FROM tasks WHERE user_id = $1 AND id = $2', [userId, taskId])
        
        if (deletedTask.rowCount === 0) {
            res.status(404).json({
                errors: [
                    {
                        msg: 'Not found'
                    }
                ]
            })

            return
        }

        res.status(204).json({
            deletedTask
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

module.exports = {
    createTask,
    readTasks,
    updateTask,
    deleteTask,
    readTaskDetail
}