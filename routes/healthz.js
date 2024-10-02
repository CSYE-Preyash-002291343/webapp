const express = require('express');
const router = express();
require("dotenv").config();
const payload = require('../middleware/Payload');

//Database connection via Sequelize ORM
const { Sequelize } = require('sequelize');
const sequelize1 = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT
  });

//Error handling middleware to not show client error messages in body
router.use((err, req, res, next) => {
    if(err.status === 400){
        res.status(400).send();
    }
    next();
});

router.head('/', payload, async (req, res) => {
    res.header('Cache-Control', 'no-store');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.status(405).send();
});

//healthz endpoint
router.get('/', payload, async (req, res) => {
    try{
        await sequelize1.authenticate();
        res.header('Cache-Control', 'no-store');
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');
        res.status(200).send();
    }catch(err){
        res.status(503).send();
    }
});

//405 method not allowed for any other endpoint
router.all('/',  (req, res) => {
    res.header('Cache-Control', 'no-store');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.status(405).send();
});

//404 not found for wrong endpoints
router.all('*', (req, res) => {
    res.header('Cache-Control', 'no-store');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.status(404).send();
});

module.exports = router;