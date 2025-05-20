import foodModel from "../models/foodModel.js";
import fs from "fs";
import { google } from "googleapis";
import apikeys from "../apikeys.json" assert { type: "json" };
import { PassThrough } from "node:stream";

// Google Auth Setup
const auth = new google.auth.GoogleAuth({
  keyFile: "apikeys.json",
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

// ✅ Replace with your actual folder ID and share the folder with your service account
const FOLDER_ID = "1FZvjcY81ShYpQeXaBNIqEx0bbCyogP6O";

// Upload Image to Google Drive
const uploadToDrive = async (file) => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  const bufferStream = new PassThrough();
  bufferStream.end(file.buffer);

  try {
    // Step 1: Upload the file
    const response = await drive.files.create({
      requestBody: {
        name: file.originalname,
        mimeType: file.mimetype,
        parents: [FOLDER_ID], // ✅ Ensure your service account has access to this folder
      },
      media: {
        mimeType: file.mimetype,
        body: bufferStream,
      },
    });

    const fileId = response.data.id;

    // Step 2: Make it publicly accessible
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    // Step 3: Generate public URL
    const publicUrl = `https://drive.google.com/uc?id=${fileId}`;
    return { imageLink: publicUrl, fileId };
  } catch (error) {
    console.error("Upload failed:", error);
    throw new Error("Failed to upload to Google Drive");
  }
};
  
  // const uploadToDrive = async (file) => {
  //   const bufferStream = new PassThrough();
  //   bufferStream.end(file.buffer);
  
  //   const response = await drive.files.create({
  //     requestBody: {
  //       name: file.originalname,
  //       mimeType: file.mimetype,
  //       parents: [FOLDER_ID],
  //     },
  //     media: {
  //       mimeType: file.mimetype,
  //       body: bufferStream,
  //     },
  //   });
  
  //   // Make the file public
  //   await drive.permissions.create({
  //     fileId: response.data.id,
  //     requestBody: {
  //       role: "reader",
  //       type: "anyone",
  //     },
  //   });
  
  //   // ✅ Use more reliable public URL
  //   const publicUrl = `https://drive.google.com/uc?export=view&id=${response.data.id}`;
  //   return { imageLink: publicUrl, fileId: response.data.id };
  // };
  
//addd food item 

const addFood = async (req,res) => {

    const file = req.file;
    const { imageLink, fileId } = await uploadToDrive(file);

    
    // let image_filename = `${req.file.filename}`;
    
    const food = new foodModel({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price ,
        image :  imageLink ,
        category : req.body.category,
        driveFileId: fileId
    })
    try{
        await food.save();
        res.json({success : true , message : "Food Added"})
    }catch(error){
        console.log(error)
        res.json({success : false , message : "Failed to add food item"})
    }
}

// all food list

const listFood = async (req , res) => {
    try{
        const foods = await foodModel.find({});
        res.json({ success : true , data : foods})
    }catch(error){
        console.log(error);
        res.json({ success : false , message : "Failed to fetch food items"})
    }
}

// remove food iteam

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id); // find the food item by id

    if (food.driveFileId) {
      await drive.files.delete({ fileId: food.driveFileId });
    }

    await foodModel.findByIdAndDelete(req.body.id); // delete the item from the database
    res.json({ success: true, message: "Food Removed" });
    } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing food item" });
  }
};

export {addFood , listFood , removeFood}















