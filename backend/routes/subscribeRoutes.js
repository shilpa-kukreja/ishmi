import express from "express";
import { addSubscriber, allSubscriber, deleteSubscriber } from "../controllers/subscribeController.js";

const router = express.Router();

router.post("/subscribe", addSubscriber);  
router.get("/subscribers", allSubscriber); 
router.delete("/unsubscribe/:email", deleteSubscriber); 

export default router;
