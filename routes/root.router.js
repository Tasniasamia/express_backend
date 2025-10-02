import { Router } from 'express';
import authRoute from './auth.router';


const router = Router();

const moduleRouters = [
  
    {
        path: '/auth',
        route: authRoute
    }
];

moduleRouters.forEach((route) => router.use(route.path, route.route));
export default router;