import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name:        { type: String, required: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true },   // fixed typo: was "require"
    image:       { type: String, required: true },   // Cloudinary secure_url
    category:    { type: String, required: true },
    driveFileId: { type: String, required: false },  // Cloudinary public_id (for deletion)
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
