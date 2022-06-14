const Bootcamp =require('../models/Bootcamp');
const asyncHandler =require('../middileware/async')
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geoCoder');



//@desc     get all bootcamp
//@route    GET/api/v1/bootcamps
//@access   Public
  
exports.getBootcamps=asyncHandler(async (req,res,next)=>{
        let query;
        
        //Copy req.query
        const reqQuery={...req.query};

        //Fields to exclude
        const removeFields=['select','sort'];
        removeFields.forEach(prams=> delete reqQuery[prams]);

        // Create query String
        let queryStr=JSON.stringify(reqQuery);

        // Create Query String($gt,$gte,etc)
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        
        // Finding Resource
        query=Bootcamp.find(JSON.parse(queryStr)) ;

        //Select Field
        if(req.query.select){
                const fields=req.query.select.split(',').join(" ");
                query=query.select(fields);
        }
        //sort 
        if(req.query.sort){
                const sortBy=req.query.sort.split(',').join(" ");
                query=query.sort(sortBy);
        }else{
                query=query.sort('-createdAt');
        }

        //Executing the query
        const bootcamp=await query;
        res.status(200).json({success:true,count:bootcamp.length , data:bootcamp});
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

//@desc     get  bootcamp within radius
//@route    GET/api/v1/bootcamps/radius/:zipcode/:distance
//@access   Private

exports.getBootcampInRadius=asyncHandler(async (req,res,next)=>{
        const {zipcode,distance}=req.params;

        //Get lat/long from geoCoder
        const loc = await geocoder.geocode(zipcode);
        const lat=loc[0].latitude;
        const lng= loc[0].longitude;

        //calc radius using radian
        //divide distance by radius of earth
        //Earth Radius=3963 miles || 6378 km
        const radius=distance/3963;

        const bootcamps=await Bootcamp.find({
                location: { $geoWithin: { $centerSphere: [ [ lng,lat ], radius ] } }
        });
        res.status(200).json({
                success:true, 
                data:bootcamps,
                count:bootcamps.length
        });
});