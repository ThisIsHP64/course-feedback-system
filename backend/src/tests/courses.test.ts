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

let mongoServer: MongoMemoryServer;
let studentId: string;
let professorId: string;
let courseId: string;
let studentToken: string;
let professorToken: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  // Create new test objects
  const student = await Student.create({
    name: 'Test Student',
    email: 'student@qu.edu',
    password: await bcrypt.hash('password123', 10),
  });
  studentId = student._id.toString();
  studentToken = jwt.sign({ id: studentId, role: 'student' }, secret, { expiresIn: '1h' });

  const professor = await Professor.create({
    name: 'Test Professor',
    email: 'professor@qu.edu',
    password: await bcrypt.hash('password123', 10),
  });
  professorId = professor._id.toString();
  professorToken = jwt.sign({ id: professorId, role: 'professor' }, secret, {
    expiresIn: '1h',
  });

  const course = await Course.create({
    code: 'SER341',
    name: 'Full Stack Development',
    semester: 'Spring 2025',
    professorId: new mongoose.Types.ObjectId(professorId),
    students: [new mongoose.Types.ObjectId(studentId)],
  });
  courseId = (course._id as mongoose.Types.ObjectId).toString();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('GET /api/courses', () => {
  // --- Student Courses ---
  it('returns courses the student is enrolled in', async () => {
    const res = await request(app)
      .get('/api/courses')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].code).toBe('SER341');
  });

  // --- Professor Courses ---
  it('returns courses taught by the professor', async () => {
    const res = await request(app)
      .get('/api/courses')
      .set('Authorization', `Bearer ${professorToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].code).toBe('SER341');
  });

  // --- Bad Authentication ---
  it('returns 401 when no token is provided', async () => {
    const res = await request(app).get('/api/courses');

    expect(res.status).toBe(401);
  });
});

describe('GET /api/courses/:id', () => {
  // --- Single Course ---
  it('returns a single course by id', async () => {
    const res = await request(app)
      .get(`/api/courses/${courseId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(courseId);
    expect(res.body.name).toBe('Full Stack Development');
  });

  // --- Bad Authentication ---
  it('returns 404 for a non-existent course id', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .get(`/api/courses/${fakeId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(404);
  });
});
