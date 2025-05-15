import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const additionalPublicPaths = [
    '/terms',
    '/privacy',
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isPublicPath =
        pathname === '/' ||
        pathname.startsWith('/auth/') ||
        pathname.startsWith('/forbidden/') ||
        pathname.startsWith('/maintenance/') ||
        pathname.startsWith('/terms') ||
        pathname.startsWith('/privacy') ||
        pathname.startsWith('/help') ||
        pathname.startsWith('/api/') ||
        additionalPublicPaths.includes(pathname);

    if (isPublicPath) {
        return NextResponse.next();
    }

    const authToken = request.cookies.get('rovify-auth-token');

    if (!authToken) {
        const loginUrl = new URL('/auth/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};