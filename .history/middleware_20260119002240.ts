// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  const pathname = req.nextUrl.pathname;

  // 🔒 Protect auth routes
  const isAuthRoute = pathname.startsWith("/authentication");

  // 📱 Detect mobile / tablet UA
  const isMobile = /Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile/i.test(
    ua,
  );

  // ❌ Block auth pages on mobile
  if (isAuthRoute && isMobile) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/authentication/:path*"],
};
