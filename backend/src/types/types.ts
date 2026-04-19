import type mongoose from 'mongoose';

// Augment Express.User so passport's req.user matches our auth shape everywhere
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: string;
      role: string;
      name?: string;
    }
  }
}

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
