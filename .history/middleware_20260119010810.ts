// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  const pathname = req.nextUrl.pathname;

  // 🔐 Auth routes only
  const isAuthRoute = pathname.startsWith("/authentication");

  // 📱 Real mobile devices (UA-based)
  const isMobile = /Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile/i.test(
    ua,
  );

  // 🖥️ Smart displays & TVs (treated as desktop)
  const isSmartDisplay = /Nest Hub|Google Home|CrKey|SmartTV|TV/i.test(ua);

  /**
   * ❌ Block auth pages on MOBILE ONLY
   * ✅ Allow smart displays, laptops, desktops
   */
  if (isAuthRoute && isMobile && !isSmartDisplay) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/authentication/:path*"],
};
