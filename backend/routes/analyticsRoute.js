// routes/analyticsRoute.js
import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import adminAuth from "../middleware/adminAuth.js";

const analyticsRoute = express.Router();

analyticsRoute.get("/", adminAuth, getAnalytics);

export default analyticsRoute;