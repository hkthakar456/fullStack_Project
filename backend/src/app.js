import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from "path";

const app = express();// Create an instance of the Express application

//======= CORS Configuration =======//

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

//======= Middleware Configuration =======//

app.use(express.json({limit: '16kb'}));// Configure body parser with a size limit of 16kb
app.use(express.urlencoded({ extended: true, limit: '16kb' }));// Configure URL-encoded parser with a size limit of 16kb
app.use(express.static(path.join(process.cwd(), "public"))); // Serve static files from the "public" directory

//======= Cookie Parser Configuration =======//

app.use(cookieParser());

app.get("/", (req, res) => {
    console.log("🔥 ROOT HIT");
    res.send("Working");
});

//======= Routes =======//
import userRoutes from './routes/user.routes.js';
import videoRoutes from "./routes/video.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import likeRoutes from "./routes/like.routes.js";

//routes declaration
app.use("/api/v1/users", userRoutes);  // Use the user routes for any requests to http://localhost:8000/api/v1/users/....

app.use("/api/v1/videos", videoRoutes); // Use the video routes for any requests to http://localhost:8000/api/v1/videos/....

app.use("/api/v1/comments", commentRoutes); // Use the comment routes for any requests to http://localhost:8000/api/v1/comments/....

app.use("/api/v1/likes", likeRoutes); // Use the like routes for any requests to http://localhost:8000/api/v1/likes/....

//======= Global Error Handler =======//

app.use((err, req, res, next) => {
    console.error("❌ ERROR:", err.message);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

export default app;

