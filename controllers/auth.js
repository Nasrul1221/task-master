const pool = require('../db/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

async function register(req, res) {
    try {
        const {username, password, email} = req.body

        
        const isUnique = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email])
        
        if (isUnique.rows[0]) {
            const errors = isUnique.rows.map((el, i) => {
                if (username === el.username) {
                    return {msg: 'This nickname is already in use!'}
                }
                else if (email === el.email) {
                    return {msg: 'This email is already in use!'}
                }
            })
            return res.status(409).json({
                errors
            })
        }
        
        const hashed = await bcrypt.hash(password, 10)

        const user = await pool.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3)', [username, hashed, email])

        res.sendStatus(201)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

async function login(req, res) {
    try {
        const {username, password} = req.body

        const user = await pool.query('SELECT id, username, password FROM users WHERE username = $1', [username])

        if (!user.rows[0]) {
            res.status(401).json({
                errors: [
                    { msg: 'Username is invalid' }
                ]
            })

            return
        }

        const isValid = await bcrypt.compare(password, user.rows[0].password)

        if (!isValid) {
            res.status(401).json({
                errors: [
                    { msg: 'Password is invalid' }
                ]
            })

            return
        }

        const token = jwt.sign({
            id: user.rows[0].id, 
            username: user.rows[0].username
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '24h'
        })

        res.json({
            token
        })
    }
    catch (error) {
        res.status(500).json({msg: 'Server error'})
    }
}

module.exports = {
    register,
    login
}