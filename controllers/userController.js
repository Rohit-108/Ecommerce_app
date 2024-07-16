const userModel = require('../models/userModel')
const { getDataUri } = require('../utils/features');
const cloudinary = require("cloudinary").v2;
const registerController =async (req,res)=>{
    try{
        const {name,email,password,address,city,country,phone}=req.body;
        // validation
        if(!name || !email || !password || !city || !address || !country  || !phone ){
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
            phone,
            // profilePic
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
};

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

// update user passsword
const updatePasswordController = async (req, res) => {
    try {
      const user = await userModel.findById(req.user._id);
      const { oldPassword, newPassword } = req.body;
      //valdiation
      if (!oldPassword || !newPassword) {
        return res.status(500).send({
          success: false,
          message: "Please provide old or new password",
        });
      }
      // old pass check
      const isMatch = await user.comparePassword(oldPassword);
      //validaytion
      if (!isMatch) {
        return res.status(500).send({
          success: false,
          message: "Invalid Old Password",
        });
      }
      user.password = newPassword;
      await user.save();
      res.status(200).send({
        success: true,
        message: "Password Updated Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In update password API",
        error,
      });
    }
  };

/// Update user profile photo
// const updateProfilePicController = async (req, res) => {
//     try {
//       const user = await userModel.findById(req.user._id);
      


//       // file get from client photo
//       const file = getDataUri(req.file);
//       // delete prev image
//     //   await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
//     if (!cloudinary) {
//         throw new Error('Cloudinary is not initialized');
//     }
//       // update
//       const cdb = await cloudinary.v2.uploader.upload(fileDataUri);
//       console.log(cdb);
//       user.profilePic = {
//         public_id: cdb.public_id,
//         url: cdb.secure_url,
//       };
//       // save func
//       await user.save();
  
//       res.status(200).send({
//         success: true,
//         message: "profile picture updated",
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).send({
//         success: false,
//         message: "Error In update profile pic API",
//         error: error.message,
//       });
//     }
//   };
const updateProfilePicController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "No file uploaded",
            });
        }

        // Convert file to data URI
        const fileDataUri = getDataUri(req.file);
        if (!fileDataUri) {
            return res.status(400).send({
                success: false,
                message: "Failed to process the file",
            });
        }

        // Check if Cloudinary is initialized
        if (!cloudinary || !cloudinary.v2) {
            throw new Error('Cloudinary is not initialized');
        }

        // Delete previous image from Cloudinary
        if (user.profilePic && user.profilePic.public_id) {
            await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
        }

        // Upload new image to Cloudinary
        const cdb = await cloudinary.v2.uploader.upload(fileDataUri.content);
        if (!cdb) {
            return res.status(500).send({
                success: false,
                message: "Failed to upload image to Cloudinary",
            });
        }

        // Update user's profile picture
        user.profilePic = {
            public_id: cdb.public_id,
            url: cdb.secure_url,
        };

        // Save user
        await user.save();

        res.status(200).send({
            success: true,
            message: "Profile picture updated successfully",
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.error("Error in update profile pic API", error);
        res.status(500).send({
            success: false,
            message: "Error in update profile pic API",
            error: error.message,
        });
    }
};


// const updateProfilePicController = async (req, res) => {
//     try {
//         const user = await userModel.findById(req.user._id);
//         const fileDataUri = getDataUri(req.file); // Assuming this returns the data URI string

//         // Ensure cloudinary is properly configured and initialized
//         if (!cloudinary) {
//             throw new Error('Cloudinary is not initialized');
//         }

//         const cloudinaryResponse = await cloudinary.uploader.upload(file.content); // Pass the data URI directly
//         user.profilePic = {
//             public_id: cloudinaryResponse.public_id,
//             url: cloudinaryResponse.secure_url,
//         };
//         await user.save();

//         res.status(200).send({
//             success: true,
//             message: "Profile picture updated",
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({
//             success: false,
//             message: "Error in update profile pic API",
//             error: error.message,
//         });
//     }
// };


module.exports = {
    registerController,
    loginController,
    getUserProfileController,
    logOutController,
    updateProfileController,
    updatePasswordController,
    updateProfilePicController,
};


