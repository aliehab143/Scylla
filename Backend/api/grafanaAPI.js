const axios = require('axios');

const grafanaAPI = axios.create({
  baseURL: process.env.GRAFANA_URL,
  headers: {
    'Authorization': `Bearer ${process.env.GRAFANA_TOKEN}`
  }
});

module.exports = grafanaAPI;
