import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';

const cookieOpts = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
});

export const register = async (req, res) => {
  const { value, error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const exists = await User.findOne({ email: value.email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  const user = await User.create(value);
  const token = signToken({ id: user._id, email: user.email });
  res.cookie(process.env.COOKIE_NAME || 'tm_token', token, cookieOpts());
  res.status(201).json({ user: { id: user._id, email: user.email, name:user.name } });
};

export const login = async (req, res) => {
  const { value, error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const user = await User.findOne({ email: value.email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await user.comparePassword(value.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken({ id: user._id, email: user.email });
  res.cookie(process.env.COOKIE_NAME || 'tm_token', token, cookieOpts());
  res.json({ user: { id: user._id, email: user.email,name:user.name } });
};

export const me = async (req, res) => {
  res.json({ user: { id: req.user.id, email: req.user.email ,name: req.user.name} });
};

export const logout = async (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME || 'tm_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  res.json({ ok: true });
};
