/**
 * \middleware\passport.ts
 * Passport with a Local Strategy for email/password authentication.
 * Checks both Student and Professor collections and attaches role to a user object.
 */

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import Student from '../models/Student.js';
import Professor from '../models/Professor.js';

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      let user = await Student.findOne({ email });
      let role = 'student';

      if (!user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user = (await Professor.findOne({ email })) as any;
        role = 'professor';
      }

      if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      return done(null, { id: user._id.toString(), role, name: user.name });
    } catch (err) {
      return done(err);
    }
  }),
);

export default passport;
