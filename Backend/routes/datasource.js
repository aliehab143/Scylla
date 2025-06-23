const router = require('express').Router();
const { validateJWT } = require('../Middleware/validateJWT');
const { uploadCSV, getCsv, addDatasource, getDatasourceById, deleteDatasource, updateDatasource , getPrometheusMetrics, getPrometheusMetrics2} = require('../controllers/datasource');

const multer = require('multer')
const upload = require('../Middleware/upload');

// user/all gets all datasources within user through userworkflow

// upload csv
router.route('/upload/csv').post(validateJWT, upload.single('file'), uploadCSV);

// add datasource
router.route('/new').post(validateJWT, addDatasource);

// get promethus quires 
router.route("/prometheus/get-queries/:id").get(validateJWT, getPrometheusMetrics);
// get promethus quires in correlation
router.route("/prometheus/queries/correlation/:id").get(validateJWT, getPrometheusMetrics2);


// Get , Update ,Delete datasource
router.route('/:id')
    .get(validateJWT, getDatasourceById)
    .put(validateJWT, updateDatasource)
    .delete(validateJWT, deleteDatasource)

module.exports = router;
