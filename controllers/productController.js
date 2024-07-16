const { response } = require("express");
const productModel = require("../models/productModel.js");
const cloudinary = require("cloudinary").v2;  
const { getDataUri } = require("../utils/features.js");

// get all produts
const getAllProductsController = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.status(200).send({
            success: true,
            message: 'All products fetched successfully',
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            message : 'error in get all product API',
            error : error.message
        })
    }
};
// get single product
const getSingleProductController = async(req,res)=>{
    try{
            // get product id
            const{id} = req.params;
            const product = await productModel.findById(req.params.id)
            // validation
            if(!product){
                 return res.status(404).send({
                    success:false,
                    message: `Product not found with ID: ${id}`
                 })
            }
            res.status(200).send({
                success :true,
                message: `Product fetched successfully with ID: ${id}`,
                product
            })
    }catch (error) {
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
            success : false,
            message : 'error in get single product API',
            error
        })
    }
}

// create product
const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        // Validation
        if (!name || !description || !price || !category || !stock) {
            return res.status(400).send({
                success: false,
                message: 'Please provide all required fields',
            });
        }

        // Create the product
        const newProduct = await productModel.create({
            name,
            description,
            price,
            category,
            stock
        });

        res.status(201).send({
            success: true,
            message: "Product created successfully",
            product: newProduct
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

// update product 
const updateProductController = async(req,res )=>{
    try{
        // find product 
        const product = await productModel.findById(req.params.id);
        if(!product){
            return res.status(404).send({
                success:false,
                message: 'Product not found '
            })
        }
        const {name, description, price,stock,category} = req.body
        // validate and update
        if(name)product.name = name;
        if(description)product.description = description;
        if(price)product.price = price;
        if(stock)product.stock = stock;
        if(category)product.category = category;
        await product.save();
        res.status(200).send({
            success:true,
            message: "product details updated",
            product
        })
    }catch (error) {
        console.log(error);
        // cast error || object id
        if(error.name === "CastError"){
            return res.status(500).send({
                success:false,
                message : "Invalid Id"
            })
        }
        res.status(500).send({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
}

// delete product
const deleteProductController = async(req,res)=>{
        try{
            const product = await productModel.findById(req.params.id)
            // validation
            if(!product){
                return res.status(404).send({
                    success : false,
                    message : "product not found"
                })
            }
            // find and delete image 
            for (let index = 0; index < product.images.length; index++) {
                await cloudinary.v2.uploader.destroy(product.images[index].public_id);
            }
            await product.deleteOne()
            res.status(200).send({
                sucess:true,
                message : "Product deleted successfully"
            })
        }catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
}

// delete all products
const deleteAllProductsController = async (req, res) => {
    try {
        const result = await productModel.deleteMany({});
        res.status(200).send({
            success: true,
            message: 'All products deleted successfully',
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error deleting all products',
            error: error.message
        });
    }
};

module.exports = {      getAllProductsController,
getSingleProductController,
createProductController,
updateProductController,
deleteProductController,
deleteAllProductsController
};