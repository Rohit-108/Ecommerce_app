const { response } = require("express");
const categoryModel = require("../models/categoryModel.js");

// create category
const createCategoryController  = async(req,res)=>{
    try{

    }catch(error){
        console.log(error);;
        res.status(500).send({
            success:false,
            message:""
        })
    }
}

module.exports = {
    createCategoryController,

}