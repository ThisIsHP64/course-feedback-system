import mongoose, { Schema } from 'mongoose';

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    // Email validation
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/@qu\.edu$/, 'Please use a valid @qu.edu email'],
    },
    password: { type: String, required: true }, // For Login/ResetPassword
    role: {
      type: String,
      enum: ['student', 'professor'],
      required: true,
    },
    // Supporting ProfilePage.tsx additional fields
    designation: { type: String, default: 'Student' },
    bio: { type: String, default: '' },
  },
  { timestamps: true },
);

export default mongoose.model('User', UserSchema);
