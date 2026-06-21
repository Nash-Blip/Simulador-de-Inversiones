import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode('s3cr3t_k3y');

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
    const isAdminPage = request.nextUrl.pathname.startsWith('/admin');
    const isHomePage = request.nextUrl.pathname === '/';

    if (!token && !isAuthPage && !isHomePage) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (token && !isAuthPage && !isHomePage) {
        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);

            if (payload.rol === 'admin' && !isAdminPage) {
                return NextResponse.redirect(new URL('/admin/transacciones', request.url));
            }

            if (payload.rol !== 'admin' && isAdminPage) {
                return NextResponse.redirect(new URL('/mercado', request.url));
            }

        } catch {
            const response = NextResponse.redirect(new URL('/auth/login', request.url));
            response.cookies.delete('token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|logo-simulador.png).*)'],
};