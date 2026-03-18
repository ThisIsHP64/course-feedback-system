import mongoose, { Schema } from 'mongoose';

const FeedbackSchema: Schema = new Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  // Enums from FeedbackCard.tsx badges
  contentQuality: {
    type: String,
    enum: ['good', 'average', 'poor'],
    required: true,
  },
  pacing: {
    type: String,
    enum: ['good', 'slow', 'fast'],
    required: true,
  },
  comment: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => v.trim().split(/\s+/).length >= 5,
      message: 'Feedback must be at least 5 words.',
    },
  },
  submittedAt: { type: Date, default: Date.now },
});

// Ensure a student can only submit feedback once per lesson
FeedbackSchema.index({ lessonId: 1, studentId: 1 }, { unique: true });

export default mongoose.model('Feedback', FeedbackSchema);
