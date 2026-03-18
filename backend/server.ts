import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routers/users.js';
import coursesRouter from './routers/courses.js';
import lessonsRouter from './routers/lessons.js';
import feedbackRouter from './routers/feedback.js';

const app = express();
const PORT = process.env.PORT ?? 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Please ensure MONGO_URI exists in .env');
  process.exit(1);
}

app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/lessons', lessonsRouter);
app.use('/api/feedback', feedbackRouter);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
