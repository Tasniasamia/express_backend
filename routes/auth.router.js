import { Router } from 'express';
import { upload } from '../middleware/multer.middleware.js';
import { registerController,loginController,loggedOutController } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
const authRoute = Router();
authRoute.post('/resister',
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 },
    ]),
    registerController,
);
authRoute.post('/login',
loginController,
);
authRoute.post('/logout',verifyToken,loggedOutController);

export default authRoute;
