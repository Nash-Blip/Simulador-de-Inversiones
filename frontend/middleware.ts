import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode('s3cr3t_k3y');

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
    const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

    if (!token && !isAuthPage) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (token && isAdminPage) {
        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            if (payload.rol !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url));
            }
        } catch {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};