import mongoose, { Schema } from "mongoose";

const userSchema=new mongoose.Schema({
userName:{
    type:String,
    required:true,
    index:true,
    trim:true,
    unique:true,
    lowercase:true,
},
email:{
    type:String,
    required:true,
    trim:true,
    unique:true,
    lowercase:true,
},
fullName:{
    type:String,
    required:true,
    trim:true,
    index:true
},
avatar:{
    type:String,
    require:true
},
coverImage:{
    type:String
},
watchHistory:[
    {
        type:Schema.Types.ObjectId,
        ref:'video'

    }
]
,
refreshToken:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
}

},{timestamps:true});
userSchema.plugin(function (fn, op) {
    console.log("this",fn);
    console.log("Options passed:", op);
}, { message: 'hello' });
console.log("userSchema",userSchema);

const userModel=mongoose.model("user",userSchema);

export {userModel};
