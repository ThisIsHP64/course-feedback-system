/**
 * lessons.ts
 * Router that handles the /api/lessons route
 */

import Router from 'express';

const router = Router();

// GET /api/lessons?courseId=<id>
// Returns all lessons for a course, sorted by week then date
router.route('/').get(async (req, res) => {
  //TODO: Implement Route
});

// GET /api/lessons/:id
// Single lesson details
router.route('/:id').get(async (req, res) => {
  //TODO: Implement route
});

export default router;
