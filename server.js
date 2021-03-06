const path=require('path');
const express=require('express');
const dotenv= require('dotenv');
const morgan= require('morgan');
const fileupload= require('express-fileupload')
const errorHandler=require('./middileware/error')
const connectDB=require('./config/db');
const cookieParser=require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors')



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

//Sanitize data
app.use(mongoSanitize());

//Set Security headers
app.use(helmet());

//Prevent XSS attack
app.use(xss())

//Rate Limiting
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, //10Min
	max: 100, 
	standardHeaders: true, 
	
});
app.use(limiter);

//Prevent http pram pollution
app.use(hpp());

//Enable CORS
app.use(cors());


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