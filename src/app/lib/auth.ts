import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

// JWT token'dan user bilgilerini çıkar
export interface TokenPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  iat: number;
  exp: number;
}

// Token doğrula
export function verifyToken(token: string): TokenPayload | null {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET tanımlanmamış');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// Request'ten token al
export function getTokenFromRequest(request: NextRequest): string | null {
  // Authorization header'dan
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7); // "Bearer " kısmını çıkar
  }

  // Cookie'den (alternatif)
  const tokenCookie = request.cookies.get('token');
  if (tokenCookie) {
    return tokenCookie.value;
  }

  return null;
}

// User bilgilerini request'ten al
export function getUserFromRequest(request: NextRequest): TokenPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }

  return verifyToken(token);
}