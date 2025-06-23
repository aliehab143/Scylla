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
const routesInflux = require('./routes/influx.js');

const { getLokiLogs } = require('./controllers/dashboard.js');
const { detectLogsAnomaly, anomlay } = require('./controllers/model.js');
const { sendAlert } = require('./services/alertService');

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
app.use("/render-panel", routesRenderPanel)
app.use("/model", routesModel)
app.use("/workflow", routesUserWorkflow);
app.use("/datacorrelation", routesDatacorrelation);
app.use("/test", routesTest);
app.use("/influx", routesInflux);

const start = async () => {
  try {
    await connectDB()
    app.listen(port, console.log(`Express server running at http://localhost:${port}`))

    const fetchLokiData = async () => {
      try {
        console.log('Background fetch of Loki data started...');
        const url = process.env.LOKI_URL; 
        const end = new Date().toISOString();
        const start = new Date(Date.now() - 5 * 60 * 1000).toISOString(); // 5 minutes ago
        const params = {
          query: '{job="cloud-server-logs"}',
          limit: 10,
          start: start,
          end: end
        };
        const logs = await getLokiLogs(url,params);
        console.log('logs are',logs);
        const { sequences }  = await detectLogsAnomaly(logs);
        console.log('sequences are',sequences);
        
        sequences.forEach(seq => {
          if (seq.anomaly === true) {
            sendAlert(seq); // optionally pass the sequence to the alert
          }
        });

      } catch (error) {
        console.error('Background fetch error:', error.message);
      }
    };

    // Start background fetch every 30 seconds
    setInterval(fetchLokiData, 30 * 1000);

  } catch (error) {
    console.log('server is not connected')
  }
}

start()
