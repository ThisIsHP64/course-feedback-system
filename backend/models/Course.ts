import mongoose, { Schema } from 'mongoose';

const CourseSchema: Schema = new Schema(
  {
    code: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    semester: { type: String, required: true },
    professorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Professor',
      required: true,
    },
    avgGrade: { type: Number, default: 0 },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  },
  { timestamps: true },
);

export default mongoose.model('Course', CourseSchema);
