import mongoose, { Schema } from "mongoose";

const videoSchema=mongoose.Schema({
    videoFile:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        required:true
    },
    isPublished:{
        type:Boolean,
        default:0
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user"
    }
})

const videoModel=mongoose.model("video",videoModel);
export {videoModel}