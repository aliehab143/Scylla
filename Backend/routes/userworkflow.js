const router = require('express').Router();

const { validateJWT } = require('../Middleware/validateJWT');
const { getAllDatasources, addDatasource, addDashboard ,getDashboardById, getDatasourceById } = require('../controllers/userworkflow')
// const { registerUser, loginUser } = require('../controllers/user'); 

// user get all datasources
router.route('').get(validateJWT,getAllDatasources);

router.route('/add-datasource/:id').post(validateJWT,addDatasource);
router.route('/add-dashboard/:id').post(validateJWT,addDashboard);



// not applicable
router.route('/datasource/:id').get(validateJWT,getDatasourceById);
// not applicable
router.route('/dashboard/:id').get(validateJWT,getDashboardById);
// router.route('/add-datasource/:id').put(validateJWT,updateDatasource);
// router.route('/add-dashboard/:id').put(validateJWT,updateDashboard);

// user get specfic datasource of user by using datasource id 
// ----- this will be datasource scheama 
// user add datasource 
// user update datasource information 


module.exports = router;
