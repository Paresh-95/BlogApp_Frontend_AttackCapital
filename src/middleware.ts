import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers'; 

export async function middleware(req: NextRequest) {
  
  const cookiesList = await cookies();
  const token = cookiesList.get('token'); 

  console.log("Token",token);
  
  const { pathname } = req.nextUrl;

  const loginUrl = new URL('/login', req.url);
  const dashboardUrl = new URL('/dashboard', req.url);

  if (pathname.startsWith('/dashboard') && !token) {
    console.log('No token, redirecting to /login');
    loginUrl.searchParams.set('reason', 'unauthorized');
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname.startsWith('/login') || pathname.startsWith('/sign-up')) && token) {
    console.log('Token exists, redirecting to /dashboard');
    dashboardUrl.searchParams.set('reason', 'already_authenticated');
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/sign-up'], // Apply middleware to these paths
};
