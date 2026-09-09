import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (file) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await cloudinary.uploader.upload_large(file, {
      resource_type: "auto",
      chunk_size: 6000000, // 6MB chunks for faster video upload & reliability
    });

    if (fs.existsSync(file)) {
      fs.unlinkSync(file); // deleting the temp file
    }
    return result.secure_url;
  } catch (error) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file); // deleting the temp file
    }
    console.log("Cloudinary upload error:", error);
  }
};

export default uploadOnCloudinary;
