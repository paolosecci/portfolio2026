// middleware.ts (place at project root or src/middleware.ts)

import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function middleware(request: NextRequest) {
  try {
    // Skip logging for internal paths, API routes, static assets, etc.
    if (
      request.nextUrl.pathname.startsWith('/api') ||
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/static') ||
      request.nextUrl.pathname.includes('favicon.ico') ||
      request.nextUrl.pathname.includes('vercel') ||
      request.nextUrl.pathname.includes('_vercel')
    ) {
      return NextResponse.next();
    }

    const headers = request.headers;

    // Note IP info
    const ip = 
      headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headers.get('x-real-ip') ||
      headers.get('x-vercel-ip') ||
      'unknown';

    const visit = {
      timestamp: new Date().toISOString(),
      path: request.nextUrl.pathname,
      referrer: headers.get('referer') 
        ? new URL(headers.get('referer')!).hostname 
        : 'direct',
      country: headers.get('x-vercel-ip-country') || 'unknown',
      region: headers.get('x-vercel-ip-country-region') || 'unknown',
      city: headers.get('x-vercel-ip-city') || 'unknown',
      userAgent: headers.get('user-agent')?.substring(0, 150) || 'unknown',
      ipFull: ip,
    };

    // Store in Upstash Redis (append to list 'visits')
    try {
      await redis.lpush('visits', JSON.stringify(visit));
      console.log('Visit saved to Upstash Redis:', visit);
    } catch (storageErr) {
      console.error('Upstash Redis storage failed:', storageErr);
    }

    return NextResponse.next();
  } catch (error) {
    // Critical safety net: catch any middleware crash → never return 500 to user
    console.error('Middleware execution failed:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except API routes, static files,
     * image optimization files, and favicon.
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
