const axios = require('axios');

const modelAPI = axios.create({
  baseURL: process.env.modelAPI,
});

module.exports = modelAPI;
