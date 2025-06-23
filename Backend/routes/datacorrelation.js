const router = require('express').Router();
const { getDataCorrelation, createDataCorrelation } = require('../controllers/datacorrelation');
const { validateJWT } = require('../Middleware/validateJWT')

router.route('').post(validateJWT, createDataCorrelation);
router.route('/:id').get(validateJWT, getDataCorrelation);


module.exports = router;