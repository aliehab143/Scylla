const router = require('express').Router();

const { validateJWT } = require('../Middleware/validateJWT')
// Route for user registration
router.route('/test').get(validateJWT);

// Route for user login

module.exports = router;
