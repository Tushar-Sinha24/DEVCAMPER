const ErrorResponse = require("../utils/errorResponse");

const errorHandler =(err,req,res,next)=>{

    let error={...err}
    error.message=err.message;

    console.log(err);

    console.log(err.name);
    if(err.name==='CastError'){
        const message=`Bootcamp not found with id of ${err.value}`;
        error=new ErrorResponse(message,404);
    }

    //Mongo duplicate key
    if(err.code===11000){
        const message='Duplicate field value Enter';
        error=new ErrorResponse(message,400);
    } 

    //Mongo validation error
    if(err.name==='ValidationError'){
        const message=Object.values(err.errors).map(val=>val.message);
        error=new ErrorResponse(message,404);
    }

    res.status(error.statusCode||500).json({
        success:false,
        error:error.message||'server Error'
    });
}

module.exports = errorHandler;