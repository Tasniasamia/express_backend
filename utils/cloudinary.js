import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
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
            public_id: process.env.PUBLIC_ID,
        });
        console.log('response', response?.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localdirpath);
    }
};

export { uploadCloudinary };
