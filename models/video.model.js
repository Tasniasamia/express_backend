import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

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
videoSchema.plugin(aggregatePaginate)
const videoModel=mongoose.model("video",videoSchema);
export {videoModel}