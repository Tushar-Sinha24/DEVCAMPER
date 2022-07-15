const asyncHandler = require('../middileware/async')
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const crypto=require('crypto');
const sendEmail = require('../utils/sendEmail');

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


//@desc     Log user out / clerar cookie
//@route    GET/api/v1/auth/logout
//@access   Private
exports.logout =asyncHandler(async(req,res,next)=>{
    res.cookie('token','none',{
        expires:new Date(Date.now()+10*1000),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        data:[]
    })
});


//@desc     Get current logged in user
//@route    POST/api/v1/auth/me
//@access   Private
exports.getMe =asyncHandler(async(req,res,next)=>{
    const user= await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        data:user
    })
});

//@desc     Forgot password
//@route    POST/api/v1/auth/forgotpassword
//@access   Public
exports.forgotPassword =asyncHandler(async(req,res,next)=>{
    const user= await User.findOne({email: req.body.email});

    if(!user){
        return next(new ErrorResponse(`There is no user with that email`),404);
    }

    //get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ ValidateBeforeSave : false });

    //Create resest url
    const resetUrl=` ${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken} `;

    const message =`You are receiving this email beacuse you (or someone else) has requested the reset of a password. Please make a PUT request to : \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email:user.email,
            subject: 'password reset token',
            message
        });
        res.status(200).json({
            success:true,
            data:'Email sent'
        })
    } catch (err) {
        console.log(err);
        user.ResetPasswordToken=undefined;
        user.ResetPasswordExpire=undefined;

        await user.save({ ValidateBeforeSave : false });
        return next(new ErrorResponse(`Email cannot be send`),500);
    }

    res.status(200).json({
        success:true,
        data:user
    })
});

//@desc     Reset password 
//@route    PUT/api/v1/auth/resetpassword/:resettoken
//@access   Public
exports.resetPassword =asyncHandler(async(req,res,next)=>{
    //get hashed token
    let resetpasswordToken=crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user= await User.findOne({
        resetpasswordToken,
        ResetPasswordExpire:{$gt:Date.now()}
    });

    if(!user){
        return next(new ErrorResponse(`Invalid token`),404);
    }

    //Set new password
    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.ResetPasswordExpire=undefined;
    await user.save();

    sendTokenResponse(user,200,res); 
});

//@desc     Update user details
//@route    PUT/api/v1/auth/updatedetails
//@access   Private
exports.updateDetails =asyncHandler(async(req,res,next)=>{
    const fieldsTOUpdate={
        name:req.body.name,
        email:req.body.email
    }

    const user= await User.findByIdAndUpdate(req.user.id,fieldsTOUpdate,{
        new:true,
        runValidators:true
    });

    res.status(200).json({
        success:true,
        data:user
    })
});

//@desc     Update Password
//@route    PUT/api/v1/auth/updatepassword
//@access   Private
exports.updatePassword =asyncHandler(async(req,res,next)=>{
    const user= await User.findById(req.user.id).select('+password');

    //Check current password
    if(!(await user.matchPassword(req.body.currentPassword))){
        return next(new ErrorResponse(`password is incorrect`),404);
    }

    user.password=req.body.newPassword;
    await user.save();
    sendTokenResponse(user,200,res); 

    
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