const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middileware/async')
const ErrorResponse = require('../utils/errorResponse');

//@desc     get Courses
//@route    GET/api/v1/courses
//@route    GET/api/v1/bootcamp/:bootacmpId/courses
//@access   Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId });

        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

//@desc     get  Single Courses
//@route    GET/api/v1/courses/:id
//@access   Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return next(new ErrorResponse(`No Course With id of ${req.params.id}`), 404);
    }
    res.status(200).json({ success: true, data: course });

});

//@desc     Add a course
//@route    POST/api/v1/bootcamps/:bootcampId/courses
//@access   Private
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`No Bootcamp With id of ${req.params.bootcampDd}`), 404);
    }

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authoursied to Add a Course to  this bootcamp id${bootcamp._id}`), 404);
    }

    const course = await Course.create(req.body);
    res.status(200).json({ success: true, data: course });

});

//@desc     delete  Course 
//@route    DELETE/api/v1/course/:id
//@access   Private

exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return next(err);
    }
//Make sure user is bootcamp owner
if(course.user.toString()!==req.user.id && req.user.role !=='admin'){
    return next(new ErrorResponse(`User ${req.user.id} is not authoursied to delet the course this bootcamp`),404);
}

    course.remove();

    res.status(200).json({ success: true, data: course });
});

//@desc     Update  Course 
//@route    PUT/api/v1/course/:id
//@access   Private

exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);
    if (!course) {
        return next(new ErrorResponse(`Course not found `), 404);
    }

    //Make sure user is bootcamp owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authoursied to update the course this bootcamp`), 404);
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({ success: true, data: course });
});