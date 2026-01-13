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
### Launching
There are two ways to launch the API.
1. `npm run start` - *node app.js*
2. `npm run dev` - *node --watch app.js*. This way automatically restarts the API after every change you make.

## API General Reference

### Auth
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :---|
| POST | [/auth/login](#post-authlogin) | Signs in and issues a JWT token | Public |
| POST | [/auth/register](#post-authregister) | Register a new user | Public |

### Tasks
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :---|
| GET | [/tasks](#get-tasks) | Returns an array of all user tasks |
| GET | [/tasks/:id](#get-tasksid) | Returns a task by ID | Private |
| POST | [/tasks](#post-tasks) | Creates a new task | Private |
| PUT | [/tasks/:id](#post-tasksid) | Updates a task | Private |
| DELETE | [/tasks/:id](#delete-tasksid) | Deletes a task | Private |

### Categories
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :---|
| GET | [/categories](#get-categories) | Returns an array of all user categories | Private |
| POST | [/categories](#post-categories) | Creates a new category | Private |
| PUT | [/categories/:id](#put-categoriesid) | Updates a category | Private |
| DELETE | [/categories/:id](#delete-categoriesid) | Deletes a category | Private |

## API Details

### POST /auth/login
- **Description:** Authenticates the user and issues a JWT access token.
- **Request body:**
  ```json
    {
        "username": "STRING (required)",
        "password": "STRING (required)", 
    }
  ```
- **Success Response:**
  Status 200 OK
  ```json
    {
        "token": "<jwt_token>"
    }
    ```
- **Error Response**: 
  - Status 401 Unauthorized
  - Status 400 Bad Request
> [!IMPORTANT]
> This API **does not provide refresh tokens** only a single access token upon login.

---
### POST /auth/register
- **Description:** Creates a new user
- **Request body:**
  ```json
    {
        "username": "STRING (required)"  UNIQUE,
        "password": "STRING (required)",
        "email": "STRING (required)" UNIQUE
    }
  ```
- **Success Response:**
  Status 201 CREATED
- **Error Response:** 
  - Status 409 Conflict
  - Status 400 Bad Request

---
### GET /tasks
- **Description:** Returns an array of all user's tasks
- **Authentication**: Yes
- **Query strings:**
  | Parameter | Type | Required |Description |
  | :--- | :--- | :--- | :--- |
  | `category` | string | No | Filter tasks by the name of a category|
  | `search` | string | No | Filter tasks by the key word |

  If parameters are provided, but the values are not, all tasks are returned.
- **Success Response:**
  Status 200 OK
  ```json
    {
      "count": 1,
      "tasks": [
          {
              "id": 38,
              "user_id": 1,
              "category_id": 2,
              "title": "Housework",
              "task_content": "Clean the kitchen",
              "created_at": "2026-01-10T11:44:48.703Z",
              "updated_at": "2026-01-10T11:44:48.703Z",
              "completed": false,
              "category_name": "Common things"
          }
      ]
    }
  ```
- **Error Response:**
  - Status 401 Unauthorized

---
### GET /tasks/:id
- **Description:** Returns a task by the id.
- **Authentication**: Yes
- **Success Response:** Status 200 OK
  ```json
    {
      "task": {
        "id": 28,
        "user_id": 1,
        "category_id": 5,
        "title": "Swimming",
        "task_content": "Go swimming at 15 pm yesterday",
        "created_at": "2026-01-10T11:29:17.660Z",
        "updated_at": "2026-01-10T11:29:17.660Z",
        "completed": false
      }
    }
  ```
- **Error Response:** 
  - Status 404 Not Found
  - Status 400 Bad Request
  - Status 401 Unauthorized

---
### POST /tasks
- **Description:** Creates a new task.
- **Request body:**
  ```json
    {
        "categoryId": "INTEGER | NULL (optional)",
        "title": "STRING (required)",
        "Content": "STRING (optional)"
    }
  ```
- **Authentication**: Yes
- **Success Response:** Status 201 Created
- **Error Response:**
  - Status 400 Bad Request
  - Status 401 Unauthorized

---
### PUT /tasks/:id
- **Description:** Updates a task by the id.
- **Request body:**
  ```json
    {
        "categoryId": "INTEGER | NULL (required)",
        "title": "STRING (required)",
        "content": "STRING (required)"
    }
  ```
- **Authentication**: Yes
- **Success Response:** Status 200 OK
  ```json
    {
      "updatedTask": {
        "id": 28,
        "user_id": 1,
        "category_id": null,
        "title": "Updated swimming",
        "task_content": "Updated Content",
        "created_at": "2026-01-10T11:29:17.660Z",
        "updated_at": "2026-01-13T15:54:04.568Z",
        "completed": false
      }
    }
  ```
- **Error Response:** 
  - Status 404 Not Found
  - Status 400 Bad Request
  - Status 401 Unauthorized

---
### DELETE /tasks/:id
- **Description:** Deletes a task by the id.
- **Authentication**: Yes
- **Success Response:** Status 204 No Content
- **Error Response:** 
  - Status 404 Not Found
  - Status 400 Bad Request
  - Status 401 Unauthorized

---

### GET /categories
- **Description:** Returnes an array of all user's categories.
- **Authentication**: Yes
- **Success Response:** Status 200 OK
  ```json
    {
      "categories": [
        {
            "id": 2,
            "name": "Common things",
            "user_id": 1
        },
        {
            "id": 3,
            "name": "Food",
            "user_id": 1
        },
        {
            "id": 4,
            "name": "Sport",
            "user_id": 1
        },
      ]
    }
  ```
- **Error Response:**
  - Status 400 Bad Request
  - Status 401 Unauthorized

---

### POST /categories
- **Description:** Creates a new category.
- **Request body:**
  ```json
    {
        "name": "STRING (required)"
    }
  ```
- **Authentication**: Yes
- **Success Response:** Status 201 Created
- **Error Response:**
  - Status 400 Bad Request
  - Status 401 Unauthorized

---

### PUT /categories/:id
- **Description:** Updates a category by the id.
- **Request body:**
  ```json
    {
        "name": "STRING (required)"
    }
  ```
- **Authentication**: Yes
- **Success Response:** Status 200 OK
  ```json
    {
      "updatedCategory": {
        "id": 2,
        "name": "Common things",
        "user_id": 1
      }
    }
  ```
- **Error Response:**
  - Status 404 Not Found
  - Status 400 Bad Request
  - Status 401 Unauthorized

---

### DELETE /categories/:id
- **Description:** Deletes a category by the id.
- **Authentication**: Yes
- **Success Response:** Status 204 No Content
- **Error Response:**
  - Status 404 Not Found
  - Status 400 Bad Request
  - Status 401 Unauthorized

## Quick Testing

- Registration
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "securepassword", "email": "test@example.com"}'
```

- Receiving tasks
```bash
curl -X GET http://localhost:3000/tasks -H "Authorization: Bearer <token>"
```