const path=require('path');
const express=require('express');
const dotenv= require('dotenv');
const morgan= require('morgan');
const fileupload= require('express-fileupload')
const errorHandler=require('./middileware/error')
const connectDB=require('./config/db');
const cookieParser=require('cookie-parser');


//Load env vars
dotenv.config({path:'./config/config.env'})
connectDB();


// Route files
const bootcamps=require('./routes/bootcamps');
const courses=require('./routes/courses');
const auth=require('./routes/auth');
const users=require('./routes/users');
const review=require('./routes/review');




const app=express();

//body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}



//File Uploading
app.use(fileupload());

//set static folder
app.use(express.static(path.join(__dirname,'public')));


// Mount Router
app.use('/api/v1/bootcamps',bootcamps);
app.use('/api/v1/courses',courses);
app.use('/api/v1/auth',auth);
app.use('/api/v1/users',users);
app.use('/api/v1/reviews',review);
//error handler after mount router
app.use(errorHandler)

const PORT=process.env.PORT ||5000;

const server=app.listen(PORT,console.log(`Server Runing in ${process.env.NODE_ENV} mode on port ${PORT}` ));

//handle unhandled rejection
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`);
    //close server and exit process
    server.close(()=> process.exit(1));
})