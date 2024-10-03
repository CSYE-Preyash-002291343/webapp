
# Webapp

This project is a RESTful API built with Node.js and Express, utilizing Sequelize as the ORM for PostgreSQL database management. It includes user management endpoints with robust validation and error handling mechanisms.

## Features

- User registration, authentication, and management.
- Secure password handling with bcrypt.
- Health check endpoint.
- Environment variable management with dotenv.
- Custom middleware for validation and error handling.

## Getting Started

### Prerequisites

Ensure you have Node.js and npm installed:
\```
node --version
npm --version
\```

### Installation

1. Clone the repository:
\```
git clone <repository-url>
cd <repository-directory>
\```

2. Install dependencies:
\```
npm install
\```

3. Set up environment variables:
Create a `.env` file in the root directory and update it with your database configuration and port number:
\```

    PORT=5000

    DB_NAME=your_database_name

    DB_USER=your_database_user

    DB_PASS=your_database_password

    DB_HOST=your_database_host

    DB_PORT=your_database_port

\```

### Running the Server

To start the server, run:
\```
npm start
\```

### API Endpoints

- **POST /v1/user/**: Register a new user.
- **GET /v1/user/self**: Fetch the authenticated user's data.
- **PUT /v1/user/self**: Update the authenticated user's data.
- **GET /healthz**: Health check.

### Structure

- `models/`: Contains Sequelize model definitions.
- `routes/`: Routing related files.
- `middleware/`: Middleware for authentication and payload validation.
- `controller/`: Business logic of the application.
- `testSuite/` : Unit Tests for the application.

### Testing

To run tests, execute:
\```
npm test
\```


## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## Acknowledgments

- Node.js community
- Sequelize documentation