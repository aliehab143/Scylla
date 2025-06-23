const express = require('express');
const { registerUser, loginUser, getAllDatasources, getUserProfile, changePassword, updateUserProfile } = require('../services/userService'); 
const { validateJWT } = require('../Middleware/validateJWT')
const router = express.Router();

// Route for user registration
router.post('/register', async (req, res) => {
  const { statusCode, data } = await registerUser(req.body); 
  res.status(statusCode).json(data);
});

// Route for user login
router.post('/login', async (req, res) => {
  const { statusCode, data } = await loginUser(req.body); 
  res.status(statusCode).json(data);
});

// Get user profile
router.get('/profile', validateJWT, async (req, res) => {
  const { statusCode, data } = await getUserProfile(req.user.id);
  res.status(statusCode).json(data);
});

// Change password
router.post('/change-password', validateJWT, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { statusCode, data } = await changePassword(req.user.id, currentPassword, newPassword);
  res.status(statusCode).json(data);
});

// Update user profile
router.put('/profile', validateJWT, async (req, res) => {
  const { statusCode, data } = await updateUserProfile(req.user.id, req.body);
  res.status(statusCode).json(data);
});

// Get all datasources using userworkflowW
router.route('/all').get(validateJWT,getAllDatasources)

module.exports = router;
