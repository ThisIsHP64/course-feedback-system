import mongoose, { Schema } from 'mongoose';
import { type IFeedback } from '../types/types.js';

const FeedbackSchema = new Schema<IFeedback>(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    contentQuality: {
      type: String,
      enum: ['good', 'average', 'poor'],
      required: true,
    },
    pacing: { type: String, enum: ['good', 'slow', 'fast'], required: true },
    comment: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => v.trim().split(/\s+/).length >= 5,
        message: 'Feedback must be at least 5 words.',
      },
    },
  },
  {
    // track submission and edits automatically
    timestamps: true,
  },
);

FeedbackSchema.index({ lessonId: 1, studentId: 1 }, { unique: true });

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
