const express = require('express');
const {
    registerController,
    loginController,
    getUserProfileController,
    logOutController
} = require('../controllers/userController');
const isAuth = require("../middlewares/authMiddleware.js");

// Create the router object
const router = express.Router();

// Define the routes
// Register
router.post('/register', registerController);

// Login
router.post('/login', loginController);


// Get user profile (protected route)
router.get('/profile', isAuth, getUserProfileController);

// logout
router.get('/logout', isAuth, logOutController)

// Export the router
module.exports = router;
