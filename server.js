const express=require('express');
const dotenv= require('dotenv');
const morgan= require('morgan');
const errorHandler=require('./middileware/error')
const connectDB=require('./config/db');


//Load env vars
dotenv.config({path:'./config/config.env'})
connectDB();


// Route files
const bootcamps=require('./routes/bootcamps');
const courses=require('./routes/courses');




const app=express();

//body parser
app.use(express.json());

if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}



// Mount Router
app.use('/api/v1/bootcamps',bootcamps);
app.use('/api/v1/courses',courses);
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