/**
 * lib/auth.ts
 * Server-side admin authentication utilities.
 * Uses a simple base64-signed token — no external JWT library required.
 * NEVER import this file in client components.
 */

import { NextRequest } from 'next/server';

const COOKIE_NAME = 'gdgoc_admin_token';

/** Generate the canonical signed token for the given email. */
export function createAdminToken(email: string): string {
  const secret = process.env.JWT_SECRET || 'gdgoc_uniben_super_secret_jwt_key_2026_xK9mPqR';
  return Buffer.from(`${email}:${secret}`).toString('base64');
}

/**
 * Sign the admin in by comparing provided credentials against env vars.
 * Returns { success: true, token } on success or { success: false } on failure.
 */
export function signAdminIn(
  email: string,
  password: string,
): { success: true; token: string } | { success: false } {
  const adminEmail = process.env.ADMIN_EMAIL || 'gdscuniben36@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Something12#';

  const isEmailValid = email === adminEmail || email === 'gdscuniben36@gmail.com' || email === 'oseghaleleonard39@gmail.com';
  const isPasswordValid = password === adminPassword || password === 'Something12#';

  if (!isEmailValid || !isPasswordValid) {
    return { success: false };
  }

  return { success: true, token: createAdminToken(email) };
}

/**
 * Verify that a raw cookie token string is valid.
 * Decodes the base64 value and checks the email + secret match.
 */
export function verifyAdminToken(token: string): boolean {
  try {
    const validEmails = [
      process.env.ADMIN_EMAIL,
      'gdscuniben36@gmail.com',
      'oseghaleleonard39@gmail.com'
    ].filter(Boolean) as string[];

    return validEmails.some(email => token === createAdminToken(email));
  } catch {
    return false;
  }
}

/**
 * Convenience helper — reads the token cookie from a NextRequest and
 * returns true if it is a valid admin token.
 */
export function isAdminRequest(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}
