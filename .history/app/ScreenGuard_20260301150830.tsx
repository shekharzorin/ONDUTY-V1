"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ScreenGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      const isSmallScreen = window.matchMedia("(max-width: 1023px)").matches;

      if (isSmallScreen) {
        setLoading(true);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }
  return <>{children}</>;
}
