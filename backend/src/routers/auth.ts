import { Router, type Request, type Response, type NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { HydratedDocument } from 'mongoose';
import Student from '../models/Student.js';
import Professor from '../models/Professor.js';
import { type IStudent, type IProfessor } from '../types/types.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';
import passport from '../middleware/passport.js';

const router = Router();

router.route('/login').post((req: Request, res: Response, next: NextFunction): void => {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  passport.authenticate(
    'local',
    { session: false },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (err: Error | null, user: any, info: { message?: string }) => {
      if (err) return next(err);

      if (!user) {
        return res.status(401).json({ message: info?.message ?? 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, {
        expiresIn: '8h',
      });
      res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    },
  )(req, res, next);
});

router
  .route('/change-password')
  .put(requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(400).json({ message: 'oldPassword and newPassword are required' });
      return;
    }

    const user: HydratedDocument<IStudent> | HydratedDocument<IProfessor> | null =
      req.user!.role === 'student'
        ? await Student.findById(req.user!.id)
        : await Professor.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  });

router.route('/reset-password').put(async (req: Request, res: Response): Promise<void> => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    res.status(400).json({ message: 'Email and new password are required' });
    return;
  }

  let user: HydratedDocument<IStudent> | HydratedDocument<IProfessor> | null =
    await Student.findOne({ email });
  if (!user) {
    user = await Professor.findOne({ email });
  }

  if (!user) {
    res.status(404).json({ message: 'Account not found for that email' });
    return;
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: 'Password reset successfully' });
});

export default router;
