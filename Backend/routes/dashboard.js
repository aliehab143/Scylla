const router = require('express').Router();
const {getAllDashboards, getDashboardrById, addDashboard, deleteDashboard } = require('../controllers/dashboard');
const { validateJWT } = require('../Middleware/validateJWT');

router.route('/').get(validateJWT,getAllDashboards);

// id of dashbaord
router.route('/:uid').get(validateJWT,getDashboardrById);
// id of datasource
router.route('/:uid').post(validateJWT,addDashboard);
// Delete dashboard
router.route('/:uid').delete(validateJWT, deleteDashboard);
// router.route('/:id').post(validateJWT,addDatasource);



module.exports = router;