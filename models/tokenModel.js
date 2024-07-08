const mongoose=require('mongoose')
const { token } = require('morgan')
const {ObjectId}=mongoose.Schema

const tokenSchema=new mongoose.Schema({
    token:{
        type:String,
        require:true
    },
    userId:{
        type:ObjectId,
        require:true,
        ref:'User'
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:86400
    }
})

module.exports=mongoose.model('Token',tokenSchema)