import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDE_NAME,  
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadCloudinary = async (localdirpath) => {
  try {
    if (!localdirpath) {
      return null;
    }
    const response = await cloudinary.uploader.upload(localdirpath, {
      resource_type: "auto", 
    });


    fs.unlinkSync(localdirpath);

    return response;
  } catch (error) {
    fs.unlinkSync(localdirpath); 
    throw error;
  }
};

export { uploadCloudinary };
