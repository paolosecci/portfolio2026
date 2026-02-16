// src/app/api/track/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    // Validate type (only allow known events)
    const allowedTypes = [
      'lsp_click',
      'virgil_click',
      'virgil_opened',
      'virgil_message_sent',
    ];

    if (!type || !allowedTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 });
    }

    const ip = 
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('x-vercel-ip') ||
      'unknown';

    const event = {
      timestamp: new Date().toISOString(),
      type,
      ipClient: ip,
      country: request.headers.get('x-vercel-ip-country') || 'unknown',
      region: request.headers.get('x-vercel-ip-country-region') || 'unknown',
      city: request.headers.get('x-vercel-ip-city') || 'unknown',
      userAgent: request.headers.get('user-agent')?.substring(0, 150) || 'unknown',
      referrer: request.headers.get('referer') 
        ? new URL(request.headers.get('referer')!).hostname 
        : 'direct',
      // Option for the future: add path or other context if passed in body
    };

    await redis.lpush('visits', JSON.stringify(event));

    console.log('Client event logged:', event);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track API error:', error);
    return NextResponse.json({ error: 'Failed to log event' }, { status: 500 });
  }
}
