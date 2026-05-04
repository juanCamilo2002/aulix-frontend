import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
    const token = request.cookies.get("accessToken")?.value;
    const { pathname } = request.nextUrl;

    const isProtected = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    const isAuthRoute = authRoutes.some(route =>
        pathname.startsWith(route)
    );

    if (isProtected && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuthRoute && token) {
        return NextResponse.redirect(
            new URL("/dashboard/my-courses", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};