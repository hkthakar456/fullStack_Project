console.log("🚀 STARTING SERVER...");

import dotenv from "dotenv";

import app from "./app.js";
console.log("✅ app loaded");

import connectDB from "./database/index.js";
console.log("✅ DB file loaded");


// Load environment variables from .env file

dotenv.config({
  path: "./.env",
});


// console.log("ENV:", process.env.MONGODB_URI);
// Connect to MongoDB and start the server only after a successful connection. Handle any connection errors gracefully.

connectDB()
.then(() => {
  app.on('error', (error) => {
    console.error('Server error:', error);
    throw error; // Rethrow the error to be caught by the outer catch block
  });

// Start the server after successful database connection and handle any server errors

  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
})
.catch((error) => {  
  console.error('MONGO DB connection failed or Server error:', error);
  process.exit(1); // Exit the process with an error code
});