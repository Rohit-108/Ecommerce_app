const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name :{
        type : String,
        required : [true,'product name is required']
    },
    description:{
        type :String,
        required: [true, 'product description is required']
    },
    price:{
        type : Number,
        required:[true, 'product price is required']
    },
    stock:{
        type : Number,
        required: [true, 'product stock required']
    },
    category:{
        // type : mongoose.Schema.Types.ObjectId,
        type: String,
        ref : 'Category'
    },
    images: [
        {
          public_id: String,
          url: String,
        },
      ],
},{timestamps:true});

const productModel = mongoose.model("Products", productSchema);
module.exports = productModel;