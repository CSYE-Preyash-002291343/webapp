const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require("dotenv").config();
const userRouter = require('./routes/user');
const healthzRouter = require('./routes/healthz');
const User = require('./models/userModel.js');

const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

//Database connection via Sequelize ORM
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT
  });

//Check if database connection is successful
async function dbconnect(){
    try{
        await sequelize.authenticate();
        User.init(sequelize);
        User.sync();
        console.log('Connected to DB');
    }catch(err){
        console.error('Disconnected from DB');
    }
}
dbconnect();

app.use('/healthz', healthzRouter);
app.use('/v1/user/', userRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});