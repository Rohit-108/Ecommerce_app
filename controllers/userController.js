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
        // token
        const token = user.generateToken();
        res.status(200)
        .cookie("token", token,{    
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),  
            // secure: process.env.NODE_ENV === "development" ? true : false,
            // httpOnly: process.env.NODE_ENV === "development" ? true : false,
            // sameSite: process.env.NODE_ENV === "development" ? true : false
            secure: process.env.NODE_ENV !== "development",
                httpOnly: process.env.NODE_ENV !== "development",
                sameSite: process.env.NODE_ENV !== "development",
        })
        .send({
            success:true,
            message: "Login Successfully",
            token,
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

// get user profile
const getUserProfileController = async(req,res)=>{
    try{
        const user = await userModel.findById(req.user._id);
        res.status(200).send({
            success:true,
            message:'User profile fetched successfully',
            user
        })
    }catch(error){
        console.error(error);
        res.status(500).send({
            success: false,
            message : "error in profile api",
            error
        })
    }

}

// logout
const logOutController = async(req,res)=>{
    try{
        res.status(200).cookie("token", "", {    
            expires: new Date(Date.now()),  
            // secure: process.env.NODE_ENV === "development" ? true : false,
            // httpOnly: process.env.NODE_ENV === "development" ? true : false,
            // sameSite: process.env.NODE_ENV === "development" ? true : false
            secure: process.env.NODE_ENV !== "development",
                httpOnly: process.env.NODE_ENV !== "development",
                sameSite: process.env.NODE_ENV !== "development",
        }).send({
            success: true,
            message: "logout successfully"
        })
    }catch(error){
        console.error(error);
        res.status(500).send({
            success: false,
            message : "error in logout api",
            error
        })
    }

}


module.exports = {
    registerController,
    loginController,
    getUserProfileController,
    logOutController,
};
