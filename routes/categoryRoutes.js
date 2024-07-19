const express = require("express");
const isAuth = require("../middlewares/authMiddleware.js");
const { createCategoryController, getAllCategoryController, deleteAllCategoryController, deleteIdController, updateCategoryController } = require("../controllers/categoryController.js");
const router = express.Router();

// routes

// create category
router.post('/create', isAuth,createCategoryController)

// get all category
router.get('/get-all', getAllCategoryController)

// get all category
router.delete('/delete-all', deleteAllCategoryController)

// delete id category
router.delete('/delete/:id', isAuth, deleteIdController)

// update category
router.put('/update/:id', isAuth, updateCategoryController)

module.exports = router;
