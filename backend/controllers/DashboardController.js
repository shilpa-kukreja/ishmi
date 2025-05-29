import contactModel from "../models/contactModel.js";
import orderModel from "../models/orderModel.js";
import User from "../models/User.js"



const Dashboard =async(req,res)=>{
    try {
        const users=await User.find({}) ;
        const orders=await orderModel.find({})
        const contacts=await  contactModel.find({})
        const dashData={
             users:users.length(),
             orders:orders.length(),
             contacts:contacts.length(),
             latestOrders:orders.reverse().slice(0,5)
       }
       res.json({success:true,dashData})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {Dashboard}