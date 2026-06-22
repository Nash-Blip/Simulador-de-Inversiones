import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    // 1. Intentar obtener la cookie del token
    const token = request.cookies.get('token')?.value;

    // 2. Definir qué rutas requieren autenticación obligatoria
    const isProtectedRoute = 
        request.nextUrl.pathname.startsWith('/mercado') ||
        request.nextUrl.pathname.startsWith('/portafolio') ||
        request.nextUrl.pathname.startsWith('/transacciones') ||
        request.nextUrl.pathname.startsWith('/fondos') ||
        request.nextUrl.pathname.startsWith('/ajustes') ;

    // 3. Si intenta entrar a una ruta protegida sin token, redirección fulminante
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/auth/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// Configura el matcher para optimizar el rendimiento del middleware
export const config = {
    matcher: [
        '/mercado/:path*',
        '/portafolio/:path*',
        '/transacciones/:path*',
        '/fondos/:path*',
        '/ajustes/:path*',
        '/inversor/:path*',
    ],
};