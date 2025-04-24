import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/login';
  
  // Define protected paths that require authentication
  const isProtectedPath = 
    path.startsWith('/blog/admin') || 
    path.startsWith('/api/blog') && !path.startsWith('/api/blog/posts');
  
  // Get the session token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect logic
  if (isPublicPath && token) {
    // If user is already logged in and tries to access login page,
    // redirect to admin dashboard
    return NextResponse.redirect(new URL('/blog/admin', request.url));
  }

  if (isProtectedPath && !token) {
    // If user is not logged in and tries to access protected routes,
    // redirect to login page
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/login',
    '/blog/admin/:path*',
    '/api/blog/:path*',
  ],
};
