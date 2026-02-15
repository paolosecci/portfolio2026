// middleware.ts (at project root or src/middleware.ts)
import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function middleware(request: NextRequest) {
  try {
    // Skip internal, static, API, and asset paths — no need to log them
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

    // Store in Vercel KV (append to list 'visits')
    // This is fire-and-forget — if KV fails, we log but don't crash
    try {
      await kv.lpush('visits', JSON.stringify(visit));
    } catch (kvErr) {
      console.error('KV storage failed:', kvErr);
    }

    // Optional: also log to runtime logs for immediate visibility
    console.log('Visit logged:', visit);

    return NextResponse.next();
  } catch (error) {
    // Critical: catch ANY middleware crash → prevent 500 on every request
    console.error('Middleware crashed:', error);
    // Always continue serving the page — never block the user
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
