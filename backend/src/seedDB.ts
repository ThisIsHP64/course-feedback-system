import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Student from './models/Student.js';
import Professor from './models/Professor.js';
import Course from './models/Course.js';
import Lesson from './models/Lesson.js';
import Feedback from './models/Feedback.js';

const MONGO_URI = process.env['MONGO_URI'] ?? 'mongodb://localhost:27017/course-feedback';

async function seed() {
  await mongoose.connect(MONGO_URI);

  await Promise.all([
    Student.deleteMany({}),
    Professor.deleteMany({}),
    Course.deleteMany({}),
    Lesson.deleteMany({}),
    Feedback.deleteMany({}),
  ]);

  const password = await bcrypt.hash('password123', 10);

  const prof = await Professor.create({
    name: 'Ruby Elkharboutly',
    email: 'professor@qu.edu',
    password,
    bio: 'Professor of Software Engineering at Quinnipiac University.',
  });

  const students = await Student.insertMany([
    { name: 'Hunter Pageau', email: 'student@qu.edu', password },
    { name: 'Evan Alves', email: 'evan@qu.edu', password },
    { name: 'Jean LaFrance', email: 'jean@qu.edu', password },
    { name: 'Boomer Bobcat', email: 'boomer@qu.edu', password },
  ]);

  const studentIds = students.map((s) => s._id);

  const courses = await Course.insertMany([
    {
      code: 'SER340',
      name: 'Full Stack Development',
      professorId: prof._id,
      description: 'Introduction to Full Stack development',
      semester: 'Fall 2025',
      students: studentIds,
    },
    {
      code: 'SER491',
      name: 'Senior Capstone I',
      professorId: prof._id,
      description: 'Senior Project',
      semester: 'Fall 2025',
      students: studentIds,
    },
  ]);

  const lessons = await Lesson.insertMany([
    {
      courseId: courses[0]._id,
      title: 'Introduction to React',
      description: 'Overview of components and props',
      date: new Date('2025-08-26'),
    },
    {
      courseId: courses[0]._id,
      title: 'State and Lifecycle',
      description: 'Managing component data',
      date: new Date('2025-08-28'),
    },
  ]);

  await Feedback.create({
    lessonId: lessons[0]._id,
    studentId: studentIds[0],
    rating: 5,
    contentQuality: 'good',
    pacing: 'good',
    comment: 'Great introduction, very clear and well-organized!',
  });

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
