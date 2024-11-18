const request = require('supertest');
const User = require('../models/userModel');
const { Sequelize } = require('sequelize');
require("dotenv").config();
const AWS = require('aws-sdk');
const express = require('express');

const app = require('../app');

jest.mock('aws-sdk', () => {
    const SNS = {
        publish: jest.fn().mockReturnValue({
            promise: jest.fn().mockResolvedValue({}),
        }),
    };
    return { SNS: jest.fn(() => SNS) };
});

const email = 'test@gmail.com';

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT
  });

  describe('Database Connection Tests', () => {
    beforeAll(async () => {
        await sequelize.authenticate(); 
        await User.init(sequelize);
    });

    afterAll(async () => {
        await User.destroy({ where: { email: email } });
        await sequelize.close(); 
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