import foodModel from "../models/foodModel.js";
import { v2 as cloudinary } from "cloudinary";

// Helper — wraps upload_stream in a Promise so we can await it
// req.file.buffer comes from multer memoryStorage (no disk path needed)
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "zestfuse_foods", resource_type: "image" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(buffer);
    });
};

// POST /api/food/add
const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: "Image is required" });
        }

        const result = await uploadToCloudinary(req.file.buffer);

        const food = new foodModel({
            name:        req.body.name,
            description: req.body.description,
            price:       Number(req.body.price),
            category:    req.body.category,
            image:       result.secure_url,   // full Cloudinary URL
            driveFileId: result.public_id,    // e.g. "zestfuse_foods/abc123"
        });

        await food.save();
        res.json({ success: true, message: "Food Added Successfully" });

    } catch (error) {
        console.error("addFood error:", error);
        res.json({ success: false, message: error.message });
    }
};

// GET /api/food/list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error("listFood error:", error);
        res.json({ success: false, message: error.message });
    }
};

// POST /api/food/remove
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({ success: false, message: "Food not found" });
        }

        // Delete image from Cloudinary using the stored public_id
        if (food.driveFileId) {
            await cloudinary.uploader.destroy(food.driveFileId);
        }

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed Successfully" });

    } catch (error) {
        console.error("removeFood error:", error);
        res.json({ success: false, message: error.message });
    }
};

export { addFood, listFood, removeFood };
