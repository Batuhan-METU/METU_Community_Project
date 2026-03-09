import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Prototype auth check: treat this cookie as logged-in flag.
  const isLoggedIn = request.cookies.get("auth-token")?.value === "logged-in";

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/events/:path*", "/profile/:path*"],
};

