import mongoose from "mongoose";


const blogSchema = new mongoose.Schema({
        name: { type: String, requried: true },
        image: {
                url: String,
                originalname: String,
        },
        description: { type: String, requried: true }
})

const blogModel = mongoose.models.blog || mongoose.model('blog', blogSchema)
export default blogModel;