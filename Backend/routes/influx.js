const express = require('express');
const router = express.Router();
const influxService = require('../services/influxService');


// New endpoint: Query by time range
router.get('/query/time-range', async (req, res) => {
    console.log('req.query', req.query);
    const { startTime, endTime , table, bucket} = req.query;


    try {
      const data = await influxService.queryInflux(startTime, endTime, table , bucket);
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  });

module.exports = router;