const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
require('dotenv').config();
const bcrypt = require('bcrypt');
const authenticateUser = require('../middleware/authenticator');
const userController = require('../controller/userController');
const validateCreateUser = require('../middleware/validatorForCreate');
const validateUpdateUserInfo = require('../middleware/validatorForUpdate');

//create user
router.post('/', validateCreateUser, userController.createUser);

router.head('/self', async (req, res) => {
    res.status(405).send();
});

//get user by id
router.get('/self', authenticateUser, userController.getUser);

//update user by id
router.put('/self', validateUpdateUserInfo, authenticateUser, userController.updateUser);

//method to handle all other requests with 405
router.all('*', (req, res) => {
    res.header('Cache-Control', 'no-store');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.status(405).send();
});

module.exports = router;