const express = require('express');
const app = express();
const morgan = require('morgan'); // Import Morgan
const fs = require('fs');
const path = require('path');
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

const logFilePath = path.join(__dirname, 'webapp.log');

if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '');
}

const accessLogStream = fs.createWriteStream(logFilePath, { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

//Database connection via Sequelize ORM
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT
  });

//Check if database connection is successfull for Database
async function dbconnect(){
    try{
        let start = process.hrtime();
        await sequelize.authenticate();
        let duration = process.hrtime(start);
        let durationInMs = (duration[0] * 1000) + (duration[1] / 1000000);
        statsd.timing('db.connection_time', durationInMs);

        start = process.hrtime();
        User.init(sequelize);
        duration = process.hrtime(start);
        durationInMs = (duration[0] * 1000) + (duration[1] / 1000000);
        statsd.timing('db.user_init_time', durationInMs);

        start = process.hrtime();
        Image.init(sequelize);
        duration = process.hrtime(start);
        durationInMs = (duration[0] * 1000) + (duration[1] / 1000000);
        statsd.timing('db.image_init_time', durationInMs);

        start = process.hrtime();
        User.sync({alter: true});
        Image.sync({alter: true});
        duration = process.hrtime(start);
        durationInMs = (duration[0] * 1000) + (duration[1] / 1000000);
        statsd.timing('db.sync_time', durationInMs);

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