import mongoose, { Schema } from 'mongoose';

const StudentSchema: Schema = new Schema(
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
    feedbackHistory: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' },
    ],
  },
  { timestamps: true },
);

export default mongoose.model('Student', StudentSchema);
