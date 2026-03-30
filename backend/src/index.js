import dotenv from "dotenv";
import connectDB from "./database/index.js";
import app from "./app.js";

// Load environment variables from .env file

dotenv.config();

// Connect to MongoDB and start the server

connectDB()
.then(() => {
  app.on('error', (error) => {
    console.error('Server error:', error);
    throw error; // Rethrow the error to be caught by the outer catch block
  });

  app.listen(process.env.PORT || 8000, () => {
    console.log(`Server running on port ${process.env.PORT || 8000}`);
  });
})
.catch((error) => {  
  console.error('MONGO DB connection failed or Server error:', error);
  process.exit(1); // Exit the process with an error code
});