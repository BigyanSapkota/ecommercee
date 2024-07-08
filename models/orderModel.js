const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema

const orderSchema=new mongoose.Schema({
    orderItem:[{
        type:ObjectId,
        require:true,
        ref:'OrderItem'
    }],
    shippingAddress1:{
        type:String,
        require:true
    },
    shippingAddress2:{
        type:String,
        require:true
    },
    city:{
        type:String,
        require:true
    },
    zip:{
        type:String,
        require:true
    },
    country:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:true
    },
    status:{
        type:String,
        default:'Pending',
        require:true
    },
    totalPrice:{
        type:Number,
        require:true
    },
    user:{
        type:ObjectId,
        require:true,
        ref:'User'
    }
},{timestamps:true})

module.exports=mongoose.model('Order',orderSchema)