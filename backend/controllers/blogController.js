import {v2 as cloudinary} from 'cloudinary'
import blogModel from '../models/blogModel.js';
import fs from 'fs';
import path from 'path';

const addblog = async (req, res) => {
  try {
    const { name, description } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    const blogData = {
      name,
      description,
      image: {
        url: `/uploads/${imageFile.filename}`,
        originalname: imageFile.originalname,
      },
    };

    const blog = new blogModel(blogData);
    await blog.save();

    res.status(200).json({ success: true, message: "Blog Added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



const listblog=async(req,res)=>{
    try {
        const allblog=await blogModel.find({});
        res.json({success:true,blogs:allblog})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const removeblog = async (req, res) => {
  try {
    const blog = await blogModel.findById(req.body.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Delete image file from server
    if (blog.image?.url) {
      const filePath = path.join('uploads', path.basename(blog.image.url));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await blogModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: 'Blog Removed' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export {addblog,listblog,removeblog}