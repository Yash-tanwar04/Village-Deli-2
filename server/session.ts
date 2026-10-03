import crypto from 'crypto';
import { UserProfile } from './types';

// Use environment secret, or consistent fallback secret
const SESSION_SECRET = process.env.SESSION_SECRET || process.env.JWT_SECRET || 'vdl_session_secret_2026_salt_98471203';
const SESSION_EXPIRATION_SECONDS = 30 * 24 * 60 * 60; // 30 Days

export interface SessionPayload {
  uid: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Creates a cryptographically signed HMAC-SHA256 session token
 */
export function createSessionToken(user: UserProfile): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    uid: user.id,
    email: user.email.toLowerCase(),
    role: user.role,
    iat: now,
    exp: now + SESSION_EXPIRATION_SECONDS
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

/**
 * Verifies the cryptographic signature, expiration, and format of a session token
 */
export function verifySessionToken(tokenString: string | undefined | null): SessionPayload | null {
  if (!tokenString || typeof tokenString !== 'string') return null;

  // Handle potential "Bearer " prefix if passed directly
  const token = tokenString.startsWith('Bearer ') ? tokenString.slice(7) : tokenString;

  const parts = token.split('.');
  if (parts.length !== 2) {
    // Backwards-compatible fallback for development tokens
    if (token.startsWith('vdl_token_') && process.env.NODE_ENV !== 'production') {
      const rawId = token.replace('vdl_token_', '');
      return {
        uid: rawId,
        email: '',
        role: 'customer',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600
      };
    }
    return null;
  }

  const [payloadB64, signature] = parts;

  // Verify HMAC signature using timing-safe comparison
  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadB64)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
    return null;
  }

  try {
    const rawJson = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const payload: SessionPayload = JSON.parse(rawJson);

    // Check expiration timestamp
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.warn(`[Auth] Session token expired for user ${payload.uid}`);
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}
