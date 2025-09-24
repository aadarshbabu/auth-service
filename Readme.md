# Express Authentication Example

A small Express.js project demonstrating a modular authentication setup using Mongoose, JSON Web Tokens, bcrypt and Zod for validation. This repository contains a minimal structure for user registration and login with input validation and password hashing.

## Features

- Express 5 app (ES modules)
- MongoDB via Mongoose
- JWT-based authentication
- Password hashing with bcrypt
- Request validation with Zod
- Small utility wrappers for common tasks

## Prerequisites

- Node.js (>= 16) and npm
- A running MongoDB instance or connection URI (Atlas or local)

## Install

1. Clone the repo or copy the files to your workspace.
2. Install dependencies:

```bash
npm install
```

## Environment

Create a `.env` file in the project root (or set environment variables in your deployment). The app expects at least the following variables:

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret used to sign JWT tokens
- `PORT` - (optional) Port the server listens on (defaults to 3000)

Example `.env`:

```env
MONGO_URI=mongodb://localhost:27017/mydb
JWT_SECRET=your-strong-secret
PORT=3000
```

## Run

Start the app in development:

```bash
npm start
```

This runs the main script defined in `package.json`: `node src/app.js`.

## Project structure

Top-level files:

- `package.json` - project manifest and scripts
- `Readme.md` - this file

Source files (important paths):

- `src/app.js` - application entrypoint (Express app wiring, middleware, routes)
- `src/module/db/db.js` - Mongoose connection helper
- `src/module/auth/controller.js` - authentication route handlers
- `src/module/auth/service.js` - business logic for auth (register/login)
- `src/module/auth/modal.js` - Mongoose user model (note: filename uses "modal" in repo)
- `src/module/auth/schema/registerSchema.js` - Zod schema for registration
- `src/module/auth/schema/loginSchema.js` - Zod schema for login
- `src/utils/bcrypt.js` - bcrypt helper (hash/compare)
- `src/utils/zodError.js` - Zod error formatting helper

## How authentication works (high level)

1. Incoming requests hit routes wired in `src/app.js` and are forwarded to controller handlers.
2. Controllers validate input using Zod schemas in `src/module/auth/schema/`.
3. The service layer (`service.js`) handles hashing passwords via `utils/bcrypt.js`, creating users in MongoDB, and issuing JWTs using `jsonwebtoken`.
4. `src/module/db/db.js` opens the Mongoose connection using `MONGO_URI`.

## Database connection (details)

Current implementation

The repository includes `src/module/db/db.js` which exports a `connection` function that calls `mongoose.connect` with a hard-coded local URI (`mongodb://127.0.0.1:27017/test`) and logs success or error. That works for a local quick start but is brittle for production and for configurable environments.

What to know and recommended changes

- Use the `MONGO_URI` environment variable (already referenced elsewhere in this README) so the same code works with local MongoDB, Docker, or Atlas.
- Await `mongoose.connect(...)` (it's async) and surface connection errors so the app can act accordingly (retry, fail-fast, or exit).
- Add connection options and a simple retry/backoff or let a process manager restart the app on failure.
- Close the Mongoose connection on process shutdown signals for graceful shutdown.

Suggested improved `src/module/db/db.js`

```javascript
import mongoose from 'mongoose'

export const connection = async () => {
	const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/test'

	try {
		// mongoose.connect returns a promise; await it so errors can be handled
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			// pass any other options you need
		})
		console.log('MongoDB connected')
		return mongoose.connection
	} catch (error) {
		console.error('MongoDB connection error:', error)
		throw error // let the caller decide how to handle (retry / exit)
	}
}

// Optional: graceful shutdown helper (call once during app startup)
export const closeConnection = async () => {
	try {
		await mongoose.connection.close()
		console.log('MongoDB connection closed')
	} catch (err) {
		console.error('Error closing MongoDB connection', err)
	}
}
```

How to use it in `src/app.js`

- Import and call `await connection()` before starting the HTTP server (or handle connection failures). Example:

```javascript
import express from 'express'
import { connection } from './module/db/db.js'

const app = express()

const start = async () => {
	try {
		await connection()
		const port = process.env.PORT || 3000
		app.listen(port, () => console.log(`Server listening on ${port}`))
	} catch (err) {
		console.error('Failed to start app due to DB error', err)
		process.exit(1)
	}
}

start()
```

Notes on retry/backoff

- For simple projects, a process manager (PM2, Docker restart policy) can restart the process on failure. For more control add a retry loop with exponential backoff in `connection()`.
- Avoid silent swallowing of errors — log them and decide whether to retry or exit.

Security and connection options

- Keep credentials out of source control and in environment variables or secrets management systems.
- If connecting to Atlas or a managed DB, enable TLS/SSL and use the connection string provided by the provider.


## Scripts

- `npm start` - Runs `node src/app.js` (start server)
- `npm test` - Placeholder (prints an error); add tests and update this script as needed

## Recommendations & Next steps

- Add request logging (morgan or pino)
- Add rate limiting and helmet for security hardening
- Add tests (unit + integration) and CI
- Add a `.env.example` with required env vars (without secrets)
- Consider using a process manager (pm2) or containerization for production

## Contributing

Contributions are welcome. Open an issue or create a pull request describing changes or fixes.

## License

This project is licensed under ISC (see `package.json`).
