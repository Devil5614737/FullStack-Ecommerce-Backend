const mongoose=require('mongoose');

const orderSchema=new mongoose.Schema({
    title:String,
    image:String,
    description:String,
    price:Number,
    quantity:Number,
    category:String,
    user:{
         type: mongoose.Schema.Types.ObjectId, 
         ref: "User" 
    }
});

const Order=mongoose.model("Order",orderSchema);


module.exports=Order;