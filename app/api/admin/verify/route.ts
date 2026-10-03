/**
 * app/api/admin/verify/route.ts
 * GET /api/admin/verify
 * Verifies whether the current request carries a valid admin session cookie.
 */

import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const admin = isAdminRequest(request);
  return NextResponse.json({ isAdmin: admin }, { status: admin ? 200 : 401 });
}
