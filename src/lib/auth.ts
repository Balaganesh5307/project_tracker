import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { AuthUserPayload } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development-only';

export function signJwtToken(payload: AuthUserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJwtToken(token: string): AuthUserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUserPayload;
  } catch {
    return null;
  }
}

export function getUserFromRequest(request: NextRequest): AuthUserPayload | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  return verifyJwtToken(token);
}

