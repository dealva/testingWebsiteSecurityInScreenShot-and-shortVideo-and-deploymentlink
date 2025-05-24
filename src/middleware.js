import { NextResponse } from 'next/server';
import { createCsrfMiddleware } from '@edge-csrf/nextjs';

const csrfMiddleware = createCsrfMiddleware({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
  },
});



function applySecurityHeaders(request, response) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('Permissions-Policy', 'geolocation=(), camera=()');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  const origin = `${request.nextUrl.protocol}//${request.headers.get('host')}`;
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token'
  );
  response.headers.set('Access-Control-Allow-Credentials', 'true');


  return response;
}

export async function middleware(request) {

  const pathname = request.nextUrl.pathname;

  if (pathname === '/register' || pathname === '/api/auth/register') {
    const response = await csrfMiddleware(request);
    return applySecurityHeaders(request, response);
  }

  const response = NextResponse.next();
  return applySecurityHeaders(request, response);
}
