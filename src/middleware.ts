import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isAuthPath = path === '/login' || path === '/signup'
  const isHomePath = path === '/'

  const token = request.cookies.get('token')?.value || ''

  if (!isAuthPath && !isHomePath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

