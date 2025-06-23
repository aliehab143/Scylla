const axios = require('axios');

const ALERT_SERVICE_URL = 'http://localhost:8010/process-anomaly';
const ALERT_USER_SERVICE_URL = 'https://musical-anchovy-blatantly.ngrok-free.app/webhook/eb451b73-1430-48ed-914d-9d0e492e098a';
const ADMIN_EMAILS = ['aliehab143@gmail.com']; 

/**
 * Sends an alert to the alert service when an anomaly is detected
 * @param {Object} sequence - The anomaly sequence data
 */
const sendAlert = async (sequence) => {
  try {
    // Transform the sequence data into the required format
    const alertData = {
      emails: ADMIN_EMAILS,
      timestamp: new Date().toISOString(),
      user_actions: [
        {
          user_id: sequence.uid || 0,
          // don't know why model takes username and dataset have only uid
          user_name: sequence.uid || 'Unknown User',
          actions: sequence.sequence || ['unknown_action']
        }
      ]
    };

    // Send POST request to alert service
    const response = await axios.post(ALERT_SERVICE_URL, alertData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Alert sent successfully:', response.data);

    const alertUserData = {
      databaseurl: "mongodb+srv://ahmedmokhtar2407:1234@cluster1.0ddauuc.mongodb.net/csv",
      name: sequence.uid,
      status: "inactive",
      email: ADMIN_EMAILS[0],
    }


    const alertUser = await axios.post(ALERT_USER_SERVICE_URL,alertUserData);
    return response.data;
  } catch (error) {
    console.error('Failed to send alert:', error.message);
    throw error;
  }
};

module.exports = {
  sendAlert
}; 