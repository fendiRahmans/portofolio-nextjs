
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "./lib/auth";

export async function middleware(request: NextRequest) {
  // 1. Check if route is protected
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // 2. Allow access to login page
    if (request.nextUrl.pathname === "/admin/login") {
      // Optional: If already logged in, redirect to dashboard
      const session = await verifySession();
      if (session) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // 3. Verify session for other admin routes
    const session = await verifySession();
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
