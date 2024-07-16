const express = require("express");
const isAuth = require("../middlewares/authMiddleware.js");
const { createCategoryController } = require("../controllers/categoryController.js");
const router = express.Router();

// routes

// create category
router.post('/create', isAuth,createCategoryController)



module.exports = router;
