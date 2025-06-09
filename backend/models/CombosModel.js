import mongoose from "mongoose";


const comboSchema = new mongoose.Schema({
    name: { type: String, required: true },
    products: {type: Array, required: true},
    description: { type: String ,required: true},
    shortDescription: { type: String, required: true},
    additionalInformation:{type:String},
    actualprice: { type: Number },
    discountedprice: { type: Number },
    slug: { type: String, required: true },
    sku:{type:String,required:true},
    thumbImg:{type:String,required:true},
    galleryImg:{type:Array,required:true},
    stock:{type:Number,required:true},
})
const comboModel = mongoose.models.Combo || mongoose.model('Combo', comboSchema);
export default comboModel;
