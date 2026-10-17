import { NextResponse } from "next/server";

export const SESSION_COOKIE_NAME = "session";

// Narrow matcher protecting private routes: /checkout, /orders, and /kitchen
export const config = {
  matcher: [
    "/checkout",
    "/checkout/:path*",
    "/orders",
    "/orders/:path*",
    "/kitchen",
    "/kitchen/:path*",
  ],
};

export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  let isAuthenticated = false;
  let userRole = null;

  if (sessionCookie) {
    try {
      const parsed = JSON.parse(sessionCookie);
      if (parsed && parsed.userId) {
        isAuthenticated = true;
        userRole = parsed.role || "customer";
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // Layer 1: Middleware redirection for unauthenticated requests on protected routes
  if (!isAuthenticated) {
    const intendedDestination = `${pathname}${search}`;
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("next", intendedDestination);
    return NextResponse.redirect(signinUrl);
  }

  // Middleware check for staff-only route /kitchen
  if (pathname.startsWith("/kitchen") && userRole !== "staff") {
    const forbiddenUrl = new URL("/signin", request.url);
    forbiddenUrl.searchParams.set("error", "staff_only");
    return NextResponse.redirect(forbiddenUrl);
  }

  return NextResponse.next();
}

export default middleware;
