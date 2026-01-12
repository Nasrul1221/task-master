const {Client} = require('pg')
require('dotenv').config()

const SQL = `
    CREATE TABLE IF NOT EXISTS users
    (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL
    )

    CREATE TABLE IF NOT EXISTS categories 
    (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
    )

    CREATE TABLE IF NOT EXISTS tasks
    (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        title VARCHAR(255) NOT NULL,
        task_content TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        completed BOOLEAN NOT NULL DEFAULT false
    )
`

async function main() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    })

    console.log('Started')
    await client.connect()
    await client.query(SQL)
    await client.end()
    console.log('Done')
}

main()