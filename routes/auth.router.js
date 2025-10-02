import { Router } from "express";
import { registerController } from "../controllers/auth.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const authRoute=Router();
authRoute.route('/resister').post(upload.fields([{name:'avatar',maxCount:1},{name:'coverImage',maxCount:1}]),registerController);
export default authRoute;