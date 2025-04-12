import dotenv from 'dotenv';
import app from './app.js';
import { connectMongoDB } from './config/db.js';
import {v2 as cloudinary} from 'cloudinary';

// Handle uncaught exceptions BEFORE anything else
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.error(err);
  console.log('Shutting down the server due to uncaught exception');
  process.exit(1); // No need to close server here since it might not be started yet
});

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



// Connect to database
connectMongoDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});



// Handle unhandled promise rejections (e.g. async DB or controller errors)
process.on('unhandledRejection', (err) => {
  console.error(` Unhandled Promise Rejection: ${err.message}`);
  console.error(err);
  console.log('Shutting down the server due to unhandled rejection');

  server.close(() => {
    process.exit(1);
  });
});





