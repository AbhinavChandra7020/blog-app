// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  console.log(`Middleware: ${method} ${pathname}`); // Debug log

  // Skip middleware for auth routes
  if (pathname.startsWith('/api/auth')) {
    console.log('✅ Auth route - allowing');
    return NextResponse.next();
  }

  // Allow all GET requests to posts
  if (method === 'GET' && pathname.startsWith('/api/posts')) {
    console.log('✅ GET posts route - allowing');
    return NextResponse.next();
  }

  // For non-GET requests to /api/posts, require authentication
  if (pathname.startsWith('/api/posts')) {
    console.log('🔒 Protected posts route - checking auth');
    
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      console.log('❌ No token - unauthorized');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log('✅ Token found - allowing');
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/posts/:path*'
};