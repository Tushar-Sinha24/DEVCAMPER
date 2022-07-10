const fs = require('fs');
const mongoose=require('mongoose');
const dotenv=require('dotenv');


//Load env vars
dotenv.config({path:'./config/config.env'});

//Load models
const Bootcamp=require('./models/Bootcamp');
const Course=require('./models/Course');
const User=require('./models/User');
const Review=require('./models/Review');

//Connect To DB
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
 });

 //Read Json Files
const bootcamps=JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'));
const courses=JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'));
const user=JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8'));
const review=JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`,'utf-8'));

//Imports into DB
const importData=async()=>{
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(user);
        await Review.create(review);

        console.log("Data imported.... ")
        process.exit
    } catch (error) {
        console.error(error);
    }
}

//Delete Data
const deleteData=async()=>{
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();

        console.log("Data Deleted.... ")
        process.exit
    } catch (error) {
        console.error(error.message);
    }
}

if(process.argv[2]==='-i'){
 importData();
}
else if(process.argv[2]==='-d'){
    deleteData();
}