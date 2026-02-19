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
    <section className="flex flex-col gap-10 mb-15 items-center justify-center bg-linear-to-r from-[#eccfff]/50 to-[#fff0cd]/50">
      <div className="flex flex-col items-center justify-center mt-12 text-center gap-5">
        <p className="text-2xl lg:text-3xl font-bold leading-[1.15] lg:text-balance justify-center items-center">
          Connect with OnDuty
        </p>
        <p className="md:text-lg lg:mt-2 xl:mt-2 text-(--color-gray) lg:text-balance">
          Have questions about OnDuty? We’re here to help.
        </p>
      </div>

      <div
        onClick={handleFlip}
        className="flip-card relative w-[90%] max-w-md h-100 rounded-3xl cursor-pointer"
      >
        <motion.div
          className="flip-card-inner relative w-full h-full"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          <div className="flip-card-front absolute inset-0 bg-amber-500 text-white p-6 rounded-2xl flex flex-col">
            <p>Hello</p>
            <p>How are you</p>
          </div>

          <div className="flip-card-back absolute inset-0 bg-white/30 border border-white p-6 rounded-2xl flex flex-col gap-5">
            <p className="font-bold text-xl">Contact Information</p>

            <div className="flex flex-col gap-5">
              <div className="flex gap-5 items-center">
                <MdCall className="p-2 rounded-full bg-[#fff0cd]" size={42} />
                <div>
                  <p className="text-gray-500">Number</p>
                  <p className="font-medium">+91 999 999 9999</p>
                </div>
              </div>

              <div className="flex gap-5 items-center">
                <TbMailFilled
                  className="p-2 rounded-full bg-[#fff0cd]"
                  size={42}
                />
                <div>
                  <p className="text-gray-500">Mail</p>
                  <p className="font-medium">onduty@gmail.com</p>
                </div>
              </div>

              <div className="flex gap-5 items-center">
                <MdLocationOn
                  className="p-2 rounded-full bg-[#fff0cd]"
                  size={42}
                />
                <div>
                  <p className="text-gray-500">Office</p>
                  <p className="font-medium">Siddipet IT Tower, 2nd floor</p>
                </div>
              </div>
            </div>

            <p className="font-bold text-xl">Working Hours</p>
            <div className="flex gap-5 items-center">
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
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
