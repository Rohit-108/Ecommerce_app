const express = require('express');
const {
    registerController,
    loginController,
    getUserProfileController,
    logOutController,
    updateProfileController,
    updatePasswordController,
    updateProfilePicController,
} = require('../controllers/userController');
const multer = require('multer');
const isAuth = require("../middlewares/authMiddleware.js");
const singleUpload = require('../middlewares/multer.js');
const allupload = multer({ dest: 'uploads/' });

// Create the router object
const router = express.Router();

// Define the routes
// Register
router.post('/register', registerController);

// Login
router.post('/login', loginController);

// Get user profile (protected route)
router.get('/profile', isAuth, getUserProfileController);

// Logout
router.get('/logout', isAuth, logOutController);

// Update profile
router.put('/profile-update', isAuth, updateProfileController);

// Update password
router.put('/update-password', isAuth, updatePasswordController);

// Update profile picture
// router.put('/update-picture', isAuth, singleUpload, updateProfilePicController);
router.put("/update-picture", isAuth, singleUpload, updateProfilePicController);

// Export the router
module.exports = router;


