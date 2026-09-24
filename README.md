# Support Ticket Management System

A full-stack customer support ticket management system built with **React.js, Node.js, Express.js, and MySQL**.

The application provides separate experiences for **customers and support agents**, with JWT authentication, role-based authorization, ticket management, comments, agent assignment, and automated API tests.

## 🚀 Features

### Customer

* Register and login securely
* Create support tickets
* View own tickets
* View ticket details
* Add comments to tickets
* Track ticket status and priority
* Delete own tickets

### Support Agent

* Login using an agent account
* View all customer tickets
* Update ticket status
* Change ticket priority
* Assign tickets to agents
* View and respond to customer comments
* Delete tickets when authorized

### Security & Backend

* JWT-based authentication
* bcrypt password hashing
* Role-based authorization
* Server-side ticket ownership validation
* Parameterized SQL queries
* Protected API routes
* Centralized error handling
* Correct HTTP status codes
* CORS configuration
* Separate MySQL database for automated tests

### Testing

* Jest + Supertest
* 18 automated backend tests
* Authentication testing
* Authorization testing
* Ticket API testing
* Comment API testing
* Ownership validation
* 401 / 403 / 404 error handling

---

## 🛠️ Tech Stack

| Layer             | Technology           |
| ----------------- | -------------------- |
| Frontend          | React.js             |
| Routing           | React Router         |
| HTTP Client       | Axios                |
| Backend           | Node.js + Express.js |
| Database          | MySQL 8              |
| Authentication    | JWT                  |
| Password Security | bcrypt               |
| Testing           | Jest + Supertest     |
| API Testing       | Postman              |
| Development       | Nodemon              |
| Version Control   | Git + GitHub         |

---

## 📁 Project Structure

```text
support-ticket-system/
│
├── backend/
│   ├── config/          # Database and JWT configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Authentication, authorization, validation
│   ├── routes/          # Express API routes
│   ├── services/        # Database/business logic
│   ├── tests/           # Jest + Supertest tests
│   ├── app.js           # Express application
│   ├── server.js        # Server entry point
│   ├── db.js            # Database connection export
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Application pages
│   │   ├── context/     # Authentication context
│   │   └── services/    # Axios API services
│   └── package.json
│
├── database/
│   ├── schema.sql       # Main database schema
│   └── seed.sql         # Demo users/data
│
├── postman/
│   └── support-ticket-system.postman_collection.json
│
├── .gitignore
└── README.md
```

---

# ⚙️ Prerequisites

Install the following before running the project:

* **Node.js 18+**
* **npm**
* **MySQL 8+**
* **Git**
* **Postman** (optional)

Check your installations:

```powershell
node --version
npm --version
mysql --version
git --version
```

---

# 🗄️ Database Setup

## 1. Start MySQL

Make sure the MySQL server is running.

On Windows, the MySQL service is typically:

```text
MySQL80
```

## 2. Create the database

Open MySQL:

```powershell
mysql -u root -p
```

Then run:

```sql
CREATE DATABASE support_tickets;
EXIT;
```

## 3. Apply the schema

From the project root:

```powershell
mysql -u root -p support_tickets < database/schema.sql
```

## 4. Load demo data

```powershell
mysql -u root -p support_tickets < database/seed.sql
```

The application uses:

```text
support_tickets
```

for normal development.

Automated tests use a separate database:

```text
support_tickets_test
```

This prevents test-created users, tickets, and comments from affecting the presentation/development database.

---

# 🔐 Environment Variables

## Backend

Create:

```text
backend/.env
```

Example:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=support_tickets

JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d

