import express from 'express'
import adminAuth from '../middleware/adminAuth.js';
import { allOrders, placeOrder, placeOrderRazorpay, ShipOrders, updateStatus, userOrders, verifyRazorpay } from '../controllers/orderController.js';
import authUser from '../middleware/auth.js';



const orderRouter=express.Router();

//Admin Features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

//Payment Feauters
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/razorpay',authUser,placeOrderRazorpay)

//User Feauters
orderRouter.post('/userorders',authUser,userOrders)

//Verfiy Router
orderRouter.post('/verifyRazorpay',authUser,verifyRazorpay)
orderRouter.post('/ship',authUser,ShipOrders)

export default orderRouter