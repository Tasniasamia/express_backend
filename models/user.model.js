import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';

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
userSchema.pre('save',function(){
    if(!this.isPasswordVerify('password')){return }
    return this.password=bcrypt.hash(this.password);
})
userSchema.methods.isPasswordVerify=(password)=>{
    return bcrypt.compare(password,this.password);
}

const userModel=mongoose.model("user",userSchema);

export {userModel};
