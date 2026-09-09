import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

const uploadOnCloudinary = async (file) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const absolutePath = path.resolve(file);
    if (!fs.existsSync(absolutePath)) {
      console.log("File not found for Cloudinary upload:", absolutePath);
      return null;
    }

    const result = await cloudinary.uploader.upload(absolutePath, {
      resource_type: "auto",
    });

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath); // deleting the temp file
    }
    return result.secure_url;
  } catch (error) {
    const absolutePath = path.resolve(file);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath); // deleting the temp file
    }
    console.log("Cloudinary upload error:", error);
    throw error;
  }
};

export default uploadOnCloudinary;
