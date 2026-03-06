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
    <section className="flex flex-col w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 mx-auto bg-linear-to-r from-[#eccfff]/50 to-[#fff0cd]/50">
      {/* <div className="flex flex-col gap-10 mb-15 items-center justify-center">
        <div className="flex flex-col items-center justify-center mt-30 text-center gap-5">
          <p className="text-2xl lg:text-3xl font-bold leading-[1.15] lg:text-balance justify-center items-center">
            Connect with OnDuty
          </p>
          <p className="md:text-lg lg:mt-2 xl:mt-2 text-(--color-gray) lg:text-balance">
            Have questions about OnDuty? We’re here to help.
          </p>
        </div> */}

        {/* <div className="w-full max-w-md rounded-3xl p-7 border border-white bg-white/30 shadow-lg flex flex-col gap-10">
          <div className="flex flex-col gap-10 md:text-lg">
            <div className="flex flex-col gap-5">
              <p className="font-bold text-xl">Contact Information</p>

              <div className="flex flex-col gap-5 px-3 md:px-5">
                <div className="flex gap-5 items-center">
                  <MdCall className="p-2 rounded-full bg-[#fff0cd]" size={42} />
                  <div>
                    <p className="text-(--color-gray)">Number</p>
                    <p className="font-medium">+91 999 999 9999</p>
                  </div>
                </div>

                <div className="flex gap-5 items-center">
                  <TbMailFilled
                    className="p-2.25 rounded-full bg-[#fff0cd]"
                    size={42}
                  />
                  <div>
                    <p className="text-(--color-gray)">Mail</p>
                    <p className="font-medium">onduty@gmail.com</p>
                  </div>
                </div>

                <div className="flex gap-5 items-center">
                  <MdLocationOn
                    className="p-2 rounded-full bg-[#fff0cd]"
                    size={42}
                  />
                  <div>
                    <p className="text-(--color-gray)">Office</p>
                    <p className="font-medium">Siddipet IT Tower, 2nd floor</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <p className="font-bold text-xl">Working Hours</p>

              <div className="flex gap-5 items-center px-3 md:px-5">
                <BsClockFill
                  className="p-2.5 rounded-full bg-[#fff0cd]"
                  size={42}
                />
                <div>
                  <p className="font-medium">Monday - Friday : 10AM - 5PM</p>
                  <p className="text-(--color-gray)">Weekend : Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}

       
       {/* </div> */}

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
     </section>



    
  );
};

export default Contact;
