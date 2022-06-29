const asyncHandler = require('../middileware/async')
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

//@desc     Register User
//@route    GET/api/v1/register
//@access   Public
exports.register =asyncHandler(async(req,res,next) =>{
    const {name,email,password,role}=req.body;

    //create user
    const user= await User.create({
        name,
        email,
        password,
        role
    });
    res.status(200).json({ success: true});
}); 