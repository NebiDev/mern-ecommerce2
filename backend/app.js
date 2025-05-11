import express from 'express';
import cors from 'cors';
import product from './routes/productRoutes.js';
import user from './routes/userRoutes.js';
import order from './routes/orderRoutes.js';
import errorHandleMiddleware from './middleware/error.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
const app = express();


const allowedOrigins = [
    'http://localhost:5173',     // for local dev
    'https://yourfrontend.com',  // replace with your production domain
  ];
  
  app.use(cors({
    origin: allowedOrigins,
    credentials: true,
  }));
  



// middleware
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload())





// routes
app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);


// error middleware
app.use(errorHandleMiddleware);


export default app; 