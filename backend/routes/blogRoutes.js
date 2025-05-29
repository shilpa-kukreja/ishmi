import express from 'express'
import { addblog, listblog, removeblog } from '../controllers/blogController.js';
import upload from '../middleware/multer.js';


const blogRouter=express.Router();

blogRouter.post('/add',upload.single("image"),addblog);
blogRouter.get('/get',listblog)
blogRouter.post('/remove',removeblog);

export default blogRouter;