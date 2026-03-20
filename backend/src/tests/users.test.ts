import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import app from '../server.js';
import Student from '../models/Student.js';

let mongoServer: MongoMemoryServer;
let studentId: string;
let otherStudentId: string;
let studentToken: string;

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
    bio: 'Original bio',
  });
  studentId = student._id.toString();
  studentToken = jwt.sign({ id: studentId, role: 'student' }, secret, { expiresIn: '1h' });

  const other = await Student.create({
    name: 'Other Student',
    email: 'other@qu.edu',
    password: await bcrypt.hash('password123', 10),
  });
  otherStudentId = other._id.toString();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('GET /api/users/:id', () => {
  // --- User Profile ---
  it('returns the user profile', async () => {
    const res = await request(app)
      .get(`/api/users/${studentId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Test Student');
  });

  // --- Bad Authentication ---
  it('returns 401 when no token is provided', async () => {
    const res = await request(app).get(`/api/users/${studentId}`);

    expect(res.status).toBe(401);
  });

  // --- Not found ---
  it('returns 404 for a non-existent user id', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .get(`/api/users/${fakeId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(404);
  });
});

describe('PUT /api/users/:id', () => {
  // --- Update Profile ---
  it('updates name and bio for the authenticated user', async () => {
    const res = await request(app)
      .put(`/api/users/${studentId}`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ name: 'Updated Name', bio: 'Updated bio' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Name');
    expect(res.body.bio).toBe('Updated bio');
  });

  // --- Bad Authentication ---
  it('returns 403 when trying to update another user', async () => {
    const res = await request(app)
      .put(`/api/users/${otherStudentId}`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ name: 'Hacked Name' });

    expect(res.status).toBe(403);
  });
  it('returns 401 when no token is provided', async () => {
    const res = await request(app).put(`/api/users/${studentId}`).send({ name: 'No Auth' });

    expect(res.status).toBe(401);
  });
});
