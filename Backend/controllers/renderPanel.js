const axios = require('axios');
const grafanaAPI = require('../api/grafanaAPI');


const getPanel = async (req, res) => {
    
    // Get parameters from the request query
    const { uid, dashboard, panelId, from = "now-1h", to = "now", width = 450, height = 200, ...vars } = req.query;

    // Construct the URL for the Grafana Render API
    const url = `${process.env.GRAFANA_URL}/render/d-solo/${uid}/${dashboard}?panelId=${panelId}&from=${from}&to=${to}&width=${width}&height=${height}`;

    // Add any custom variables to the URL as query parameters
    const queryParams = new URLSearchParams(vars).toString();
    const fullUrl = queryParams ? `${url}&${queryParams}` : url;

    try {
        // Make a GET request to the Grafana Render API
        const response = await grafanaAPI.get(fullUrl, {
        responseType: "arraybuffer",  // Important for images
        });

        // Set response headers to return image
        res.set("Content-Type", "image/png");
        res.send(response.data);
    } catch (error) {
        console.error("Error fetching panel image:", error.message);
        res.status(500).json({ error: "Failed to fetch panel image" });
    }
}



module.exports = { getPanel };