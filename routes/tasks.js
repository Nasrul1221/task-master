const {Router} = require('express')
const {createTask, readTasks, updateTask, deleteTask, readTaskDetail} = require('../controllers/tasks')
const jwtauth = require('../middleware/auth')

// Validation
const {validate} = require('../middleware/validation')
const {createRules, readDetailsRules, updateRules, deleteRules} = require('../middleware/validators')

const taskRouter = Router()

taskRouter.get('/', jwtauth, readTasks)
taskRouter.get('/:taskId', readDetailsRules, validate, readTaskDetail)
taskRouter.post('/', createRules, validate, createTask)
taskRouter.put('/:taskId', updateRules, validate, updateTask)
taskRouter.delete('/:taskId', deleteRules, validate, deleteTask)

module.exports = taskRouter