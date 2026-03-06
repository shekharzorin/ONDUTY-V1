"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* Random helper */
const rand = (min: number, max: number) =>
  Math.random() * (max - min) + min;

/* Generate random curve */
const generatePath = () => `
  M -100 ${rand(180, 260)}
  C 200 ${rand(40, 120)},
    400 ${rand(40, 120)},
    600 ${rand(180, 260)}
  S 1000 ${rand(300, 380)},
    1300 ${rand(180, 260)}
`;

const BackgroundCurvedLines = () => {
  const [paths, setPaths] = useState<string[] | null>(null);

  // ✅ Run ONLY on client (after hydration)
  useEffect(() => {
    setPaths([generatePath(), generatePath(), generatePath()]);
  }, []);

  // ⛔ Prevent SSR mismatch
  if (!paths) return null;

  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      <svg
        viewBox="0 0 1200 500"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="liquidBlur">
            <feGaussianBlur stdDeviation="30" />
          </filter>

          <filter id="liquidBlurSoft">
            <feGaussianBlur stdDeviation="60" />
          </filter>

          <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#eccfff" />
            <stop offset="50%" stopColor="#fff0cd" />
            <stop offset="100%" stopColor="#eccfff" />
          </linearGradient>
        </defs>

        {/* Big blurred base */}
        <motion.path
          d={paths[0]}
          fill="none"
          stroke="url(#liquidGradient)"
          strokeWidth="120"
          opacity="0.35"
          filter="url(#liquidBlurSoft)"
          animate={{ d: paths }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Liquid body */}
        <motion.path
          d={paths[1]}
          fill="none"
          stroke="url(#liquidGradient)"
          strokeWidth="80"
          opacity="0.55"
          filter="url(#liquidBlur)"
          animate={{
            d: paths,
            strokeWidth: [60, 110, 60],
          }}
          transition={{
            d: { duration: 12, repeat: Infinity, ease: "easeInOut" },
            strokeWidth: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      </svg>
    </div>
  );
};

export default BackgroundCurvedLines;
