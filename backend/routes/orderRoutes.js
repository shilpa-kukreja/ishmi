import express from 'express'
import adminAuth from '../middleware/adminAuth.js';
import { allOrders, generateInvoice,  getOrderPublic, initiatePayUPayment, payUWebhook, placeOrder, placeOrderRazorpay, ShipOrders, updateStatus, userOrders, verifyPayUPayment, verifyRazorpay } from '../controllers/orderController.js';
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
orderRouter.post('/ship',ShipOrders);

// Add these routes
orderRouter.get('/:orderId',  getOrderPublic);
orderRouter.post('/generate-invoice',authUser,  generateInvoice);

// New PayU routes
orderRouter.post('/payu/initiate',authUser, initiatePayUPayment);
orderRouter.post('/payu/verify',verifyPayUPayment);
orderRouter.post('/payu/webhook', payUWebhook);

export default orderRouter