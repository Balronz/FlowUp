import express from 'express';
import authRouter from './routes/authRouter.js';
import taskRouter from './routes/taskRouter.js';
import protect  from './middleware/authMiddleware.js';
import errorHandler  from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

//Initialize express and port
const app = express();
const port = process.env.PORT || 3000;

//Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Allows frontend
    credentials: true, //send and recieve cookies
}));
app.use(express.json());//Read data in JSON format
app.use(cookieParser());


//Routes
app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);

//Error handler
app.use(errorHandler);

export default app;