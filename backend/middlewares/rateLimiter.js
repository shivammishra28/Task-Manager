// NOTE: In production replace with Redis-backed limiter (e.g. express-rate-limit + redis store)
const windowMs = 15 * 60 * 1000;
const maxReq = 100;
const hits = new Map();

export default function rateLimiter(req, res, next) {
  const key = req.ip;
  const now = Date.now();
  const entry = hits.get(key) || [];
  const windowStart = now - windowMs;
  const recent = entry.filter(ts => ts > windowStart);
  recent.push(now);
  hits.set(key, recent);
  if (recent.length > maxReq) {
    return res.status(429).json({ message: 'Too many requests' });
  }
  next();
}
