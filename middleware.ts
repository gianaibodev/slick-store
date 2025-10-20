import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Check if the route is an admin route
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to admin login page
    if (req.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }

    // For demo purposes, allow access to all admin routes
    // In production, you would check authentication here
    console.log('Admin access granted for:', req.nextUrl.pathname)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
