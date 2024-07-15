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
const isAuth = require("../middlewares/authMiddleware.js");
const singleUpload = require('../middlewares/multer.js');

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


// update profile
router.put('/profile-update', isAuth, updateProfileController )

// update password
router.put('/update-password', isAuth, updatePasswordController)

// UPDATE PROFILE PIC
router.put('/update-picture', (req,res)=>{
    console.log(req.body);
});

// Export the router
module.exports = router;
