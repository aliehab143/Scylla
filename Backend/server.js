require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan');
const winston = require('winston');

const app = express();
const port = 8001;


const fs = require('fs')
const FormData = require('form-data');

const connectDB = require('./database/database.js')
const routesDashboard = require('./routes/dashboard');
const routesDataSource = require('./routes/datasource');
const routesRenderPanel = require('./routes/renderPanel');
const routesModel = require('./routes/model');
const routesUser = require('./routes/user.js');
const routesTest = require('./routes/test.js');
const routesUserWorkflow = require('./routes/userworkflow.js');
const routesDatacorrelation = require('./routes/datacorrelation.js');


const { fetchLokiDataFile } = require('./controllers/dashboard.js');


app.use(cors());
app.use(express.json());
app.use(cookieParser())

// Configure Winston Logger with JSON format
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
    winston.format.json() // Output logs as JSON
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, 'logs/network.log'),
      level: 'debug',
    }),
    // new winston.transports.Console({
    //   level: 'info',
    // }),
  ],
});

// Middleware to log HTTP requests
app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`, {
    method: req.method,
    url: req.url,
  });
  next();
});

app.use('/user', routesUser);
app.use('/dashboard', routesDashboard);
app.use('/datasource', routesDataSource);
app.use("/render-panel",routesRenderPanel)
app.use("/model", routesModel)
app.use("/workflow",routesUserWorkflow);
app.use("/datacorrelation",routesDatacorrelation);
app.use("/test",routesTest);


const start = async() => {
    try {
        await connectDB()
        app.listen(port , console.log(`Express server running at http://localhost:${port}`))


        // setInterval(async () => {
        //     try {
        //       console.log('Background fetch of Loki data started...');
        //       await fetchLokiDataFile(); // Call the extracted function
        //       console.log('Background fetch completed.');
        //     } catch (error) {
        //       console.error('Background fetch error:', error.message);
        //     }
        //   }, 30 * 1000); // Every 30 seconds
    } catch (error) {
        console.log('server is not connected')
    }
}

start()
