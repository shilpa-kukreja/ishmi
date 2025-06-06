
import fs from "fs";
import path from "path";
import comboModel from "../models/CombosModel.js";

export const addCombo = async (req, res) => {
  try {
    const {
      name,
      products,
      description,
      slug,
      shortDescription,
      AdditionalInformation,
      actualprice,
      discountedprice,
      sku,
      stock
    } = req.body;

    const thumbImg = req.files['thumbImg']?.[0]?.filename;
    const galleryImg = req.files['galleryImg']?.map(file => file.filename);

    const newCombo = new comboModel({
      name,
      products: JSON.parse(products),
      description,
      shortDescription,
      AdditionalInformation,
      actualprice,
      discountedprice,
      slug,
      sku,
      thumbImg,
      galleryImg,
      stock
    });

    await newCombo.save();
    res.status(201).json({ message: "Combo created successfully",   success : true});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const listCombos = async (req, res) => {
  try {
    const combos = await comboModel.find();
    res.json(combos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};



export const updatelistcombos= async (req, res) => {
  try {
    const combo = await comboModel.findById(req.params.id);
    if (!combo) return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, combo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const removeCombo = async (req, res) => {
  try {
    const combo = await comboModel.findById(req.params.id);
    if (!combo) return res.status(404).json({ error: "Combo not found" });

    // Delete local image files
    const imagePaths = [combo.thumbImg, ...combo.galleryImg];
    imagePaths.forEach(img => {
      const filePath = path.join('uploads', img);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await comboModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Combo deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateCombo = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.files['thumbImg']) {
      updateData.thumbImg = req.files['thumbImg'][0].filename;
    }

    if (req.files['galleryImg']) {
      updateData.galleryImg = req.files['galleryImg'].map(file => file.filename);
    }

    if (updateData.products) {
      updateData.products = JSON.parse(updateData.products);
    }

     await comboModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
    
    res.json({ message: "Combo updated successfully", success : true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

