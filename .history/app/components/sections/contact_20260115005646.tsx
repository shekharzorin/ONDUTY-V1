"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const Contact = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  function handleFlip() {
    if (!isAnimating) {
      setIsFlipped(!isFlipped);
      setIsAnimating(true);
    }
  }

  return (
    <div className="flex items-center justify-center bg-amber-400 h-[800px]">
      <div
        className="flip-card w-[600px] h-[360px] rounded-md cursor-pointer"
        onClick={handleFlip}
      >
        <motion.div
          className="flip-card-inner w-full h-full"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          {/* FRONT */}
          <div className="flip-card-front w-full h-full bg-amber-500 text-white p-6 rounded-2xl">
            <p>Hello</p>
            <p>How are you</p>
          </div>

          {/* BACK */}
          <div className="flip-card-back w-full h-full bg-orange-600 text-white p-6 rounded-2xl">
            <p>Hai</p>
            <p>Me good</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
