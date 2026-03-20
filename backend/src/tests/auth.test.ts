import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import app from '../server.js';
import Student from '../models/Student.js';
import Professor from '../models/Professor.js';

let mongoServer: MongoMemoryServer;
let studentId: string;
let studentToken: string;

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
  studentToken = jwt.sign({ id: studentId, role: 'student' }, secret, {
    expiresIn: '1h',
  });

  await Professor.create({
    name: 'Test Professor',
    email: 'professor@qu.edu',
    password: await bcrypt.hash('password123', 10),
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('POST /api/auth/login', () => {
  // --- Student Login ---
  it('logs in a student and returns a token with role', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'student@qu.edu', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.role).toBe('student');
  });

  // --- Professor Login ---
  it('logs in a professor and returns a token with role', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'professor@qu.edu', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.role).toBe('professor');
  });

  // --- Bad Request ---
  it('returns 400 when fields are missing', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'student@qu.edu' });

    expect(res.status).toBe(400);
  });

  // --- Bad Authentication ---
  it('returns 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'student@qu.edu', password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });
  it('returns 401 for non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@qu.edu', password: 'password123' });

    expect(res.status).toBe(401);
  });
});

describe('PUT /api/auth/change-password', () => {
  // --- Bad Authentication ---
  it('returns 401 when no token is provided', async () => {
    const res = await request(app)
      .put('/api/auth/change-password')
      .send({ oldPassword: 'password123', newPassword: 'newpassword456' });

    expect(res.status).toBe(401);
  });

  // --- Bad Request ---
  it('returns 400 when fields are missing', async () => {
    const res = await request(app)
      .put('/api/auth/change-password')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ oldPassword: 'password123' });

    expect(res.status).toBe(400);
  });
  it('returns 400 when old password is incorrect', async () => {
    const res = await request(app)
      .put('/api/auth/change-password')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ oldPassword: 'wrongpassword', newPassword: 'newpassword456' });

    expect(res.status).toBe(400);
  });

  // --- Change Password ---
  it('changes the password successfully', async () => {
    const res = await request(app)
      .put('/api/auth/change-password')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ oldPassword: 'password123', newPassword: 'newpassword456' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Password updated successfully');

    // Reset for other test files
    const student = await Student.findById(studentId);
    student!.password = await bcrypt.hash('password123', 10);
    await student!.save();
  });
});
