import mongoose, { Schema } from 'mongoose';
import { type IStudent } from '../types/types.js';

const StudentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/@qu\.edu$/, 'Please use a valid @qu.edu email'],
    },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    // View and edit previous feedback
    feedbackHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }],
  },
  { timestamps: true },
);

export default mongoose.model<IStudent>('Student', StudentSchema);
