import foodModel from "../models/foodModel.js";
import fs from 'fs'

//addd food item 

const addFood = async (req,res) => {
    
    let image_filename = `${req.file.filename}`;
    
    const food = new foodModel({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price ,
        image : image_filename ,
        category : req.body.category
    })
    try{
        await food.save();
        res.json({success : true , message : "Food Added"})
    }catch(error){
        console.log(error)
        res.json({success : false , message : "Error"})
    }
}


// all food list
const listFood = async (req , res) => {
    try{
        const foods = await foodModel.find({});
        res.json({ success : true , data : foods})
    }catch(error){
        console.log(error);
        res.json({ success : false , message : "Error"})
    }
}

// remove food iteam
const removeFood = async(req , res) =>{
    try{
        const foods = await foodModel.findById(req.body.id);      //find the food mode by id 
        fs.unlink(`uploads/${foods.image}` , () =>{})                      //delete the image from folder

        await foodModel.findByIdAndDelete(req.body.id);         //delete the image from database
        res.json({success : true , message : "Food Removed"})
    }catch(error){
        console.log(error);
        res.json({ success : false , message : "Error"})
    }
}
export {addFood , listFood , removeFood}















