//1.Importing
const express = require('express');
const morgan=  require('morgan');
require('dotenv').config();
const routerFile = require('./Routes/basicroute');

//2.Initialization
const app =  express();
app.use(morgan('dev'));

//3.Middlewares

//accessing the port
const PORT = process.env.PORT || 4000 ;

//4.db connection
//5.Api
app.use('/api', routerFile);




//6.Listening to the port
app.listen(PORT,(req,res)=>{
    console.log(`Server is up and running on ${PORT}`)


} )