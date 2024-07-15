const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel");

const isAuth = async (req, res, next) => {
    const { token } = req.cookies;
    
    // validation
    if (!token) {
        return res.status(401).send({
            success: false,
            message: "Unauthorized User"
        });
    }

    try {
        const decodeData = JWT.verify(token, process.env.JWT_SECRET);
        req.user = await userModel.findById(decodeData._id);
        
        if (!req.user) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized User"
            });
        }

        next();
    } catch (error) {
        console.error("Error verifying token", error);
        return res.status(401).send({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = isAuth;