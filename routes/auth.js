const { Router } = require('express')
const { register, login } = require('../controllers/auth')
const { registerVal, loginVal } = require('../middleware/validators')
const { validate } = require('../middleware/validation')

const authRouter = Router()

authRouter.post('/register', registerVal, validate, register)
authRouter.post('/login', loginVal, validate, login)

module.exports = authRouter