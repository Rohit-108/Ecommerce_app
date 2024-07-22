const express = require("express");
const isAuth = require("../middlewares/authMiddleware.js");
const { createOrderController, getAllOrderController, getSingleOrderController } = require("../controllers/OrderController.js");

const router = express.Router();

// routes

// create category
router.post('/create', isAuth,createOrderController)

// get all order
router.get("/my-orders",isAuth, getAllOrderController )


// get single order details
router.get("/my-orders/:id", isAuth, getSingleOrderController )

module.exports = router;