PORT=5000
FRONTEND_ORIGIN=http://localhost:3000
```

Never commit `.env` to GitHub.

The project includes `.env.example` as a template.

## Frontend

Create:

```text
frontend/.env
```

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

# 📦 Installation

## Backend

```powershell
cd backend
npm install
```

## Frontend

Open another terminal:

```powershell
cd frontend
npm install
```

---

# ▶️ Running the Application

## Start Backend

From the `backend` directory:

```powershell
npm run dev
```

The API runs on:

```text
http://localhost:5000
```

API base path:

```text
http://localhost:5000/api
```

## Start Frontend

From the `frontend` directory:

```powershell
npm start
```

The React application runs on:

```text
http://localhost:3000
```

---

# 👤 Demo Accounts

The database seed contains customer and agent accounts.

| Role     | Email                                                   | Password     |
| -------- | ------------------------------------------------------- | ------------ |
| Customer | [customer@example.com](mailto:customer@example.com)     | Customer@123 |
| Customer | [jane.doe@example.com](mailto:jane.doe@example.com)     | Customer@123 |
| Agent    | [agent@example.com](mailto:agent@example.com)           | Agent@123    |
| Agent    | [alex.agent@example.com](mailto:alex.agent@example.com) | Agent@123    |

Additional agent accounts are available for testing different assignment scenarios.

> These credentials are intended only for local/demo use.

---

# 🔌 API Documentation

Base URL:

```text
/api
```

## Authentication

| Method | Endpoint         | Description           | Authentication |
| ------ | ---------------- | --------------------- | -------------- |
| POST   | `/auth/register` | Register customer     | No             |
| POST   | `/auth/login`    | Login and receive JWT | No             |

## Tickets

| Method | Endpoint       | Description                       | Authentication |
| ------ | -------------- | --------------------------------- | -------------- |
| GET    | `/tickets`     | List accessible tickets           | Yes            |
| POST   | `/tickets`     | Create a ticket                   | Yes            |
| GET    | `/tickets/:id` | Get ticket details                | Yes            |
| PUT    | `/tickets/:id` | Update status/priority/assignment | Agent          |
| DELETE | `/tickets/:id` | Delete ticket                     | Owner/Agent    |

## Comments

| Method | Endpoint                | Description         | Authentication |
| ------ | ----------------------- | ------------------- | -------------- |
| GET    | `/tickets/:id/comments` | Get ticket comments | Yes            |
| POST   | `/tickets/:id/comments` | Add a comment       | Yes            |

## Users

| Method | Endpoint | Description                | Authentication |
| ------ | -------- | -------------------------- | -------------- |
| GET    | `/users` | List agents for assignment | Agent          |

Protected endpoints require:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 🧪 Automated Testing

The backend uses **Jest + Supertest**.

Run:

```powershell
cd backend
npm test
```

The project currently contains:

```text
4 test suites
18 tests
18 passed
```

Test coverage includes:

* Customer registration
* Login
* JWT authentication
* Ticket creation
* Ticket retrieval
* Ticket updates
* Ticket deletion
* Comments
* Customer ownership checks
* Agent authorization
* Invalid authentication
* Unauthorized access
* Missing resources
* HTTP 401 / 403 / 404 responses

Tests automatically use:

```text
support_tickets_test
```

instead of the normal:

```text
support_tickets
```

database.

---

# 📮 Postman

A Postman collection is included in:

```text
postman/support-ticket-system.postman_collection.json
```

Import the collection into Postman.

Recommended testing flow:

```text
1. Login customer
        ↓
2. Create ticket
        ↓
3. View ticket
        ↓
4. Add comment
        ↓
5. Login agent
        ↓
6. View tickets
        ↓
7. Assign ticket
        ↓
8. Update status/priority
        ↓
9. Add agent comment
```

The collection automatically stores authentication tokens and the created ticket ID for subsequent requests.

---

# 🔒 Security

The application implements several backend security measures:

* Passwords are hashed using bcrypt.
* Password hashes are never returned through the API.
* JWT authentication protects private endpoints.
* JWT secrets are stored in environment variables.
* SQL queries use parameterized values.
* Customer ownership is verified server-side.
* Agent-only operations require agent authorization.
* Ticket `user_id` is derived from the authenticated JWT rather than trusted from the request body.
* Authentication failures return `401`.
* Authorization failures return `403`.
* Missing resources return `404`.
* CORS is restricted to the configured frontend origin.
* `.env` files are excluded from Git.

---

# 🧩 Database Design

The system uses three main relational tables:

```text
users
  │
  ├───────────────┐
  │               │
  ▼               ▼
tickets       ticket_comments
  │
  └───────────────┘
```

### users

Stores:

* Customer accounts
* Agent accounts
* Roles
* Hashed passwords

### tickets

Stores:

* Ticket owner
* Subject
* Description
* Priority
* Status
* Assigned agent
* Timestamps

### ticket_comments

Stores:

* Ticket reference
* Comment author
* Comment content
* Timestamp

Foreign keys maintain relationships between the tables.

---

# 🌐 Deployment

The application is structured for deployment but is **not currently deployed**.

Potential deployment architecture:

```text
React Frontend
      │
      ▼
   REST API
      │
      ▼
 Node/Express
      │
      ▼
 Managed MySQL
```

Possible hosting options include:

* Frontend: Vercel / Netlify
* Backend: Railway / Render
* Database: Managed MySQL provider

Before production deployment:

* Use a strong production JWT secret.
* Configure production environment variables.
* Configure the production frontend origin.
* Use a managed production database.
* Do not use demo passwords in production.
* Do not commit `.env` files.

---

# 📌 Current Project Status

| Component                | Status          |
| ------------------------ | --------------- |
| Customer authentication  | ✅ Complete      |
| Agent authentication     | ✅ Complete      |
| JWT authorization        | ✅ Complete      |
| Ticket management        | ✅ Complete      |
| Ticket comments          | ✅ Complete      |
| Agent assignment         | ✅ Complete      |
| Role-based authorization | ✅ Complete      |
| MySQL database           | ✅ Complete      |
| React frontend           | ✅ Complete      |
| Postman collection       | ✅ Complete      |
| Automated tests          | ✅ 18/18 passing |
| Git repository           | ✅ Complete      |
| Deployment               | ⏳ Not deployed  |

---

# 👨‍💻 Project Purpose

This project demonstrates practical full-stack development skills including:

* REST API development
* React application development
* Relational database design
* Authentication and authorization
* Role-based access control
* API integration
* SQL queries and relationships
* Automated backend testing
* API testing with Postman
* Git/GitHub workflow
* Secure environment configuration

---

## License

This project was created for educational, portfolio, and technical assessment purposes.
