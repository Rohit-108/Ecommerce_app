const userModel = require('../models/userModel')
const getDataUri = require('../utils/features.js')
const cloudinary = require("cloudinary").v2;
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
// update user profile
const updateProfileController = async(req,res)=>{
    try{
        const user = await userModel.findById(req.user._id)
        const{name,email,address,city,country,phone} = req.body
        // validation + update
        if(name) user.name = name
        if(email) user.email = email
        if(address) user.address = address
        if(city) user.city = city
        if(country) user.country = country
        if(phone) user.phone = phone
        // save user
        await user.save()
        res.status(200).send({
            success: true,
            message: "user profile updated"
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

// update password
const updatePasswordController = async(req,res)=>{
    try{
        const user = await userModel.findById(req.user._id)
        const {oldPassword, newPassword}= req.body;
        // validation
        if(!oldPassword || !newPassword){
            return res.status(500).send({
                success:false,
                message:'Please provide old or new password'
            })
        }
        // old pass match
        const isMatch = await user.comparePassword(oldPassword)
        // validation
        if(!isMatch){
            return res.status(500).send({
                success: false,
                message :"Invalid Old Password"
            })
        }
        user.password = newPassword;
        await user.save();
        res.status(200).send({
            success:true,
            message: "password updated successfully",
        });
    }catch(error){
        console.error(error);
        res.status(500).send({
            success: false,
            message : "error in update password API",
            error
        })
    }

}

// update user Profile photo
// const updateProfilePicController = async(req,res)=>{
//     try{
//         const user = await userModel.findById(req.user._id)
//         // file get from user photo
//         const file = getDataUri(req.file);
//         // delete pre image
//         await cloudinary.v2.uploader.destroy(user.profilePic.public_id)
//         // update
//         const cdb = await cloudinary.v2.uploader.upload(file.content)
//         user.profilePic = {
//             public_id: cdb.public_id,
//             url: cdb.secure_url
//         }
//         // save user pic function
//         await user.save()
//         res.status(200).send({
//             sucess : true,
//             message : "profile picture updated",
//         });

//     }catch(error){
//         console.error(error);
//         res.status(500).send({
//             success: false,
//             message : "error in update profile pic API",
//             error
//         })
//     }

// };

const updateProfilePicController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "No file uploaded",
            });
        }

        // Get data URI from file
        const file = getDataUri(req.file);

        // Delete previous image from Cloudinary
        if (user.profilePic && user.profilePic.public_id) {
            await cloudinary.uploader.destroy(user.profilePic.public_id);
        }

        // Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(file.content);

        // Update user's profilePic
        user.profilePic = {
            public_id: result.public_id,
            url: result.secure_url,
        };

        // Save user
        await user.save();

        res.status(200).send({
            success: true,
            message: "Profile picture updated",
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in update profile pic API",
            error: error.message,
        });
    }
};

module.exports = {
    registerController,
    loginController,
    getUserProfileController,
    logOutController,
    updateProfileController,
    updatePasswordController,
    updateProfilePicController,
};
