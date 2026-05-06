import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/register"];
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtected = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    const isAuthRoute = authRoutes.some(route =>
        pathname.startsWith(route)
    );

    if (!isProtected && !isAuthRoute) {
        return NextResponse.next();
    }

    const hasSession = await hasValidSession(request);

    if (isProtected && !hasSession) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        clearAuthCookies(response);
        return response;
    }

    if (isAuthRoute && hasSession) {
        return NextResponse.redirect(
            new URL("/dashboard/my-courses", request.url)
        );
    }

    return NextResponse.next();
}

async function hasValidSession(request: NextRequest) {
    const cookie = request.headers.get("cookie");
    if (!cookie) return false;

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { cookie },
            cache: "no-store",
        });

        return response.ok;
    } catch {
        return false;
    }
}

function clearAuthCookies(response: NextResponse) {
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    response.cookies.delete("csrfToken");
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
