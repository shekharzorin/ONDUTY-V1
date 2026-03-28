"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

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
  const paths = useMemo(
    () => [generatePath(), generatePath(), generatePath()],
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      <svg
        viewBox="0 0 1200 500"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Glow */}
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradient */}
          <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#eccfff" />
            <stop offset="50%" stopColor="#fff0cd" />
            <stop offset="100%" stopColor="#ff98d2" />
          </linearGradient>
        </defs>

        {/* Outer soft glow */}
        <motion.path
          d={paths[0]}
          fill="none"
          stroke="#7cc9ff"
          strokeWidth="0"
          opacity="0.15"
          filter="url(#neonGlow)"
          animate={{ d: paths }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Liquid body (variable thickness illusion) */}
        <motion.path
          d={paths[1]}
          fill="none"
          stroke="url(#liquidGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#neonGlow)"
          animate={{
            d: paths,
            strokeWidth: [70, 100, 30], // 👈 thin → thick → thin
          }}
          transition={{
            d: {
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            },
            strokeWidth: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />

        {/* Inner bright core */}
        <motion.path
          d={paths[2]}
          fill="none"
          opacity="0.9"
          animate={{ d: paths }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
};

export default BackgroundCurvedLines;
