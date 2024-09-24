const express = require('express');
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3000;

//Database connection via Sequelize
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT
  });

app.get('/healthz', async (req, res) => {
    try{
        await sequelize.authenticate();
        res.header('Cache-Control', 'no-store');
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');
        res.sendStatus(200);
    }catch(err){
        res.sendStatus(503);
    }
});

app.all('*', (req, res) => {
    res.header('Cache-Control', 'no-store');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.sendStatus(200);
    res.sendStatus(405);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});