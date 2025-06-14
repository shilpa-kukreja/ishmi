import express from "express";
import upload from "../middleware/multer.js";
import {
  addProduct,
  listProducts,
  removeProduct,
  SingleProduct,
  updatelistproduct,
  updateProduct,
} from "../controllers/productController.js";
import adminAuth from "../middleware/adminAuth.js";

const productRoute = express.Router();
productRoute.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);
productRoute.post("/update/:id", 
  adminAuth,
  upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
]), updateProduct);

productRoute.get("/list", listProducts);
productRoute.get("/:id",updatelistproduct);

productRoute.post("/remove", removeProduct);
productRoute.post("/single", SingleProduct);

export default productRoute;