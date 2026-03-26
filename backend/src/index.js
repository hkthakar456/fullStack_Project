// // require('dotenv').config({path: './env'})
// import dotenv from 'dotenv';
// import connectDB from './database/index.js';

// dotenv.config({ path: './env' });

// connectDB()


import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/index.js";

dotenv.config();

const app = express();

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
