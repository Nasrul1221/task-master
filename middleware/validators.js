const {body, query, param} = require('express-validator')

const createRules = [
    body('userId').isNumeric(),
    body('categoryId').optional().isNumeric(),
    body('title').trim().notEmpty().isLength({max: 30})
]

const readDetailsRules = [
    body('userId').notEmpty().isNumeric(),
    param('taskId').trim().notEmpty().isNumeric()
]

const updateRules = [
    ...createRules,
    param('taskId').trim().notEmpty().isNumeric()
]

const deleteRules = [
    ...readDetailsRules
]

module.exports = {
    createRules,
    readDetailsRules,
    updateRules,
    deleteRules
}