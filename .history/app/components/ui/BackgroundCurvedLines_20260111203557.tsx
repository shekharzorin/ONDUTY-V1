"use client";

import { motion } from "framer-motion";

const paths = [
  "M0 200 Q 300 100 600 200 T 1200 200",
  "M0 300 Q 400 200 800 300 T 1600 300",
  "M0 100 Q 500 0 1000 150 T 2000 150",
];

const colors = ["#fff0cd", "#eccfff"];

const random = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const BackgroundCurvedLines = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <svg
        viewBox="0 0 2000 600"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke={colors[i % colors.length]}
            strokeWidth="2"
            opacity="0.5"
            initial={{
              pathOffset: random(0, 1),
            }}
            animate={{
              pathOffset: [0, 1],
            }}
            transition={{
              duration: random(12, 20),
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default BackgroundCurvedLines;
