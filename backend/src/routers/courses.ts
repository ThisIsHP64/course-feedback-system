/**
 * courses.ts
 * Router that handles the /api/courses route
 */

import { Router, type Response } from 'express';
import Course from '../models/Course.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/courses
// Return courses collection depending on user's role
router.route('/').get(requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id, role } = req.user!;

  const filter = role === 'professor' ? { professorId: id } : { students: id };

  const courses = await Course.find(filter).populate('professorId', 'name');
  res.json(courses);
});

// GET /api/courses/:id
// Return single course details
router.route('/:id').get(requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const course = await Course.findById(req.params.id).populate('professorId', 'name');
  if (!course) {
    res.status(404).json({ message: 'Course not found' });
    return;
  }
  res.json(course);
});

export default router;
