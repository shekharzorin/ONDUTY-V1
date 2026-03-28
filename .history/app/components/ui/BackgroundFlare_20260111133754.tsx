"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BackgroundFlare() {
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleChange = () => setIsLg(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // 🎯 Movement distance
  const mobileDistance = 120;
  const desktopDistance = 260; // ← MORE distance on lg+

  const axisAnimation = isLg
    ? { x: [-desktopDistance, desktopDistance, -desktopDistance] }
    : { y: [-mobileDistance, mobileDistance, -mobileDistance] };

  const reverseAxisAnimation = isLg
    ? { x: [desktopDistance, -desktopDistance, desktopDistance] }
    : { y: [mobileDistance, -mobileDistance, mobileDistance] };

  return (
    <div className="absolute inset-0 left-1/2 -translate-x-1/2 w-full max-w-7xl pointer-events-none -z-10 overflow-hidden">
      {/* Top flare */}
      <motion.div
        animate={axisAnimation}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-1/2 -translate-x-1/2
                   w-90 h-90 md:w-[20%] md:h-[20%]
                   bg-[#eccfff] rounded-full blur-3xl
                   opacity-60 mix-blend-multiply"
      />

      {/* Bottom flare */}
      <motion.div
        animate={reverseAxisAnimation}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2
                   w-90 h-90 md:w-100 md:h-100
                   bg-[#fff0cd] rounded-full blur-3xl
                   opacity-60 mix-blend-multiply"
      />
    </div>
  );
}
