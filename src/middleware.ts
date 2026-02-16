// src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // Only log exact root path "/"
    if (pathname !== '/') {
      return NextResponse.next();
    }

    const headers = request.headers;

    // Client IP
    const ip = 
      headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headers.get('x-real-ip') ||
      headers.get('x-vercel-ip') ||
      'unknown';

    const visit = {
      timestamp: new Date().toISOString(),
      path: '/',
      referrer: headers.get('referer') 
        ? new URL(headers.get('referer')!).hostname 
        : 'direct',
      country: headers.get('x-vercel-ip-country') || 'unknown',
      region: headers.get('x-vercel-ip-country-region') || 'unknown',
      city: headers.get('x-vercel-ip-city') || 'unknown',
      userAgent: headers.get('user-agent')?.substring(0, 150) || 'unknown',
      ipFull: ip,
    };

    // Store in Upstash Redis
    try {
      await redis.lpush('visits', JSON.stringify(visit));
      console.log('Root page visit logged:', visit);
    } catch (storageErr) {
      console.error('Redis storage failed:', storageErr);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware crashed:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/'],
};
