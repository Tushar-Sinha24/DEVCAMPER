const path=require('path');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middileware/async')
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geoCoder');



//@desc     get all bootcamp
//@route    GET/api/v1/bootcamps
//@access   Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
        res.status(200).json(res.advancedResults);
});


//@desc     get single bootcamp
//@route    GET/api/v1/bootcamps/:id
//@access   Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
                return next(new ErrorResponse(`No Course With id of ${req.params.id}`),404)
        }
        res.status(200).json({ success: true, data: bootcamp });

})

//@desc     Create new bootcamp 
//@route    POST/api/v1/bootcamps
//@access   Private

exports.createBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.create(req.body)
        res.status(200).json({ success: true, data: bootcamp });
})

//@desc     Update  bootcamp 
//@route    PUT/api/v1/bootcamps/:id
//@access   Private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {

        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
        });
        res.status(200).json({ success: true, data: bootcamp });
})

//@desc     delete  bootcamp 
//@route    DELETE/api/v1/bootcamps/:id
//@access   Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
                return next(err);
        }
        bootcamp.remove();

        res.status(200).json({ success: true, data: bootcamp });
});

//@desc     get  bootcamp within radius
//@route    GET/api/v1/bootcamps/radius/:zipcode/:distance
//@access   Private

exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
        const { zipcode, distance } = req.params;

        //Get lat/long from geoCoder
        const loc = await geocoder.geocode(zipcode);
        const lat = loc[0].latitude;
        const lng = loc[0].longitude;

        //calc radius using radian
        //divide distance by radius of earth
        //Earth Radius=3963 miles || 6378 km
        const radius = distance / 3963;

        const bootcamps = await Bootcamp.find({
                location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
        });
        res.status(200).json({
                success: true,
                data: bootcamps,
                count: bootcamps.length
        });
});

//@desc     Upload phot to botcamp
//@route    PUT/api/v1/bootcamps/:id/photo
//@access   Private

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
                return next(new ErrorResponse(`Bootcamp not found`, 400)); 
        }
        
        if(!req.files){
            return next(new ErrorResponse(`Please Upload A file`, 400));    
        }
        const file = req.files.file;
        
        //Make Sure the image is a photo
        if(!file.mimetype.startsWith('image')){
                return next(new ErrorResponse(`Please Upload an image  file`,400)); 
        }

        //CHECK FILE SIZE
        if(file.size>process.env.MAX_FILE_UPLOAD){
                return next(new ErrorResponse(`Please Upload an image  less than ${process.env.MAX_FILE_UPLOAD}`,400)); 
        }

        //Create custom filename
        file.name= `photo_${bootcamp._id}${path.parse(file.name).ext}`;

        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err=>{
                if(err){
                        console.log(err);
                        return next(new ErrorResponse(`Problem with file upload`,500));
                }
                await Bootcamp.findByIdAndUpdate(req.params.id, {photo:file.name});      
        });
        res.status(200).json({
                success: true,
                data:file.name
        });
});