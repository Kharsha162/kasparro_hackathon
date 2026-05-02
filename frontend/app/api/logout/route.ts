import { NextResponse } from 'next/server'

export async function GET() {
  const response = NextResponse.redirect(
    new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
  )

  // Delete the authToken cookie on the server side so middleware sees it gone instantly
  response.cookies.set('authToken', '', {
    path: '/',
    expires: new Date(0),
    maxAge: 0,
    httpOnly: false,
    sameSite: 'lax',
  })

  return response
}
