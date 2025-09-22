import express from "express";
import { addReview, allReviews, deleteReview, getReviews, updateReview } from "../controllers/reviewsController.js";


const reviewsRouter = express.Router();

// Add review
reviewsRouter.post("/add", addReview);

// Get reviews of a product
reviewsRouter.get("/product/:productId", getReviews);

// Delete review by ID
reviewsRouter.delete("/:id", deleteReview);

// Update review by ID
reviewsRouter.put("/:id", updateReview);

reviewsRouter.get("/get", allReviews);

export default reviewsRouter;
