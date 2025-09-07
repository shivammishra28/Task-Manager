import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || "123@superman";
if (!SECRET) throw new Error('JWT_SECRET is required');

export const signToken = (payload, expiresIn = '7d') => jwt.sign(payload, SECRET, { expiresIn });
export const verifyToken = (token) => jwt.verify(token, SECRET);
