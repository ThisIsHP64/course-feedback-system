/**
 * \routers\auth.ts
 * Router that handles the /api/auth route
 */

import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { HydratedDocument } from 'mongoose';
import Student from '../models/Student.js';
import Professor from '../models/Professor.js';
import { type IStudent, type IProfessor } from '../types/types.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/login
router.route('/login').post(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  // Determine if user's email is student or professor
  let user: HydratedDocument<IStudent> | HydratedDocument<IProfessor> | null =
    await Student.findOne({ email });
  let role = 'student';
  if (!user) {
    user = await Professor.findOne({ email });
    role = 'professor';
  }
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  // Compare password hash
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  // Return token
  const token = jwt.sign({ id: user._id.toString(), role }, process.env.JWT_SECRET as string, {
    expiresIn: '8h',
  });
  res.json({ token, user: { id: user._id, name: user.name, role } });
});

// PUT /api/auth/change-password
router
  .route('/change-password')
  .put(requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(400).json({ message: 'oldPassword and newPassword are required' });
      return;
    }

    // Get user id based on role
    const user: HydratedDocument<IStudent> | HydratedDocument<IProfessor> | null =
      req.user!.role === 'student'
        ? await Student.findById(req.user!.id)
        : await Professor.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Compare password hash
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  });

export default router;
