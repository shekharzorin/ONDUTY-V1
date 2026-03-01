// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  const pathname = req.nextUrl.pathname;

  const isAuthRoute = pathname.startsWith("/authentication");

  // 🔹 Detect smart displays / large devices
  const isSmartDisplay = /Nest Hub|Google Home|CrKey|SmartTV|TV/i.test(ua);

  // 🔹 Detect real mobile devices ONLY
  const isMobile = /iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile/i.test(ua);


  // ❌ Block auth pages ONLY on real mobile devices
  if (isAuthRoute && isMobile && !isSmartDisplay) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/authentication/:path*"],
};
