const request = require('supertest');
const express = require('express');
const app = express();
const { Sequelize } = require('sequelize');

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
});

describe('GET /healthz', () => {
    it('should return 200', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.headers['cache-control']).toBe('no-store');
        expect(response.headers['pragma']).toBe('no-cache');
        expect(response.headers['expires']).toBe('0');
    });
});

const restricted = ['post', 'put', 'delete', 'patch', 'options', 'head'];
restricted.forEach((method) => {
    it('should return 405', async () => {
        const response = await request(app)[method]('/');
        expect(response.statusCode).toBe(405);
        expect(response.headers['cache-control']).toBe('no-store');
        expect(response.headers['pragma']).toBe('no-cache');
        expect(response.headers['expires']).toBe('0');
    });
});

it('should return 400 for empty payload', async () => {
    const response = await request(app).get('/').send({});
    expect(response.statusCode).toBe(400);
});

it('should return 404 for wrong endpoints', async () => {
    const response = await request(app).get('/1');
    expect(response.statusCode).toBe(404);
});