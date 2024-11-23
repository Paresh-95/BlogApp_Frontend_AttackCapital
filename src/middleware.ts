import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get('token') 

  console.log('Request Path:', path)
  console.log('Token:', token) 

  const isAuthPath = path === '/login' || path === '/sign-up'  
  const isHomePath = path === '/'  
  const isDashboardPath = path === '/dashboard'  


  if (!isAuthPath && !isHomePath && !token) {
    console.log('Redirecting to login because no token is found')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  
  if (isAuthPath && token) {
    console.log('Redirecting to dashboard because token exists')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',  
  ],
}
