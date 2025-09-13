import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Mark routes that should be protected
  const isProtected = pathname === '/' || pathname.startsWith('/app');

  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get('accessToken')?.value;

  if (!token) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', pathname); // redirect back after login
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = { matcher: ['/', '/app/:path*'] };
