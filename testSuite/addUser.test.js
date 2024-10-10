const request = require('supertest');
const User = require('../models/userModel');
const { Sequelize } = require('sequelize');
require("dotenv").config();

const app = require('../app');
const email = 'test1@gmail.com';

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT
  });

  describe('Database Connection Tests', () => {
    beforeAll(async () => {
        User.init(sequelize);
        await sequelize.authenticate(); 
    });

    afterAll(async () => {
        User.destroy({ where: { email: email } });
        await sequelize.close(); 
    });

    it('should connect to the database successfully', async () => {
        await expect(sequelize.authenticate()).resolves.not.toThrow();
    });

    it('should create a new user with valid authentication', async () => {
        const userData = {
            email: email,
            password: 'newsecurepassword',
            first_name: 'New',
            last_name: 'User'
        };
        const response = await request(app)
            .post('/v1/user/')
            .send(userData);
        
        expect(response.statusCode).toBe(201);
    });
});