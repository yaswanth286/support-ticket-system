# Support Ticket Management System

A full-stack support ticket management system built as a junior full-stack developer technical assessment. Customers can submit and track support tickets; agents can view, triage, assign, and resolve them.

## Description

This application lets **customers** create support tickets and follow up with comments, while **agents** manage the full queue of tickets: changing status and priority, assigning tickets to agents, and responding to customers. All authorization is enforced on the backend — the frontend simply reflects what a user is allowed to do.

## Features

- Customer registration and login (JWT-based authentication)
- Agent login (agent accounts are seeded — public registration always creates customers)
- Ticket creation, viewing, updating, and deletion
- Threaded comments on tickets
- Role-based authorization (customer vs. agent) enforced server-side
- Ownership checks (customers can only see/act on their own tickets)
- Password hashing with bcrypt
- MySQL relational database with foreign keys and JOIN-based queries
- REST API with consistent JSON responses and correct HTTP status codes
- Automated backend tests (Jest + Supertest)
- Postman collection for manual/API testing
- Responsive, polished React UI with loading/error/empty states

## Tech Stack

| Layer          | Technology                              |
|----------------|------------------------------------------|
| Frontend       | React.js, React Router, Axios            |
| Backend        | Node.js, Express.js                      |
| Database       | MySQL (`mysql2`)                         |
| Authentication | JWT, bcrypt                              |
| Testing        | Jest, Supertest                          |
| API testing    | Postman                                  |
| Dev tooling    | Nodemon                                  |

## Folder Structure

```
support-ticket-system/
├── backend/          # Express REST API
│   ├── config/        # DB pool + JWT config
│   ├── middleware/     # auth, authorization, error handling, validation
│   ├── routes/         # Express routers
│   ├── controllers/     # Request handlers
│   ├── services/        # Database access layer
│   ├── tests/           # Jest/Supertest tests
│   ├── app.js            # Express app (exported for tests)
│   └── server.js          # Starts the HTTP server
├── frontend/          # React application
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/         # Route-level pages
│       ├── context/        # AuthContext
│       └── services/        # Axios API service layer
├── database/          # schema.sql + seed.sql
├── postman/            # Postman collection
└── README.md
```

## Prerequisites

- Node.js (v18+ recommended)
- npm
- MySQL (v8+ recommended)
- Git
- Postman (optional, for API testing)

## Installation

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Database Setup

1. Make sure MySQL is running locally.
2. Create the database and tables:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
3. Load the demo seed data:
   ```bash
   mysql -u root -p support_tickets < database/seed.sql
   ```

## Environment Setup

### Backend (`backend/.env`)

Copy the example file and fill in your local MySQL credentials:

```bash
cd backend
cp .env.example .env
```

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=support_tickets
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=1d
PORT=5000
FRONTEND_ORIGIN=http://localhost:3000
```

### Frontend (`frontend/.env`)

```bash
cd frontend
cp .env.example .env
```

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Backend

```bash
cd backend
npm run dev
```

The API will be available at `http://localhost:5000/api`.

### Frontend

```bash
cd frontend
npm start
```

The app opens at `http://localhost:3000`.

## Demo Credentials

| Role     | Email                 | Password      |
|----------|------------------------|----------------|
| Customer | customer@example.com   | Customer@123   |
| Agent    | agent@example.com      | Agent@123      |

(A couple of extra demo users — `jane.doe@example.com` and `alex.agent@example.com` — are also seeded, using the same respective passwords.)

## API Documentation

Base path: `/api`

### Authentication
| Method | Endpoint             | Description                    | Auth |
|--------|------------------------|----------------------------------|------|
| POST   | `/auth/register`       | Register a new customer account | No   |
| POST   | `/auth/login`           | Log in and receive a JWT         | No   |

### Tickets
| Method | Endpoint             | Description                                  | Auth        |
|--------|------------------------|-------------------------------------------------|--------------|
| GET    | `/tickets`             | List tickets (own for customers, all for agents) | Yes         |
| POST   | `/tickets`               | Create a ticket                                 | Yes (customer or agent) |
| GET    | `/tickets/:id`            | Get a single ticket                              | Yes (owner or agent) |
| PUT    | `/tickets/:id`             | Update status/priority/assignment                 | Agent only  |
| DELETE | `/tickets/:id`               | Delete a ticket                                     | Owner or agent |

### Comments
| Method | Endpoint                     | Description               | Auth                  |
|--------|--------------------------------|------------------------------|--------------------------|
| GET    | `/tickets/:id/comments`          | List comments on a ticket    | Yes (owner or agent)    |
| POST   | `/tickets/:id/comments`            | Add a comment                  | Yes (owner or agent)    |

### Users
| Method | Endpoint  | Description                    | Auth        |
|--------|------------|-----------------------------------|--------------|
| GET    | `/users`     | List agents (assignment purposes) | Agent only  |

All protected endpoints require an `Authorization: Bearer <token>` header.

## Testing

Backend tests use a real MySQL connection (via the same `.env` configuration), so make sure your database is running and the schema is applied before testing. It's recommended to point `DB_NAME` at a dedicated test database.

```bash
cd backend
npm test
```

This runs 18 Jest/Supertest tests across `tests/auth.test.js`, `tests/tickets.test.js`, `tests/comments.test.js`, and `tests/authorization.test.js`, covering registration, login, ownership checks, role-based authorization, and 404/401/403 handling.

## Postman

1. Open Postman.
2. Import `postman/support-ticket-system.postman_collection.json`.
3. Run **Login customer** and **Login agent** first — their test scripts automatically save `customerToken` and `agentToken` as collection variables.
4. Run **Create ticket** to populate `ticketId` for the rest of the ticket/comment requests.

## Security

- Passwords are hashed with bcrypt; plaintext passwords are never stored or returned.
- Authentication uses JWTs signed with a secret from `.env` (never committed).
- All SQL queries are parameterized (no string concatenation of user input).
- Ticket/comment ownership is enforced server-side, not just hidden in the UI.
- Agent-only endpoints check role via `requireRole` middleware.
- `user_id` for tickets/comments always comes from the JWT, never the request body.
- 401 is used for missing/invalid authentication, 403 for authenticated-but-not-authorized, 404 for missing resources.
- CORS is restricted to the configured frontend origin.
- `.env` is git-ignored; only `.env.example` is committed.

## Deployment

The app is deployment-ready but **not currently deployed**.

- **Backend**: deployable to Railway or Render. Set the environment variables from `backend/.env.example` (including a production `JWT_SECRET` and MySQL credentials) in the host's dashboard. The server reads `process.env.PORT`, so it will bind correctly on any platform.
- **Frontend**: deployable to Vercel or Netlify. Set `REACT_APP_API_URL` to your deployed backend's URL, then run `npm run build` (or let the platform build it) and deploy the `build/` folder.
- **Database**: use a managed MySQL instance (e.g. Railway MySQL, PlanetScale, or your host's MySQL add-on); run `database/schema.sql` then `database/seed.sql` against it.

Live URLs (fill in once deployed):

- Frontend: `<LIVE_FRONTEND_URL>`
- Backend: `<LIVE_BACKEND_URL>`

## Suggested Git Commit History

If initializing this as a fresh Git repository, a clean commit history might look like:

1. Initial project setup
2. Add MySQL schema
3. Implement authentication
4. Add JWT authorization
5. Implement ticket APIs
6. Implement comments
7. Build React authentication
8. Build customer dashboard
9. Build agent dashboard
10. Add automated tests
11. Add Postman collection
12. Prepare deployment
