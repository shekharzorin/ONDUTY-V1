"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BsClockFill, BsWatch } from "react-icons/bs";
import { MdCall, MdLocationOn, MdTimelapse } from "react-icons/md";
import { TbMailFilled } from "react-icons/tb";

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
        <div className="flip-card w-[600px] h-[360px] rounded-md" onClick={handleFlip}>
          <motion.div
          className="flip-card-inner w-[100%] h-[100%] "
          initial={false}
          animate={{rotateY: isFlipped? 180 : 360}}
          transition={{ duration:0.6, animationDirection:"normal"}}
          onAnimationComplete={()=>setIsAnimating(true)}
          >
            <div className="flip-card-front w-[100%] h-[100%] bg-cover border text-white p-4 rounded-2xl">
              <p>Hello</p>
              <p>How are you</p>
            </div>

            <div className="flip-card-back w-[100%] h-[100%] bg-cover border text-white p-4 rounded-2xl">
              <p>Hai</p>
              <p>Me good</p>
            </div>
          </motion.div>
        </div>
       </div>



    
  );
};

export default Contact;
