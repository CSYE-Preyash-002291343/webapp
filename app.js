const express = require('express');
const app = express();
require("dotenv").config();
const userRouter = require('./routes/user');
const healthzRouter = require('./routes/healthz');
const picRouter = require('./routes/pic');
const User = require('./models/userModel.js');
const { Image } = require('./models/imageModel.js');
const StatsD = require('hot-shots');
const statsd = new StatsD();

const PORT = process.env.PORT || 3000;
app.use(express.json());

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
        Image.init(sequelize);
        User.sync({alter: true});
        Image.sync({alter: true});
        console.log('Connected to DB');
    }catch(err){
        console.error('Disconnected from DB', err);
    }
}
dbconnect();

app.use((req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInMs = (duration[0] * 1000) + (duration[1] / 1000000);

    statsd.increment(`${req.path}`);
    statsd.timing(`${req.path}.response_time`, durationInMs);
  });

  next();
});

app.use('/healthz', healthzRouter);
app.use('/v1/user/', userRouter);
app.use('/v1/user/self/pic', picRouter)

app.all('*', (req, res) => {
    res.header('Cache-Control', 'no-store');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.status(404).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;