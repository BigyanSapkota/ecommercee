// 4

const express=require('express')
const app=express()
require ('dotenv').config()
const morgan=require('morgan')
require('./db/connection')
const mongoose = require('mongoose')
const bodyParser=require('body-parser')
const cors=require('cors')



const categoryRoute=require('./routes/categoryRoute')
const productRoute=require('./routes/productRoute')
const userRoute=require('./routes/userRoute')
const orderRoute=require('./routes/orderRoute')
const paymentRoute=require('./routes/paymentRoute')



// middleware
  app.use(morgan('dev'))
  app.use(bodyParser.json())
  app.use('/public/uploads',express.static('public/uploads'))
  app.use(cors())


// routes
app.use('/api',categoryRoute)
app.use('/api',productRoute)
app.use('/api',userRoute)
app.use('/api',orderRoute)
app.use('/api',paymentRoute)


// server.setTimeout(5 * 60 * 1000); // 5 minutes
const port=process.env.Port || 5000 ||8000
app.listen(port,()=>{
    console.log(`Server started on port ${port}`)
})



  