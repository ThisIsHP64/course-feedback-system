import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Student from '../backend/models/Student';
import Professor from '../backend/models/Professor';
import Course from '../backend/models/Course';
import Lesson from '../backend/models/Lesson';
import Feedback from '../backend/models/Feedback';
import { after } from 'node:test';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Course Feedback System CRUD Tests', () => {
  let studentId: mongoose.Types.ObjectId;
  let professorId: mongoose.Types.ObjectId;
  let courseId: mongoose.Types.ObjectId;
  let lessonId: mongoose.Types.ObjectId;
  let feedbackId: mongoose.Types.ObjectId;

  // --- CREATE ---
  it('should create a complete hierarchy (Professor -> Course -> Lesson)', async () => {
    // 1. Create Professor
    const prof = await Professor.create({
      name: 'Ruby Elkharboutly',
      email: 'relkharboutly@qu.edu',
      password: 'hashedpassword123',
    });
    professorId = prof._id as mongoose.Types.ObjectId;

    // 2. Create Student
    const student = await Student.create({
      name: 'Hunter Pageau',
      email: 'hpageau@qu.edu',
      password: 'hashedpassword123',
    });
    studentId = student._id as mongoose.Types.ObjectId;

    // 3. Create Course
    const course = await Course.create({
      code: 'SER341',
      name: 'Full Stack Development',
      semester: 'Fall 2025',
      professorId: professorId,
      students: [studentId],
    });
    courseId = course._id as mongoose.Types.ObjectId;

    // 4. Create Lesson (Testing your "Redundant week removed" requirement)
    const lesson = await Lesson.create({
      courseId: courseId,
      title: 'Introduction to Mongoose',
      description: 'Schema design and CRUD',
      date: new Date(),
    });
    lessonId = lesson._id as mongoose.Types.ObjectId;

    expect(lesson.title).toBe('Introduction to Mongoose');
  });

  it('should log feedback and update Student history', async () => {
    const feedback = await Feedback.create({
      lessonId: lessonId,
      studentId: studentId,
      rating: 5,
      contentQuality: 'good',
      pacing: 'good',
      comment: 'This lesson was very well structured!', // 6 words, passes validation
    });
    feedbackId = feedback._id as mongoose.Types.ObjectId;

    // Simulate updating the student collection as requested by your team
    await Student.findByIdAndUpdate(studentId, {
      $push: { feedbackHistory: feedbackId },
    });

    const updatedStudent = await Student.findById(studentId);
    expect(updatedStudent?.feedbackHistory).toContainEqual(feedbackId);
  });

  // --- READ ---
  it('should fetch all feedback for a specific lesson', async () => {
    const results = await Feedback.find({ lessonId: lessonId });
    expect(results.length).toBe(1);
    expect(results[0].comment).toContain('well structured');
  });

  // --- UPDATE ---
  it('should update feedback and update the updatedAt timestamp', async () => {
    const originalFeedback = await Feedback.findById(feedbackId);

    // Wait slightly to ensure timestamp difference
    await new Promise((resolve) => setTimeout(resolve, 100));

    const updated = await Feedback.findByIdAndUpdate(
      feedbackId,
      { comment: 'Updated comment: Still great, but I had one question.' },
      { returnDocument: 'after' },
    );

    expect(updated?.comment).toContain('Updated comment');
    // Testing the "timestamps: true" requirement
    expect(updated?.updatedAt).not.toEqual(originalFeedback?.createdAt);
  });

  // --- DELETE ---
  it('should delete a course and verify its removal', async () => {
    await Course.findByIdAndDelete(courseId);
    const deletedCourse = await Course.findById(courseId);
    expect(deletedCourse).toBeNull();
  });

  // --- VALIDATION TEST ---
  it('should fail if feedback comment is less than 5 words', async () => {
    const shortFeedback = new Feedback({
      lessonId: lessonId,
      studentId: studentId,
      rating: 1,
      contentQuality: 'poor',
      pacing: 'fast',
      comment: 'Too short', // Only 2 words
    });

    await expect(shortFeedback.save()).rejects.toThrow();
  });
});
