import dotenv from 'dotenv';
dotenv.config();


import express from 'express';
import mongodbConnection from './db/index.js';
const app=express();
mongodbConnection();
app.use(express.json());
app.get('/',(req,res)=>{
  res.send("Server is running");
})
app.listen((process.env.PORT || 3000),()=>{
    console.log(`http://localhost:${process.env.PORT || 3000}`);
})