import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_HEADERS = { 'Cache-Control': 'no-store, no-cache, must-revalidate' };
const COOKIE_LAST_PATH = 'last_valid_path';

const ROL_HOME: Record<string, string> = {
    admin: '/admin/inversores',
    user: '/mercado',
};

function withNoStore(response: NextResponse): NextResponse {
    for (const [key, value] of Object.entries(PROTECTED_HEADERS)) {
        response.headers.set(key, value);
    }
    return response;
}

function setLastPathCookie(response: NextResponse, pathname: string): NextResponse {
    response.cookies.set(COOKIE_LAST_PATH, pathname, {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
    });
    return response;
}

export function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const isProtectedRoute =
        pathname.startsWith('/mercado') ||
        pathname.startsWith('/portafolio') ||
        pathname.startsWith('/transacciones') ||
        pathname.startsWith('/fondos') ||
        pathname.startsWith('/ajustes') ||
        pathname.startsWith('/admin');

    const isUserRoute = isProtectedRoute && !pathname.startsWith('/admin');
    const isAdminRoute = pathname.startsWith('/admin');
    const isAuthRoute = pathname.startsWith('/auth');

    if (!token) {
        if (isProtectedRoute) {
            const loginUrl = new URL('/auth/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    try {
        const base64Url = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64Url));
        const role: string = payload.rol;

        if (role === 'admin' && isUserRoute) {
            const lastValid = request.cookies.get(COOKIE_LAST_PATH)?.value;
            return NextResponse.redirect(new URL(lastValid || ROL_HOME.admin, request.url));
        }

        if (role === 'user' && isAdminRoute) {
            const lastValid = request.cookies.get(COOKIE_LAST_PATH)?.value;
            return NextResponse.redirect(new URL(lastValid || ROL_HOME.user, request.url));
        }

        if (isAuthRoute) {
            return NextResponse.redirect(new URL(ROL_HOME[role] || ROL_HOME.user, request.url));
        }

        if (isProtectedRoute) {
            return setLastPathCookie(withNoStore(NextResponse.next()), pathname);
        }

        return withNoStore(NextResponse.next());
    } catch {
        if (isProtectedRoute) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        '/mercado/:path*',
        '/portafolio/:path*',
        '/transacciones/:path*',
        '/fondos/:path*',
        '/ajustes/:path*',
        '/admin/:path*',
        '/auth/:path*',
    ],
};
