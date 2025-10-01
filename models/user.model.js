import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            index: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        avatar: {
            type: String,
            require: true,
        },
        coverImage: {
            type: String,
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: 'video',
            },
        ],
        refreshToken: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);
userSchema.pre('save', async function (next) {
    console.log('this', this);
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordVerify = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.accessToken = function (payload) {
    return jwt.sign(
        { userName: this.userName, email: this.email, password: this.userName },
        process.env.ACCESS_TOKEN_SECRET,
        { expireIn: process.env.EXPIREIN },
    );
};

userSchema.methods.RefreshToken = function (payload) {
    return jwt.sign(
        { userName: this.userName, email: this.email, password: this.userName },
        process.env.REFRESH_TOKEN_SECRET,
        { expireIn: process.env.REFRESH_EXPIRY },
    );
};

const userModel = mongoose.model('user', userSchema);

export { userModel };
