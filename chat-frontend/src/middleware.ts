import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const isProtected = req.nextUrl.pathname.startsWith('/app');
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get('accessToken')?.value;
  if (!token) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ['/app/:path*'] };
