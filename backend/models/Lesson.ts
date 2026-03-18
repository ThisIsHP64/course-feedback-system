import mongoose, { Schema } from 'mongoose';

const LessonSchema: Schema = new Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true }, // week removed as redundant
  },
  { timestamps: true },
);

export default mongoose.model('Lesson', LessonSchema);
