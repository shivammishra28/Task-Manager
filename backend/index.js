import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import rateLimiter from './middlewares/rateLimiter.js';

// connect DB
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error("MONGODB_URI not set");
  process.exit(1);
}
mongoose.set('strictQuery', true);
mongoose.connect(mongoUri)
  .then(() => console.log('✔ MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection failed', err);
    process.exit(1);
  });

const app = express();

// security & parsing
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

// health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// limit auth routes to mitigate abuse (demo)
app.use('/api/auth', rateLimiter);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404
app.use((req, res, next) => next(createError(404, 'Not found')));

// errors
app.use(errorHandler);

// start
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
