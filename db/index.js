import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const mongodbConnection=async()=>{
    try{
        const connectMongo=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}?retryWrites=true&w=majority`);
        console.log("mongoose connect",connectMongo);
        console.log("mongodb connected successfully");
    }
    catch(error){
        console.log("error",error);
    }
}

export default mongodbConnection;