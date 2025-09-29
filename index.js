import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongodbConnection from './db/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app=express();

//middleware
app.use(express.json({limit:"2MB"}));
app.use(express.urlencoded({extended:true , limit:"2MB"}));
app.use(express.static('public'));
app.use(cors());
app.use(cookieParser());

mongodbConnection().then(()=>{
  app.listen((process.env.PORT || 3000),()=>{
    console.log(`http://localhost:${process.env.PORT || 3000}`);
})
}).catch((err)=>{
throw new err;
})

app.get('/',(req,res)=>{
  res.send("Server is running");
})
