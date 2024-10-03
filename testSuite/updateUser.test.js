const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const validateUpdateUserInfo = require('../middleware/validatorForUpdate');
const authenticateUser = require('../middleware/authenticator');
const userController = require('../controller/userController');

jest.mock('../models/userModel');
const app = express();
app.use(bodyParser.json());
app.put('/self', validateUpdateUserInfo, authenticateUser, userController.updateUser);

describe('User Route Tests', () => {
    it('should update user when authenticated with correct data', async () => {
      User.findOne.mockResolvedValue({
        email: 'username',
        password: await bcrypt.hash('password', 10)
      });
      User.update.mockResolvedValue([1]); 
      const response = await request(app)
        .put('/self')
        .auth('username', 'password')
        .send({ first_name: 'Jane', last_name: 'Doe', password: 'newpassword' });
      expect(response.status).toBe(204);
    }); 
});

describe('User Route Authentication', () => {
    it('should fail to update user when authentication fails', async () => {
      User.findOne.mockResolvedValue(null);
      const response = await request(app)
        .put('/self')
        .auth('username', 'wrongpassword')
        .send({ first_name: 'Jane', last_name: 'Doe', password: 'newpassword' });
      expect(response.status).toBe(401);
    });
});

describe('User Route Invalid Data', () => {  
    it('should fail to update user due to invalid data', async () => {
      User.findOne.mockResolvedValue({
        email: 'username',
        password: await bcrypt.hash('password', 10)
      });
      const response = await request(app)
        .put('/self')
        .auth('username', 'password')
        .send({ first_name: '1234', last_name: 'Doe2', password: 'newpassword' });
      expect(response.status).toBe(400); 
    });
});
