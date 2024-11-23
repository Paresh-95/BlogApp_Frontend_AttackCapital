import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get('token')?.value || '' // Retrieve token from cookies
  console.log(token)

  const isAuthPath = path === '/login' || path === '/sign-up' // Authentication routes
  const isDashboardPath = path.startsWith('/dashboard') // Dashboard and nested routes


  // If no token
  if (!token) {
    if (isDashboardPath) {
      // Redirect to login if trying to access dashboard or its nested routes
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Allow access to public and auth routes if no token
    return NextResponse.next()
  }

  // If token exists
  if (token) {
    if (isAuthPath) {
      // Redirect to dashboard if trying to access login or signup with token
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    // Allow access to dashboard and public routes
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)', // Apply middleware to all paths except API, static files, and favicon
  ],
}
