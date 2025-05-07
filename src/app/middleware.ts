import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    // Refresh session if expired - required for Server Components
    const { data: { session }, error } = await supabase.auth.getSession()

    // Define protected routes
    const protectedRoutes = ['/dashboard', '/history', '/caption', '/profile', '/account']
    const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))

    // If accessing a protected route without a session, redirect to login
    if (isProtectedRoute) {
      if (!session || error) {
        console.log('No session found, redirecting to login')
        const redirectUrl = new URL('/login', req.url)
        redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }
    }

    // If accessing login/register with a session, redirect to dashboard
    if (session && !error && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
      console.log('Session found, redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // If there's an error, redirect to login to be safe
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 