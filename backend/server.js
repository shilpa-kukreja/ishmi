import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config'
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import productRoute from './routes/productRoute.js';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import blogRouter from './routes/blogRoutes.js';
import contactRouter from './routes/contactRoutes.js';
import router from './routes/subscribeRoutes.js';
import couponRouter from './routes/couponRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import combosRouter from './routes/combosRoutes.js';






const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


connectDB();
connectCloudinary();


app.use('/api/auth', authRoutes);
app.use('/api/product',productRoute);
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/blog',blogRouter)
app.use('/api/contact',contactRouter)
app.use('/api',router)
app.use('/api/coupon',couponRouter)
app.use('/api/combos', combosRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});