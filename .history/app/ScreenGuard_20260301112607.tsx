"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ScreenGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      const isSmallScreen = window.matchMedia("(max-width: 1023px)").matches;

      if (isSmallScreen) {
        router.replace("/not-supported");
        setAllowed(false);
      } else {
        setAllowed(true);
      }
    };

    checkScreen(); // initial check
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, [router]);

  return <>{children}</>;
}