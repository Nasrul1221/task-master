# task-master-api DOCS
API for tasks handling

## Local launching
### Requirements
1. **Node JS**
2. **Git**
3. **DB: PostgreSQL**

### Installing
1. ```bash
   git clone [https://github.com/Nasrul1221/task-master](https://github.com/Nasrul1221/task-master)
   ```
3. ```bash
   cd <folder_name>
   ```
2. ```bash
   npm install
   ```

### Configuration
1. **.env file**

| Variable | Description | Example |
| :--- | :--- | :--- |
| PORT | The port on which your program runs | `3000` |
| DATABASE_URL | Used to connect your database. You can either use the connection URL or the programmatic approach. However, using the second one, you're going to need a bit more ENV variables. See [node-posgres](https://node-postgres.com/features/connecting) | `postgresql://dbuser:secretpassword@database.server.com:3211/mydb` |
| JWT_SECRET_KEY | Needed for signing and verifying JWT tokens | `09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7` |

2. **Database populating**

Run the following command
```bash
npm run populatedb
```

It'll create the schema below:
```sql
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
```
