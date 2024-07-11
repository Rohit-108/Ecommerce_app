const mongoose = require('mongoose');

const colors = require('colors');

const connectDB= async()=>{
     try{
            await mongoose.connect(process.env.MONGODB_URL_LOCAL)
            console.log(`MongoDB Connected ${mongoose.connection.host}`);
     }catch(error){
        console.log(`MongoDB Error ${error}`.bgRed.white);
     }
}

module.exports = connectDB;
