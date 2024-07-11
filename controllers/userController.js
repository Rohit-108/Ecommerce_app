const userModel = require('../models/userModel')
const registerController =async (req,res)=>{
    try{
        const {name,email,password,address,city,country,phone}=req.body;
        // validation
        if(!name || !email || !password || !city || !address || !country  || !phone){
            return res.status(500).send({
                success : false,
                message : "please provide all fields",
            })
        }
        // check exisiting user
        const exisitingUser = await userModel.findOne({email});
        // validation
        if(exisitingUser){
            return res.status(500).send({
                success:false,
                message: "email already taken",
            });
        }
        const user = await userModel.create({
            name,
            email,
            password,
            city,
            address,
            country,
            phone
        });
        res.status(201).send({
            success:true,
            message:"registratoin Success, Please login"
        })
    }catch(error){
        console.error("error", error);
        res.status(500).send({
            success:false,
            message: "error in register api",
            error: error.message,
        })
    }

};

// login
 const loginController = async(req,res)=>{
    try{
        const {email,password}= req.body
        // validation
        if(!email || !password){
            return res.status(500).send({
                success:"false",
                message:"please add email or password"
            })
        }
        // check user
        const user = await userModel.findOne({email})
        // user validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:'user not found'
            })
        }
        // check pass
        const isMatch = await user.comparePassword(password)

        // validation pass
        if(!isMatch){
            return res.status(401).send({
                success:false,
                message:"invalid credentials"
            })
        }
        res.status(200).send({
            success:true,
            message: "Login Successfully",
            user,
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:"false",
            message:"error in login Api",
            error:error.message,
        })
    }
}


module.exports = {
    registerController,
    loginController,
};
