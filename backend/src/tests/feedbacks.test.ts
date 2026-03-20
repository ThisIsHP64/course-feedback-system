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
let professorToken: string;
let studentId: string;
let lessonId: string;

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
  const professorId = professor._id.toString();
  professorToken = jwt.sign({ id: professorId, role: 'professor' }, secret, {
    expiresIn: '1h',
  });

  const course = await Course.create({
    code: 'SER341',
    name: 'Full Stack Development',
    semester: 'Spring 2025',
    professorId: professor._id,
    students: [student._id],
  });

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

describe('GET /api/feedbacks', () => {
  // --- Bad Request ---
  it('returns 400 when lessonId is missing', async () => {
    const res = await request(app)
      .get('/api/feedbacks')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(400);
  });
  it('returns 401 when no token is provided', async () => {
    const res = await request(app).get(`/api/feedbacks?lessonId=${lessonId}`);

    expect(res.status).toBe(401);
  });

  // --- Empty Feedback ---
  it('returns an empty array when no feedbacks exists yet', async () => {
    const res = await request(app)
      .get(`/api/feedbacks?lessonId=${lessonId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('POST /api/feedbacks', () => {
  // --- Bad Authentication ---
  it('returns 403 when a professor tries to submit feedbacks', async () => {
    const res = await request(app)
      .post('/api/feedbacks')
      .set('Authorization', `Bearer ${professorToken}`)
      .send({
        lessonId,
        rating: 5,
        contentQuality: 'good',
        pacing: 'good',
        comment: 'This lesson was very informative and well structured.',
      });

    expect(res.status).toBe(403);
  });

  // --- Create Feedback ---
  it('creates feedbacks successfully for a student', async () => {
    const res = await request(app)
      .post('/api/feedbacks')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        lessonId,
        rating: 4,
        contentQuality: 'good',
        pacing: 'good',
        comment: 'This lesson was very well structured.',
      });

    expect(res.status).toBe(201);
    expect(res.body.rating).toBe(4);
    expect(res.body.studentId).toBe(studentId);
  });

  // --- Create Feedback Again ---
  it('returns 409 when the same student submits feedbacks twice for the same lesson', async () => {
    const res = await request(app)
      .post('/api/feedbacks')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        lessonId,
        rating: 3,
        contentQuality: 'average',
        pacing: 'slow',
        comment: 'Already submitted feedbacks for this lesson.',
      });

    expect(res.status).toBe(409);
  });

  // --- Comment Length ---
  it('returns 500 when the comment is fewer than 5 words', async () => {
    // Create a second student
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const other = await Student.create({
      name: 'Other Student',
      email: 'other@qu.edu',
      password: await bcrypt.hash('password123', 10),
    });
    const otherToken = jwt.sign({ id: other._id.toString(), role: 'student' }, secret, {
      expiresIn: '1h',
    });

    const res = await request(app)
      .post('/api/feedbacks')
      .set('Authorization', `Bearer ${otherToken}`)
      .send({
        lessonId,
        rating: 1,
        contentQuality: 'poor',
        pacing: 'fast',
        comment: 'Too short',
      });

    expect(res.status).toBe(500);
  });
});

describe('GET /api/feedbacks (after submission)', () => {
  // --- Lesson Feedback ---
  it('returns the submitted feedback for a lesson', async () => {
    const res = await request(app)
      .get(`/api/feedbacks?lessonId=${lessonId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].rating).toBe(4);
  });

  // --- Lesson Feedback Filtered ---
  it('filters by studentId when provided', async () => {
    const res = await request(app)
      .get(`/api/feedbacks?lessonId=${lessonId}&studentId=${studentId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});
