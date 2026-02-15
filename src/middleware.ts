// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function middleware(request: NextRequest) {
  // Skip tracking for API routes, static assets, Vercel internals, etc.
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/static') ||
    request.nextUrl.pathname.includes('favicon.ico') ||
    request.nextUrl.pathname.includes('vercel')
  ) {
    return NextResponse.next();
  }

  const headers = request.headers;

  // Full original IP – no truncation
  const ip = headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             headers.get('x-real-ip') ||
             headers.get('x-vercel-ip') ||
             'unknown';

  const visit = {
    timestamp: new Date().toISOString(),
    path: request.nextUrl.pathname,
    referrer: headers.get('referer') ? new URL(headers.get('referer')!).hostname : 'direct',
    country: headers.get('x-vercel-ip-country') || 'unknown',
    region: headers.get('x-vercel-ip-country-region') || 'unknown',
    city: headers.get('x-vercel-ip-city') || 'unknown',
    userAgent: headers.get('user-agent')?.substring(0, 150) || 'unknown',
    ipFull: ip,  // ← full IP, no anonymization
  };

  // Store in Vercel KV (append to list)
  await kv.lpush('visits', JSON.stringify(visit)).catch((err) => {
    console.error('KV log failed:', err);
  });

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
