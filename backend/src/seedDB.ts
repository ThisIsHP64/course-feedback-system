/**
 * seedDB.ts
 * Used for seeding the database with users, courses, lessons and feedback.
 * Run separately from server.ts
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Student from './models/Student.js';
import Professor from './models/Professor.js';

const MONGO_URI = process.env['MONGO_URI'] ?? 'mongodb://localhost:27017/course-feedback';

//TODO: Add some lessons, courses, feedbacks. Maybe more users?
async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const password = await bcrypt.hash('password123', 10);

  const existingStudent = await Student.findOne({ email: 'student@qu.edu' });
  if (!existingStudent) {
    await Student.create({ name: 'Test Student', email: 'student@qu.edu', password });
    console.log('Created: student@qu.edu');
  } else {
    console.log('Already exists: student@qu.edu');
  }

  const existingProfessor = await Professor.findOne({ email: 'professor@qu.edu' });
  if (!existingProfessor) {
    await Professor.create({ name: 'Test Professor', email: 'professor@qu.edu', password });
    console.log('Created: professor@qu.edu');
  } else {
    console.log('Already exists: professor@qu.edu');
  }

  await mongoose.disconnect();
}

seed().catch((err: unknown) => {
  if (err instanceof Error) {
    console.error('Seed failed:', err.message);
    if (err.stack) console.error(err.stack);
  } else {
    try {
      console.error('Seed failed:', JSON.stringify(err, null, 2));
    } catch {
      console.error('Seed failed with unknown error');
    }
  }
  process.exit(1);
});
