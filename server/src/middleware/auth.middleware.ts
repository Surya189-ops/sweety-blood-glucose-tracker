import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
}

export const requireAuth: RequestHandler = (req, res, next) => {
  const customToken = req.headers['x-sweety-token'];
  const authorization = req.headers.authorization;
  const token = typeof customToken === 'string'
    ? customToken.trim()
    : authorization?.startsWith('Bearer ')
      ? authorization.slice(7).trim()
      : '';

  if (!token) {
    res.status(401).json({
      message: 'Authentication required. Please log in.',
    });
    return;
  }

  const secret = process.env.JWT_SECRET;

  if (!token || !secret) {
    res.status(401).json({
      message: 'Invalid authentication credentials.',
    });
    return;
  }

  try {
    const payload = jwt.verify(token, secret);

    if (
      typeof payload === 'string' ||
      typeof payload.userId !== 'string' ||
      !payload.userId
    ) {
      res.status(401).json({
        message: 'Invalid authentication token.',
      });
      return;
    }

    req.userId = (payload as TokenPayload).userId;
    next();
  } catch {
    res.status(401).json({
      message: 'Your session is invalid or expired. Please log in again.',
    });
  }
};
