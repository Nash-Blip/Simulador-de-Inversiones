import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_HEADERS = { 'Cache-Control': 'no-store, no-cache, must-revalidate' };

function noStore(response: NextResponse): NextResponse {
    for (const [key, value] of Object.entries(PROTECTED_HEADERS)) {
        response.headers.set(key, value);
    }
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
        const role = payload.rol;

        if (role === 'admin' && isUserRoute) {
            return NextResponse.redirect(new URL('/admin/inversores', request.url));
        }

        if (role === 'user' && isAdminRoute) {
            return NextResponse.redirect(new URL('/mercado', request.url));
        }

        if (isAuthRoute) {
            return NextResponse.redirect(new URL(role === 'admin' ? '/admin/inversores' : '/mercado', request.url));
        }

        return noStore(NextResponse.next());
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
