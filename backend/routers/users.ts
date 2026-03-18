/**
 * users.ts
 * Router that handles the /api/users route
 */

import Router from 'express';
const router = Router();

// GET /api/users/:id
// Read profile
router.route('/:id').get(async (req, res) => {
  // Implement route
});

// PUT /api/users/:id
// Update profile
router.route('/:id').put(async (req, res) => {
  //TODO: Implement route
});

export default router;
