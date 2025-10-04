import { userModel } from '../models/user.model.js';
import { Apierror } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken'
const generateAccessandRefreshToken = async (userId) => {
    try {
        const user = await userModel.findById(userId);
        const accessToken = await user?.generateAccessToken();
        const refreshToken = await user?.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new Apierror(500, error?.message);
    }
};

const registerController = asyncHandler(async (req, res) => {
    const {
        userName,
        email,
        password,
        fullName,
        avatar,
        coverImage,
        watchHistory,
        refreshToken,
    } = req.body;

    if (
        [userName, email, password, fullName].some(
            (field) => !field || field.trim() === '',
        )
    ) {
        throw new Apierror(400, 'All fields are required');
    }

    const existUser = await userModel.findOne({
        $or: [{ userName }, { email }],
    });
    if (existUser) {
        throw new Apierror(409, 'User already exist');
    }

    const avatarPath = req?.files?.avatar[0]?.path;
    const coverImagePath = req?.files?.avatar[0]?.coverImage;

    if (!avatarPath) {
        throw new Apierror(400, 'Avatar file is required');
    }

    const avatarURL = await uploadCloudinary(avatarPath);
    console.log('avatarURL', avatarURL);
    const coverImageURL = await uploadCloudinary(coverImagePath);

    const user = await userModel.create({
        userName,
        email,
        password,
        avatar: avatarURL?.url,
        coverImage: coverImageURL?.url,
        fullName,
        watchHistory,
        refreshToken: '',
    });
    const createdUser = await userModel
        .findById(user?._id)
        .select('-password -refreshToken');
    if (!createdUser) {
        throw new Apierror(500, 'Something went wrong');
    }

    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, 'User created successfully'));
});

const loginController = asyncHandler(async (req, res) => {
    console.log('req.body', await req?.body);
    const { email, password } = req.body;

    console.log('email password', email, password);
    if (!email && !password) {
        throw new Apierror(400, 'All fields are required');
    }
    const user = await userModel.findOne({ $or: [{ email }, { password }] });
    if (!user) {
        throw new Apierror(404, "User doesn't exist");
    }
    console.log('user', user);
    const isValidPassword = await user.isPasswordVerify(password);
    if (!isValidPassword) {
        throw new Apierror(401, 'Invalid Password');
    }
    const { accessToken, refreshToken } = await generateAccessandRefreshToken(
        user?._id,
    );
    const options = {
        httpOnly: true,
        secure: true,
    };
    const loggedInUser = await userModel
        .findById(user?._id)
        .select('-password -refreshToken');
    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { data: loggedInUser, accessToken, refreshToken },
                'User logged in Successfully',
            ),
        );
});

const loggedOutController = asyncHandler(async (req, res) => {
    await userModel.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        {
            new: true,
        },
    );
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(201)
       .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, {}, 'Logged out Successfully'));
});

const refreshTokenController =asyncHandler(async (req,res)=>{
    const incomingToken= req.cookies?.refreshToken;
    if(!incomingToken){
        throw new Apierror(400,'Unauthorized Request');
    }
    const verifyToken=await jwt.verify(incomingToken,process.env.REFRESH_TOKEN_SECRET);
    console.log("verifyToken",verifyToken);
    const user=await userModel.findById(verifyToken?._id);
    if(user?.refreshToken !== incomingToken){
        throw new Apierror(401,"Invalid Refresh Token");
    }
    
    const accessToken=await user.generateAccessToken();
    const refreshToken=await user.generateRefreshToken();
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
        new ApiResponse(
            200,
            { data: user, accessToken, refreshToken },
            'User logged in Successfully',
        ),
    );
})

export { registerController, loginController, loggedOutController ,refreshTokenController};
