import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, COOKIE_NAME, isAdmin } from "@/lib/jwt";

const protectedPaths = ["/cabinet", "/admin"];
const authPaths = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (session?.status === "PENDING" && pathname.startsWith("/cabinet")) {
    return NextResponse.redirect(new URL("/pending", request.url));
  }

  if (pathname.startsWith("/admin") && session && !isAdmin(session.role)) {
    return NextResponse.redirect(new URL("/cabinet", request.url));
  }

  if (isAuthPage && session?.status === "ACTIVE") {
    const dest = isAdmin(session.role) ? "/admin" : "/cabinet";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cabinet/:path*", "/admin/:path*", "/login", "/register"],
};
