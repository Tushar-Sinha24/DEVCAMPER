const mongoose=require('mongoose');
const Bootcamp = require('./Bootcamp');

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

//Static method to get avg of course Tution
CourseSchema.statics.getAverageCost=async function(bootcampId){
    console.log('Calculating Average Cost');

    const obj=await this.aggregate([
        {
            $match:{bootcamp:bootcampId}
        },
        {
            $group:{
                _id:'$bootcamp',
                averagecost:{$avg:'$tuition'}
            }
        }
    ]);
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
            averagecost:Math.ceil(obj[0].averagecost/10)*10
        });
    } catch (error) {
        console.error(error);
    }
}

//Call getAverageCost after save
CourseSchema.post('save',function(){
    this.constructor.getAverageCost(this.bootcamp)
});

//Call getAverageCost after remove
CourseSchema.pre('remove',function(){
    this.constructor.getAverageCost(this.bootcamp)
});

module.exports=mongoose.model('Course',CourseSchema);