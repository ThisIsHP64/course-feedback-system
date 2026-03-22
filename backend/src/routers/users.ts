/**
 * users.ts
 * Router that handles the /api/users route
 */

import { Router, type Response } from 'express';
import Student from '../models/Student.js';
import Professor from '../models/Professor.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/users/:id
// Read profile
router.route('/:id').get(requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  // Get user id based on role
  const user =
    req.user!.role === 'student'
      ? await Student.findById(req.params.id).select('name bio')
      : await Professor.findById(req.params.id).select('name bio');
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json(user);
});

// PUT /api/users/:id
// Update profile
router.route('/:id').put(requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  if (req.user!.id !== req.params.id) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  // Update user based on role
  const { name, bio } = req.body;
  const user =
    req.user!.role === 'student'
      ? await Student.findByIdAndUpdate(
          req.params.id,
          { name, bio },
          { new: true, runValidators: true },
        ).select('name bio')
      : await Professor.findByIdAndUpdate(
          req.params.id,
          { name, bio },
          { new: true, runValidators: true },
        ).select('name bio');

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.json(user);
});

export default router;
