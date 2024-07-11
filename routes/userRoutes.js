const express = require('express');
// const registerController = require('../controllers/userController.js');
const user = require('../controllers/userController');

// router object 
const router = express.Router()

// routes
// register
// router.post('/register',registerController)
router.post('/register',user.registerController)

// login
router.post('/login',user.loginController)

// export
module.exports = router;
