import express from "express"
import { addFood , listFood , removeFood } from "../controllers/foodController.js"
import multer from "multer"

const foodRouter = express.Router();

// Image Stroage Engine

const stroage = multer.diskStorage({
    destination : "uploads",
    filename : (req , file , cb) =>{
        return cb(null , `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage: stroage})

foodRouter.post("/add" , upload.single("image") ,addFood)
foodRouter.get("/list" , listFood)
foodRouter.post("/remove" , removeFood);








export default foodRouter ;