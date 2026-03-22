import type mongoose from 'mongoose';

export interface IStudent {
  name: string;
  email: string;
  password: string;
  bio: string;
  feedbackHistory: mongoose.Types.ObjectId[];
}

export interface IProfessor {
  name: string;
  email: string;
  password: string;
  bio: string;
}

export interface IFeedback {
  lessonId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  rating: number;
  contentQuality: 'good' | 'average' | 'poor';
  pacing: 'good' | 'slow' | 'fast';
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}
