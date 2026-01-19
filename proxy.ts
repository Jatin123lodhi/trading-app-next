import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoute = ['/dashboard', '/create-market', '/market']
const authRoutes = ['/login', '/register']

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get('token')?.value;

    let isAuthenticated = false;

    if (token) {
        try {
            // Use jose instead of jsonwebtoken for Edge Runtime compatibility
            const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
            jwtVerify(token, secret)
            isAuthenticated = true
        } catch (error) {
            // invalid token
            isAuthenticated = false
            console.log(error)
        }
    }

    // check if current route is protected
    const isProtectedRoute = protectedRoute.some(route => pathname.startsWith(route))

    // check if authRoute
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

    // redirect logic 
    if (isProtectedRoute && !isAuthenticated) {
        const loginURL = new URL('/login', request.url);
        loginURL.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginURL)
    }


    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next();

}

// configure which routes the middleware should run on
export const config = {
    matcher: [
        /*
     * Match all request paths except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)'
    ]
}