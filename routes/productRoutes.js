const express = require("express");
const isAuth = require("../middlewares/authMiddleware.js");
const {getAllProductsController, getSingleProductController, createProductController, updateProductController, deleteProductController, deleteAllProductsController, updateProductImageController} = require("../controllers/productController");
const singleUpload = require("../middlewares/multer.js");
const router = express.Router();

// Define routes
// Get all products
router.get('/get-all', getAllProductsController);

// get single products
router.get("/singleproduct/:id", getSingleProductController);

// create products
router.post('/create',isAuth, singleUpload, createProductController)

// update product
router.put('/updateproduct/:id', isAuth, updateProductController); 

// update product image
router.put("/image/:id", isAuth, singleUpload,updateProductImageController )

// delete product
router.delete('/deleteproduct/:id', isAuth, singleUpload, deleteProductController)


// delete all product
router.delete('/deleteall', isAuth, singleUpload, deleteAllProductsController)
module.exports = router;