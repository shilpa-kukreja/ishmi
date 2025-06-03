import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  Shortdescription: { type: String },
  AdditionalInformation:{type:String},
  
  category: {
    mainCategory: { type: String, required: true },
    subCategory: { type: String, required: true },
  },
  sizes: [
    {
      size: { type: String },
      actualprice: { type: Number },
      discountedprice: { type: Number },
      offer:{ type: Number },
    },
  ],
  bestseller: { type: Boolean, default: false },
  image: [
    {
      url: String,
      originalname: String,
      _id: false, // ← This disables auto _id generation inside image array
    },
  ],
  date: { type: Date, default: Date.now },
});

const productModel = mongoose.model("Product", productSchema);

export default productModel;
