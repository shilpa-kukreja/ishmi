import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import mongoose from "mongoose";

import fs from "fs";
import { readFile } from "fs/promises";
import { unlinkSync } from "fs";


// controllers/productController.js
 const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      Shortdescription,
      mainCategory,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const imageFields = ['image1', 'image2', 'image3', 'image4'];
    const imageUrls = [];

    for (const field of imageFields) {
      const file = req.files?.[field]?.[0];
      if (file) {
        imageUrls.push({
          url: `/uploads/${file.filename}`,
          originalname: file.originalname,
        });
      }
    }

    const productData = {
      name,
      description,
      Shortdescription,
      category: {
        mainCategory: Array.isArray(mainCategory)
          ? mainCategory[0]
          : mainCategory || '',
        subCategory: Array.isArray(subCategory)
          ? subCategory[0]
          : subCategory || '',
      },
      bestseller: bestseller === 'true',
      sizes: JSON.parse(sizes),
      image: imageUrls,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: 'Product Added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};





 


const listProducts = async (req, res) => {
  try {
    const { mainCategory, subCategory } = req.query;

    const filter = {};
    if (mainCategory) filter["category.mainCategory"] = mainCategory;
    if (subCategory) filter["category.subCategory"] = subCategory;

    const products = await productModel.find(filter);

    const formattedProducts = products.map((product) => {
      // Use image paths (already stored in product.image array)
      const imageUrls = product.image.map((img) => ({
        url: img.url,
        originalname: img.originalname,
      }));

      return {
        ...product._doc,
        image: imageUrls,
      };
    });

    res.status(200).json({
      success: true,
      count: formattedProducts.length,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};



const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      Shortdescription,
      mainCategory,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(Boolean);

    const imageUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      Shortdescription,
      category: {
        mainCategory: Array.isArray(mainCategory)
          ? mainCategory[0]
          : mainCategory || "",
        subCategory: Array.isArray(subCategory)
          ? subCategory[0]
          : subCategory || "",
      },
      bestseller: bestseller === "true",
      sizes: JSON.parse(sizes),
      image: imageUrl,
      date: Date.now(),
    };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID." });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(  id, productData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    res.json({ success: true, message: "Product updated successfully.", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatelistproduct= async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};



const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const SingleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, listProducts, removeProduct, SingleProduct,updateProduct,updatelistproduct };