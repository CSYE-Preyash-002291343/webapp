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

sequelize.before('query', (options) => {
    options.startTime = process.hrtime();
  });

dbconnect();

sequelize.after('query', (options) => {
    if (options.startTime) {
      const duration = process.hrtime(options.startTime);
      const durationInMs = (duration[0] * 1000) + (duration[1] / 1000000);
      
      // Send metrics with query type and table name if available
      const queryType = options.type || 'unknown_query';
      const table = options.tableNames ? options.tableNames[0] : 'unknown_table';
      statsd.timing(`db.${queryType}.${table}.response_time`, durationInMs);
    }
  });

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