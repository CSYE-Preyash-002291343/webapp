const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require("dotenv").config();

const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

//Database connection via Sequelize ORM
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT
  });

//Payload method to check if request body is empty
function payload (req, res, next) {
    if(Object.keys(req.body).length !== 0 || Object.keys(req.query).length !== 0){
        res.status(400).send();       
    } else {
        next();
    }
}

//Added healthz endpoint
app.get('/healthz', payload, async (req, res) => {
    try{
        await sequelize.authenticate();
        res.header('Cache-Control', 'no-store');
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');
        res.status(200).send();
    }catch(err){
        res.status(503).send();
    }
});

//Added method to handle all other methods
app.all('*',  (req, res) => {
    res.header('Cache-Control', 'no-store');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.status(405).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});