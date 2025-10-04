import { userModel } from '../models/user.model.js';
import { Apierror } from '../utils/apiError.js';
import jwt from 'jsonwebtoken';

const verifyToken = async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header('Authorization')?.replace('Bearer ', '');
        console.log('accessToken', token);
        if (!token) {
            throw new Apierror(401, 'Unauthorized Request');
        }

        const decodedUser = await jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
        );

        const user = await userModel
            .findOne(decodedUser?.user?.email)
            .select('-refreshToken -password');

        if (!user) {
            throw new Apierror(401, 'Invalid Token');
        }

        req.user = user;
        next();
    } catch (error) {
        throw new Apierror(400, error?.message);
    }
};

export { verifyToken };
