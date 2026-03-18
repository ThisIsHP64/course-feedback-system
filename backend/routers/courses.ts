/**
 * courses.ts
 * Router that handles the /api/courses route
 */

import Router from 'express';
import Course from '../models/Course.js';

const router = Router();

// GET /api/courses
// Students: returns courses where their id is in students[]
// Professors: returns courses where their id matches professorId
router.route('/').get(async (req, res) => {
  //TODO: Determine actual role
  const user = { id: 1, role: 'professor' };

  const courses = await Course.find(user).populate('professorId', 'name');
  res.json(courses);
});

// GET /api/courses/:id
router.route('/:id').get(async (req, res) => {
  const course = await Course.findById(req.params.id).populate(
    'professorId',
    'name',
  );
  res.json(course);
});

export default router;
