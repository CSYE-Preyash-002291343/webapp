const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const userRouter = require('../routes/user');

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashedPassword'))
}));

const app = express();
app.use(bodyParser.json());
app.use('/v1/user', userRouter);

jest.mock('../middleware/validatorForCreate', () => {
  return jest.fn((req, res, next) => next());
});

jest.mock('../controller/userController', () => ({
  createUser: jest.fn((req, res) => res.status(201).json({ message: 'User created' })),
  getUser: jest.fn(),
  updateUser: jest.fn()
}));

describe('User routes', () => {
  describe('POST /v1/user/', () => {
    it('should create a new user with valid data', async () => {
      const userData = { first_name: 'John', last_name: 'Doe', email: 'john@example.com', password: 'password123' };
      const response = await request(app)
        .post('/v1/user/')
        .send(userData);

      expect(response.statusCode).toBe(201);
      expect(jest.requireMock('../controller/userController').createUser).toHaveBeenCalled();
    });

    it('should return an error if validation fails', async () => {
      require('../middleware/validatorForCreate').mockImplementationOnce((req, res, next) => {
        res.status(400).json({ error: 'Invalid input' });
      });

      const invalidData = { first_name: '123', email: 'not-an-email' };
      const response = await request(app)
        .post('/v1/user/')
        .send(invalidData);

      expect(response.statusCode).toBe(400);
    });
  });
});

const restricted = ['options', 'head', 'delete', 'patch',];
restricted.forEach((method) => {
    it('should return 405', async () => {
        const response = await request(app)[method]('/v1/user/');
        expect(response.statusCode).toBe(405);
        expect(response.headers['cache-control']).toBe('no-store');
        expect(response.headers['pragma']).toBe('no-cache');
        expect(response.headers['expires']).toBe('0');
    });
});