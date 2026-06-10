import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
        api_key: process.env.CLOUDINARY_API_KEY?.trim(),
        api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
    });

    // Actually ping Cloudinary to verify the keys work
    try {
        await cloudinary.api.ping();
        console.log("Cloudinary Connected ✓");
    } catch (error) {
        console.log("FULL CLOUDINARY ERROR:");
    }
};

export default connectCloudinary;
