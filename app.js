const express = require('express');
require('dotenv').config()

// Routes
const taskRouter = require('./routes/tasks')
const categoryRouter = require('./routes/categories')
const authRouter = require('./routes/auth')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/tasks', taskRouter)
app.use('/categories', categoryRouter)
app.use('/', authRouter)

app.listen(PORT, error => {
    if (error) {
        res.send(error)
    }

    console.log('Success')
})