import express from 'express'
import { addCoupan, applyCoupon, getAllCoupons, toggleCouponStatus } from '../controllers/couponController.js';
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';



const couponRouter=express.Router();


couponRouter.post('/apply',applyCoupon)
couponRouter.post('/add',adminAuth,addCoupan)
couponRouter.get("/get", getAllCoupons); 
couponRouter.put("/:id/toggle",adminAuth, toggleCouponStatus);

export default couponRouter