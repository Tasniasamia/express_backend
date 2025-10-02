import { userModel } from '../models/user.model.js';
import { Apierror } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {uploadCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/apiResponse.js';

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
            (field) => !field || field.trim() === ''
        )
    ) {
        throw new Apierror(400, 'All fields are required');
    }
    

    const existUser=await userModel.findOne({
        $or:[{userName},{email}]
    })
    if(existUser){
        throw new Apierror(409,'User already exist');
    }

const avatarPath=req?.files?.avatar[0]?.path;
const coverImagePath=req?.files?.avatar[0]?.coverImage;

if(!avatarPath){
throw new Apierror(400,'Avatar file is required');
}

const avatarURL=await uploadCloudinary(avatarPath);
console.log("avatarURL",avatarURL)
const coverImageURL=await uploadCloudinary(coverImagePath);

const user=await userModel.create({
    userName,
    email,
    password,
    avatar:avatarURL?.url,
    coverImage:coverImageURL?.url,
    fullName,
    watchHistory,
    refreshToken:''
});
const createdUser=await userModel.findById(user?._id).select('-password -refreshToken');
if(!createdUser){
    throw new Apierror(500,'Something went wrong');

}

return res.status(201).json(
    new ApiResponse(200,createdUser,'User created successfully')
)



});

export {
    registerController
}