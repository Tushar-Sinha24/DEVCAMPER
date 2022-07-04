const asyncHandler = require('../middileware/async')
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

//@desc     Register User
//@route    POST/api/v1/register
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

    sendTokenResponse(user,200,res); 

    res.status(200).json({ success: true , token});
}); 

//@desc     LOGIN
//@route    POST/api/v1/login
//@access   Public
exports.login =asyncHandler(async(req,res,next) =>{
    const {email,password}=req.body;

    //Validate email and password
    if(!email || !password){
        return next(new ErrorResponse(`Please provide and email and password`),404);
    }

    //check for user
    const user=await User.findOne({email}).select('+password');

    if(!user){
        return next(new ErrorResponse(`Invalid Credential`),401);
    }

    //check if password matches
    const isMatch= await user.matchPassword(password);

    if(!isMatch){
        return next(new ErrorResponse(`Invalid Credential`),401);
    }

    sendTokenResponse(user,200,res); 

    res.status(200).json({ success: true , token});
}); 

//Get token from model, create cookie and send response
const sendTokenResponse =(user , statusCode,res)=>{
    //create token
    const token=user.getSignedJwtTokens();

    const option={
        expires:new Date(Date.now() +process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly:true
    };


    if(process.env.NODE_ENV==='production'){
        option.secure=true;
    }

    res.status(statusCode)
    .cookie('token',token,option)
    .json({
        success:true,
        token
    });
}

//@desc     Get current logged in user
//@route    POST/api/v1/auth/me
//@access   Private
exports.getMe =asyncHandler(async(req,res,next)=>{
    const user= await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        data:user
    })
})