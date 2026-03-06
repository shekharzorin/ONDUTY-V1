"use client";

import { motion } from "framer-motion";

const NeonCurvedLine = () => {
  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      <svg
        viewBox="0 0 1200 600"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradient stroke */}
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fff0cd" />
            <stop offset="50%" stopColor="#eccfff" />
            <stop offset="100%" stopColor="#fff0cd" />
          </linearGradient>
        </defs>

        {/* Main glowing curve */}
        <motion.path
          d="M -100 200
             C 200 50, 400 50, 600 200
             S 1000 350, 1300 200"
          fill="none"
          stroke="url(#neonGradient)"
          strokeWidth="4"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 3,
            ease: "easeInOut",
          }}
        />

        {/* Secondary soft glow trail */}
        <motion.path
          d="M -100 200
             C 200 50, 400 50, 600 200
             S 1000 350, 1300 200"
          fill="none"
          stroke="#eccfff"
          strokeWidth="10"
          opacity="0.15"
          filter="url(#glow)"
          animate={{
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
};

export default NeonCurvedLine;
