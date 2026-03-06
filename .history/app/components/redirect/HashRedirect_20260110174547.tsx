"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function HashRedirect() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/" && !window.location.hash) {
      window.location.replace("/#features");
    }
  }, [pathname]);

  return null;
}
