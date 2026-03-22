import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import app from '../server.js';
import Student from '../models/Student.js';
import Professor from '../models/Professor.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';

let mongoServer: MongoMemoryServer;
let studentToken: string;
let courseId: string;
let lessonId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  // Create test objects
  const student = await Student.create({
    name: 'Test Student',
    email: 'student@qu.edu',
    password: await bcrypt.hash('password123', 10),
  });
  const studentId = student._id.toString();
  studentToken = jwt.sign({ id: studentId, role: 'student' }, secret, { expiresIn: '1h' });

  const professor = await Professor.create({
    name: 'Test Professor',
    email: 'professor@qu.edu',
    password: await bcrypt.hash('password123', 10),
  });

  const course = await Course.create({
    code: 'SER341',
    name: 'Full Stack Development',
    semester: 'Spring 2025',
    professorId: professor._id,
    students: [student._id],
  });
  courseId = (course._id as mongoose.Types.ObjectId).toString();

  const lesson = await Lesson.create({
    courseId: course._id,
    title: 'Intro to Servers',
    description: 'Building REST APIs',
    date: new Date('2025-02-01'),
  });
  lessonId = (lesson._id as mongoose.Types.ObjectId).toString();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('GET /api/lessons', () => {
  // --- Course Lessons ---
  it('returns all lessons for a course', async () => {
    const res = await request(app)
      .get(`/api/lessons?courseId=${courseId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Intro to Servers');
  });

  // --- Bad Request ---
  it('returns 400 when courseId is missing', async () => {
    const res = await request(app)
      .get('/api/lessons')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(400);
  });

  // --- Bad Authentication ---
  it('returns 401 when no token is provided', async () => {
    const res = await request(app).get(`/api/lessons?courseId=${courseId}`);

    expect(res.status).toBe(401);
  });
});

describe('GET /api/lessons/:id', () => {
  // --- Single Lesson ---
  it('returns a single lesson by id', async () => {
    const res = await request(app)
      .get(`/api/lessons/${lessonId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(lessonId);
    expect(res.body.title).toBe('Intro to Servers');
  });

  // --- Not Found ---
  it('returns 404 for a non-existent lesson id', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .get(`/api/lessons/${fakeId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(404);
  });
});
