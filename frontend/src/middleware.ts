import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
  role: {
    name: string;
  };
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const userCookie = request.cookies.get('user');
  const { pathname } = request.nextUrl;

  // Allow access to login page
  if (pathname === '/login') {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Protect all other routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check for admin access
  if (pathname.startsWith('/admin')) {
    if (!userCookie) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      const user: User = JSON.parse(userCookie.value);
      if (user.role.name !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 