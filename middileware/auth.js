const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

//Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        //Set token from bearer token in bearer
        token = req.headers.authorization.split(' ')[1];
    }

    // else if(req.cookies.token){
    //     token=req.cookies.token
    // }

    //Make Sure token exits
    if (!token) {
        return next(new ErrorResponse(`Not authousied to acess this route`), 401);
    }

    try {
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded);

        req.user = await User.findById(decoded.id);

        next();
    } catch (error) {
        return next(new ErrorResponse(`Not authousied to acess this route`), 401);
    }
});

//Grant acess to specific roles
exports.authorize=(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`User role ${req.user.role} is unauthourised  to access this rote`), 403);
        }
        next();
    }
}