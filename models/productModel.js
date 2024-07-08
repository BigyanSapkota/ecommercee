// 1

const mongoose=require('mongoose')
const{ObjectId}=mongoose.Schema
// ObjectId is used to link data between different collections(table)

const productSchema=new mongoose.Schema({
    product_name:{
        type:String,
        require:true,
        trim:true
    },
    product_price:{
        type:Number,
        require:true
    },
    countInStock:{
        type:Number,
        require:true
    },
    product_description:{
        type:String,
        require:true
    },
    product_image:{
        type:String,
        require:true
    },
    product_rating:{
        type:Number,
        default:0,
        max:5
    },
    category:{
        type:ObjectId,
        require:true,
        ref:'Category'
    }

},{timestramps:true})

module.exports=mongoose.model('Product',productSchema)