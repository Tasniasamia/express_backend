import { Router } from 'express';
import { upload } from '../middleware/multer.middleware.js';
import { registerController } from '../controllers/auth.controller.js';
const authRoute = Router();
authRoute.post('/resister',
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 },
    ]),
    registerController,
);
export default authRoute;
