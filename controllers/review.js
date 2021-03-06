const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middileware/async')
const ErrorResponse = require('../utils/errorResponse');

//@desc     get Reviews
//@route    GET/api/v1/reviews
//@route    GET/api/v1/bootcamp/:bootacmpId/reviews
//@access   Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const reviews = await Review.find({ bootcamp: req.params.bootcampId });

        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

//@desc     get Single Review
//@route    GET/api/v1/reviews/:id
//@route    GET/api/v1/bootcamp/:bootacmpId/reviews
//@access   Public
exports.getReview = asyncHandler(async (req, res, next) => {
    const review=await Review.findById(req.params.id).populate({
        path:'bootcamp',
        select:'name description'
    });

    if(!review){
        return next(new ErrorResponse(`No review found with id of ${req.params.id}`,404));
    }
    res.status(200).json({
        success:true,
        data:review
    });
});

//@desc     Add Review
//@route    POST/api/v1/bootcamp/:bootcampID/reviews
//@access   Private
exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`No Bootcamp With id of ${req.params.bootcampDd}`,404));
    }

    
    const review=await Review.create(req.body);

    res.status(201).json({
        success:true,
        data:review
    });
});

//@desc     Update Review
//@route    PUT/api/v1/reviews/:id
//@access   Private
exports.updateReview = asyncHandler(async (req, res, next) => {

    let review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorResponse(`No Review With id of ${req.params.id}`,404));
    }

    //Make Sure reviw belongs to user or is admin
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`Not Authorised to update Review`,401));
    }
    
    review= await Review.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })

    res.status(201).json({
        success:true,
        data:review
    });
});


//@desc     Delete Review
//@route    PUT/api/v1/reviews/:id
//@access   Private
exports.deleteReview = asyncHandler(async (req, res, next) => {

    let review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorResponse(`No Review With id of ${req.params.id}`,404));
    }

    //Make Sure reviw belongs to user or is admin
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`Not Authorised to update Review`,401));
    }
    
    await review.remove()

    res.status(201).json({
        success:true,
        data:review
    });
});


