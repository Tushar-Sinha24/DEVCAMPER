const asyncHandler = require('../middileware/async')
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');


//@desc     Get all user
//@route    GET/api/v1/auth/users
//@access   Private/Admin
exports.getUsers =asyncHandler(async(req,res) =>{
    console.log("SAdas")
    res.status(200).json(res.advancedResults);
   
}); 

//@desc     Get Single user
//@route    get/api/v1/auth/users/:id
//@access   Private/Admin
exports.getUser =async(req,res) =>{
    const user= await User.findById(req.params.id);
    res.status(200).json({success:true,data:user});
};

//@desc     Create A user
//@route    POST/api/v1/auth/users
//@access   Private/Admin
exports.createUser =asyncHandler(async(req,res,next) =>{
    const user= await User.create(req.body);
    res.status(201).json({success:true,data:user});
});

//@desc     Update A user
//@route    PUT/api/v1/auth/users/:id
//@access   Private/Admin
exports.updateUser =asyncHandler(async(req,res,next) =>{
    const user= await User.findByIdAndUpdate(req.params.id , req.body ,{
        new:true,
        runValidators:true
    });

    res.status(200).json({success:true,data:user});
});


//@desc     Delete A user
//@route    DELETE/api/v1/auth/users/:id
//@access   Private/Admin
exports.deleteUser =asyncHandler(async(req,res,next) =>{
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({success:true,data:{}});
});

