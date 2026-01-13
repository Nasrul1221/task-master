const {body, query, param} = require('express-validator')

// TASKS 
const createTasksVal = [
    body('categoryId').optional({values: 'null'}).isNumeric().withMessage('categoryId is not a number!'),
    body('title').trim().notEmpty().withMessage('title is empty!').isLength({max: 30}).withMessage('The max length is 30')
]

const readTaskDetailsVal = [
    param('taskId').trim().notEmpty().withMessage('taskId is empty!').isNumeric().withMessage('taskId is not a number!')
]

const updateTasksVal = [
    ...createTasksVal,
    ...readTaskDetailsVal
]

const deleteTasksVal = [
    ...readTaskDetailsVal
]

// CATEGORIES
const createCategoryVal = [
    body('name').trim().notEmpty().withMessage('Category name is empty!')
]

const updateCategoryVal = [
    ...createCategoryVal,
    param('categoryId').trim().notEmpty().withMessage('categoryId is empty!').isNumeric().withMessage('categoryId is not a number')
]

const deleteCategoryVal = [
    param('categoryId').trim().notEmpty().withMessage('categoryId is empty!').isNumeric().withMessage('categoryId is not a number')
]

// LOGIN & REGISTER
const loginVal = [
    body('username')
        .exists({values: 'falsy'})
        .withMessage("username is required")
        .isString()
        .withMessage('username must be a string'),
    body('password')
        .exists({values: 'falsy'})
        .withMessage('password is required')
        .isString()
        .withMessage("password must be a string")
        .isLength({min: 5})
        .withMessage('password must be at least 5 chars')
]

const registerVal = [
    ...loginVal,
    body('email').isEmail().withMessage('email is invalid')
]

module.exports = {
    createTasksVal,
    readTaskDetailsVal,
    updateTasksVal,
    deleteTasksVal,

    createCategoryVal,
    updateCategoryVal,
    deleteCategoryVal,

    loginVal,
    registerVal
}