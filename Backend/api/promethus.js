const axios = require('axios');

const prometheusAPI = axios.create({
  baseURL: process.env.PROMETHUES_URL,
});

module.exports = prometheusAPI;
