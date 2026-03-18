import mongoose, { Schema } from 'mongoose';

const ProfessorSchema: Schema = new Schema(
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

export default mongoose.model('Professor', ProfessorSchema);
