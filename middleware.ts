import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware para controlar el acceso según el rol del usuario
export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const userDataString = req.cookies.get('userData');
    const userData = userDataString ? JSON.parse(userDataString) : null;

    // Proteger las rutas de docente
    if (pathname.startsWith('/docente')) {
        if (!userData || userData.role !== 'docente') {
            return NextResponse.redirect(new URL('/', req.url)); // Redirigir si no es docente
        }
    }

    // Proteger las rutas de estudiante
    if (pathname.startsWith('/estudiante')) {
        if (!userData || userData.role !== 'estudiante') {
            return NextResponse.redirect(new URL('/', req.url)); // Redirigir si no es estudiante
        }
    }

    return NextResponse.next(); // Continuar si cumple las condiciones
}

// Definir qué rutas serán protegidas por el middleware
export const config = {
    matcher: ['/docente/:path*', '/estudiante/:path*'], // Rutas protegidas
};
