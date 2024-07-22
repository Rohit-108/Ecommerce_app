const orderModel = require("../models/orderModel.js");
const productModel = require("../models/productModel.js");
// create order
const createOrderController = async(req,res)=>{
    try{
         const {shippingInfo, orderItems, paymentMethod, paymentInfo, itemPrice, tax, shippingCharges, totalAmount} = req.body;
        //  validation
        if(!shippingInfo || !orderItems || !paymentMethod || !paymentInfo || !itemPrice || !tax || !shippingCharges  ||!totalAmount ){
            return res.status(404).send({
                sucees:false,
                message :"please provide  required information"
            })
        }
        // create order
        await orderModel.create({
            user: req.user._id,
            shippingInfo,
            orderItems, 
            paymentMethod, paymentInfo, 
            itemPrice, 
            tax, 
            shippingCharges, totalAmount,

        })

        // stock update
        // Stock update
        for (let i = 0; i < orderItems.length; i++) {
            // Find product
            const product = await productModel.findById(orderItems[i].product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product with ID ${orderItems[i].product} not found`
                });
            }
            product.stock -= orderItems[i].quantity;
            await product.save();
        }
        res.status(201).send({
            sucees:true,
            message : "Order Placed Successfully"
        });
    }catch(error){
         console.log(error);
         res.status(500).send({
            success:false,
            message:"Error in Create Order API",
            error:error.message
         })
    }
};

// json for create order
// {
    //     "shippingInfo": {
    //         "address": "mumbai",
    //         "city": "delhi",
    //         "country": "India"
    //     },
    //     "orderItems": [
    //         {
    //             "name": "iphone 16",
    //             "price": 150000,
    //             "stock": 25,
    //             "quantity": 1,
    //             "image": "",
    //             "product": ""
    //         }
    //     ],
    //     "paymentMethod": "ONLINE",
    //     "paymentInfo": {
    //         "id": "",
    //         "status": "succeeded"
    //     },
    //     "itemPrice": 999,
    //     "tax": 1,
    //     "shippingCharges": 1,
    //     "totalAmount": 150001
    // }

// get all orders
const getAllOrderController = async(req,res)=>{
    try{
        const orders = await orderModel.find({user:req.user._id})
        // validation
        if(!orders){
            return res.status(404).send({
                success:false,
                message:"no order found"
            })
        }
        res.status(200).send({
            success:true,
            message: "orders fetched successfully",
            totalOrders : orders.length,
            orders,
        })
    }catch(error){
         console.log(error);
         res.status(500).send({
            success:false,
            message:"Error in Create Order API",
            error:error.message
         })
    }
}

// get single order
const getSingleOrderController = async(req,res)=>{
    try{
        // find orders
        const order = await orderModel.findById(req.params.id);
        // validation
        if(!order){
            return res.status(404).send({
                sucees:false,
                message: "no order found"
            })
        }
        res.status(200).send({
            success: true,
            message : "your order fetched",
            order
        })
    }catch(error){
         console.log(error);
         // cast error object id
        if(error.name === 'CastError'){
            return res.status(500).send({
                success:false,
                message: "invalid id",
                // error,
            })
        }
         res.status(500).send({
            success:false,
            message:"Error in Create Order API",
            error:error.message
         })
    }
}
module.exports = {
    createOrderController,
    getAllOrderController,
    getSingleOrderController
}





