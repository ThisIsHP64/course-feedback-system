/**
 * feedback.ts
 * Router that handles the /api/feedback route
 */

import Router from 'express';
import Feedback from '../models/Feedback.js';

const router = Router();

// GET /api/feedback?lessonId=<id>
// Professor views all feedback for a lesson
router.route('/').get(async (req, res) => {
  //TODO: Use actual query data
  const lessonId: Record<string, unknown> = { lessonId: 1 };

  const feedback = await Feedback.find(lessonId);
  res.json(feedback);
});

// POST /api/feedback
// Student logs feedback for a lesson
router.route('/').post(async (req, res) => {
  //TODO: Implement route
});

// PUT /api/feedback/:id
// Student edits own feedback
router.route('/:id').put(async (req, res) => {
  //TODO: Implement route
});

export default router;
