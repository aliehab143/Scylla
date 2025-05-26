const router = require("express").Router();
const { detect, anomlay, detectCpuAnomaly, detectTempAnomaly, detectLogsAnomaly, detectLogsAnomalyCSV } = require("../controllers/model")
const { validateJWT } = require('../Middleware/validateJWT')


router.route("/detect/:id").get(detect);
router.route('/anomlay').get(anomlay)


router.route('/temp_anomaly_detector').post(validateJWT, detectTempAnomaly);
router.route('/cpu_anomaly_detector').post(validateJWT, async (req, res) => {
    const { data } = req.body

    const response = await detectCpuAnomaly(data)
    res.json(response)
});
router.route('/logs_anomaly_detector/json').post(validateJWT, async (req, res) => {
    // data -> logs
    const { data } = req.body;
    console.log('data is ', data)
    const response = await detectLogsAnomaly(data);
    res.json(response);

});
router.route('/logs_anomaly_detector/csv/:id').post(validateJWT, detectLogsAnomalyCSV);


module.exports = router;