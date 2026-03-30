import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();// Create an instance of the Express application

//======= CORS Configuration =======//

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

//======= Middleware Configuration =======//

app.use(express.json({limit: '16kb'}));// Configure body parser with a size limit of 16kb
app.use(express.urlencoded({ extended: true, limit: '16kb' }));// Configure URL-encoded parser with a size limit of 16kb
app.use(express.static('public'));// Serve static files from the 'public' directory

//======= Cookie Parser Configuration =======//

app.use(cookieParser());



app.get('/', (req, res) => {
  res.send('Hello, World!');
});

export default app;

