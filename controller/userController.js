const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const auth = require('basic-auth');

exports.createUser = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.header('Cache-Control', 'no-store');
            res.header('Pragma', 'no-cache');
            res.header('Expires', '0');
            return res.status(400).send();
        }
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await User.create({ first_name, last_name, email, password : hashedPassword });

        const { password: _, ...userData } = user.toJSON();
        res.header('Cache-Control', 'no-store');
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');
        return res.status(201).json(userData);
    }
    catch (error) {
        return res.status(400).send('');
    }
};

exports.getUser = async (req, res) => {

  try {
    const { password: _, ...userData } = req.user;
    res.header('Cache-Control', 'no-store');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    return res.json(userData);
  } catch (error) {
    return res.status(500).send();
  }
};

exports.updateUser = async (req, res) => {
    const cred = auth(req);
    const { first_name, last_name, password } = req.body;

    if (!cred) {
        return res.status(401).send();
    }

    try {
        const updateData = {};
        if (first_name) {
            updateData.first_name = first_name;
            updateData.account_updated = new Date();
        }
        if (last_name) {
            updateData.last_name = last_name;
            updateData.account_updated = new Date();
        }
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
            updateData.account_updated = new Date();
        }

        await User.update(updateData, { where: { email: cred.name } });
        res.header('Cache-Control', 'no-store');
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');
        return res.status(204).send();
    } catch (error) {
        return res.status(400).send();
    }
};