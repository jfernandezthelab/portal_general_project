import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export const proxy = auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session?.user

  // Public routes — always accessible
  const isPublicRoute = nextUrl.pathname.startsWith('/login')
  if (isPublicRoute) return NextResponse.next()

  // Protected routes — require login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  // Admin routes — require ADMIN or CONSULTANT role
  if (nextUrl.pathname.startsWith('/admin')) {
    const role = session?.user.role
    if (role !== 'ADMIN' && role !== 'CONSULTANT') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}