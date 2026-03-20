import mongoose, { Schema } from 'mongoose';
import { type IProfessor } from '../types/types.js';

const ProfessorSchema = new Schema<IProfessor>(
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
  },
  { timestamps: true },
);

export default mongoose.model<IProfessor>('Professor', ProfessorSchema);
