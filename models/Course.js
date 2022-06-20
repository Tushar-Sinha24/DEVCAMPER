const mongoose=require('mongoose');

const CourseSchema=new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:[true,'Please add a Course title']
    },
    description:{
        type:String,
        required:[true,'Please add a Description']
    },
    weeks:{
        type:String,
        required:[true,'Please add a Number of weeks']
    },
    tuition:{
        type:Number,
        required:[true,'Please add a Description'] 
    },
    minimumSkill:{
        type:String,
        required:[true,'Please add a minimum Skills'],
        enum:['beginner' , 'intermediate' , 'advanced']
    },
    scholarshipAvailable:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref:'Bootcamp',
        required:true
    }

});

module.exports=mongoose.model('Course',CourseSchema);