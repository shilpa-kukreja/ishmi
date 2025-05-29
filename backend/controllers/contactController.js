import contactModel from "../models/contactModel.js";


const addContact=async(req,res)=>{
    try {
        const contact=new contactModel(req.body);
        await contact.save();
        res.status(201).json({success:true,message:"From Data Saved Successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:"Failed to save Data"});
    }
}


const listContact=async(req,res)=>{
    try {
        const contacts=await contactModel.find({}).sort({submittedAt:-1});
        res.status(200).json(contacts)
    } catch (error) {
         console.log(error)
         res.status(500).json({success:false,message:"Failed to fetch data"})
    }
}



const removeContact=async(req,res)=>{
    try {
        await contactModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Contact Removed"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


export {addContact,listContact,removeContact}