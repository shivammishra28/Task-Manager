import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  try {
    const cookieName = process.env.COOKIE_NAME || 'tm_token';
    const token = req.cookies[cookieName];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const payload = verifyToken(token);
    const user = await User.findById(payload.id).select('_id email name');
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    req.user = { id: user._id, email: user.email, name: user.name }; // 👈 include name
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
