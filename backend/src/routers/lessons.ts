/**
 * lessons.ts
 * Router that handles the /api/lessons route
 */

import { Router, type Response } from 'express';
import Lesson from '../models/Lesson.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/lessons?courseId=<id>
// Return lessons collection for given course, sorted by week then date
router.route('/').get(requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { courseId } = req.query;
  if (!courseId) {
    res.status(400).json({ message: 'courseId query parameter is required' });
    return;
  }

  const lessons = await Lesson.find({ courseId }).sort({ week: 1, date: 1 });
  res.json(lessons);
});

// GET /api/lessons/:id
// Return single lesson details
router.route('/:id').get(requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const lesson = await Lesson.findById(req.params.id).populate('courseId', 'name code');
  if (!lesson) {
    res.status(404).json({ message: 'Lesson not found' });
    return;
  }
  res.json(lesson);
});

export default router;
