const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middileware/async')
const ErrorResponse = require('../utils/errorResponse');

//@desc     get Courses
//@route    GET/api/v1/courses
//@route    GET/api/v1/bootcamp/:bootacmpId/courses
//@access   Public
exports.getCourses =asyncHandler(async(req,res,next)=>{
    let query;

    if(req.params.bootcampId){
        query=Course.find({bootcamp:req.params.bootcampId})
    }else{
        query=Course.find().populate({
            path:"bootcamp",
            select:'name description'
        });
    }

    const courses=await query;

    res.status(200).json({
        success:true, 
        count:courses.length,
        data:courses
    })
});

//@desc     get  Single Courses
//@route    GET/api/v1/courses/:id
//@access   Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if(!course){
            return next(new ErrorResponse(`No Course With id of ${req.params.id}`),404);
    }
    res.status(200).json({ success: true, data: course });

});

//@desc     Add a course
//@route    POST/api/v1/bootcamps/:bootcampId/courses
//@access   Private
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp=req.params.bootcampId;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp){
            return next(new ErrorResponse(`No Bootcamp With id of ${req.params.bootcampDd}`),404);
    }

    const course = await Course.create(req.body);
    res.status(200).json({ success: true, data: course });

});