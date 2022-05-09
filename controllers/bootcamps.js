const Bootcamp =require('../models/Bootcamp');
const asyncHandler =require('../middileware/async')
const ErrorResponse = require('../utils/errorResponse');


//@desc     get all bootcamp
//@route    GET/api/v1/bootcamps
//@access   Public

exports.getBootcamps=asyncHandler(async (req,res,next)=>{
        const bootcamp=await Bootcamp.find();
        res.status(200).json({success:true, data:bootcamp});
});


//@desc     get single bootcamp
//@route    GET/api/v1/bootcamps/:id
//@access   Public

exports.getBootcamp=asyncHandler(async (req,res,next)=>{
        const bootcamp=await Bootcamp.findById(req.params.id);
        res.status(200).json({success:true, data:bootcamp});
    
})

//@desc     Create new bootcamp 
//@route    POST/api/v1/bootcamps
//@access   Private

exports.createBootcamp=asyncHandler(async(req,res,next)=>{
        const bootcamp=await Bootcamp.create(req.body)
        res.status(200).json({success:true, data:bootcamp});
})

//@desc     Update  bootcamp 
//@route    PUT/api/v1/bootcamps/:id
//@access   Private

exports.updateBootcamp= asyncHandler(async (req,res,next)=>{
   
        const bootcamp=await Bootcamp.findByIdAndUpdate(req.params.id, req.body , {
            new:true,
            runValidators:true
        });
        res.status(200).json({success:true, data:bootcamp});
})

//@desc     delete  bootcamp 
//@route    DELETE/api/v1/bootcamps/:id
//@access   Private

exports.deleteBootcamp=asyncHandler(async (req,res,next)=>{
        const bootcamp=await Bootcamp.findByIdAndDelete(req.params.id);
        if(!bootcamp){  
            return next(err);
        }
        res.status(200).json({success:true, data:bootcamp});
});