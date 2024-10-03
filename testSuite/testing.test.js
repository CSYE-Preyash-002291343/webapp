const request = require('supertest');
const express = require('express');
const router = require('../routes/healthz');

const app = express();
app.use(express.json());
app.use(router);

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