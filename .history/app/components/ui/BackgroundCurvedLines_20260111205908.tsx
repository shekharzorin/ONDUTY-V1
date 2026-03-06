<svg
  viewBox="0 0 1200 500"
  className="w-full h-full"
  preserveAspectRatio="none"
>
  <defs>
    {/* STRONG blur for liquid glow */}
    <filter id="liquidBlur">
      <feGaussianBlur stdDeviation="30" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    {/* Extra soft spread */}
    <filter id="liquidBlurSoft">
      <feGaussianBlur stdDeviation="60" />
    </filter>

    {/* Gradient */}
    <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#eccfff" />
      <stop offset="50%" stopColor="#fff0cd" />
      <stop offset="100%" stopColor="#eccfff" />
    </linearGradient>
  </defs>

  {/* BIG blurred base (defines liquid body) */}
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

  {/* Mid liquid layer */}
  <motion.path
    d={paths[1]}
    fill="none"
    stroke="url(#liquidGradient)"
    strokeWidth="80"
    opacity="0.55"
    filter="url(#liquidBlur)"
    animate={{
      d: paths,
      strokeWidth: [60, 110, 60], // thin → thick → thin
    }}
    transition={{
      d: { duration: 12, repeat: Infinity, ease: "easeInOut" },
      strokeWidth: { duration: 8, repeat: Infinity, ease: "easeInOut" },
    }}
  />

  {/* Bright center glow */}
  <motion.path
    d={paths[2]}
    fill="none"
    stroke="#ffffff"
    strokeWidth="25"
    opacity="0.5"
    filter="url(#liquidBlur)"
    animate={{ d: paths }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
</svg>
