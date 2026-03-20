/**
 * feedbacks.ts
 * Router that handles the /api/feedback route
 */

import { Router, type Response } from 'express';
import Feedback from '../models/Feedback.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/feedbacks?lessonId=<id>[&studentId=<id>]
// Optional query param for student to view their own feedback
// Return feedback collection for specific lesson
router.route('/').get(requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { lessonId, studentId } = req.query;
  if (!lessonId) {
    res.status(400).json({ message: 'lessonId query parameter is required' });
    return;
  }

  const filter: Record<string, unknown> = { lessonId };
  if (studentId) filter.studentId = studentId;

  const feedback = await Feedback.find(filter);
  res.json(feedback);
});

// POST /api/feedbacks
// Student logs feedback for lesson
router.route('/').post(requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  if (req.user!.role !== 'student') {
    res.status(403).json({ message: 'Only students can submit feedback' });
    return;
  }

  const { lessonId, rating, contentQuality, pacing, comment } = req.body;
  const studentId = req.user!.id;

  try {
    const feedback = await Feedback.create({
      lessonId,
      studentId,
      rating,
      contentQuality,
      pacing,
      comment,
    });
    res.status(201).json(feedback);
  } catch (err: unknown) {
    const mongoErr = err as { code?: number };
    if (mongoErr.code === 11000) {
      res.status(409).json({ message: 'Feedback already submitted for this lesson' });
      return;
    }
    throw err;
  }
});

// PUT /api/feedbacks/:id
// Student edits own feedback
router.route('/:id').put(requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const feedback = await Feedback.findById(req.params.id);
  if (!feedback) {
    res.status(404).json({ message: 'Feedback not found' });
    return;
  }

  if (feedback.studentId.toString() !== req.user!.id) {
    res.status(403).json({ message: 'You can only edit your own feedback' });
    return;
  }

  const { rating, contentQuality, pacing, comment } = req.body;
  feedback.rating = rating ?? feedback.rating;
  feedback.contentQuality = contentQuality ?? feedback.contentQuality;
  feedback.pacing = pacing ?? feedback.pacing;
  feedback.comment = comment ?? feedback.comment;

  await feedback.save();
  res.json(feedback);
});

export default router;
