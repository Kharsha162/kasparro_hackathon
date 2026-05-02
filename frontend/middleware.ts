import { NextRequest, NextResponse } from 'next/server'

// Define protected routes
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get token from localStorage (for client-side) or cookies
  const token = request.cookies.get('authToken')?.value

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.includes(pathname)

  // If trying to access protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If logged in and trying to access login/signup, redirect to dashboard
  if (token && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Specify which routes to apply middleware to
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
