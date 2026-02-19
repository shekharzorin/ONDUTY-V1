"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { BsClockFill } from "react-icons/bs";
import { MdCall, MdLocationOn } from "react-icons/md";
import { TbMailFilled } from "react-icons/tb";
import Logo from "@/app/images/od_logo.png"

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
    <section className="flex flex-col gap-10 pb-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 mx-auto items-center justify-center bg-linear-to-r from-[#eccfff]/50 to-[#fff0cd]/50 h-screen">
      <div className="flex flex-col items-center justify-center mt-30 text-center gap-5">
        <p className="text-2xl lg:text-3xl font-bold leading-[1.15] lg:text-balance justify-center items-center">
          Connect with OnDuty
        </p>
        <p className="md:text-lg lg:mt-2 xl:mt-2 text-(--color-gray) lg:text-balance">
          Have questions about OnDuty? We’re here to help.
        </p>
      </div>

      <div
        onClick={handleFlip}
        className="flip-card relative w-full max-w-md h-100 rounded-3xl cursor-pointer"
      >
        <motion.div
          className="flip-card-inner relative w-full h-full"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          <div className="flip-card-front absolute inset-0 backdrop-blur-md border border-white bg-white/30 shadow-lg rounded-3xl p-5 flex flex-col items-center justify-center">
            <div className="flex flex-col gap-1 w-full lg:w-[50%]">
              <div className="flex gap-2 lg:gap-3 items-center">
                <Image
                  src={Logo}
                  alt="Onduty Logo"
                  height={60}
                  width={60}
                  className="flex h-10 w-10 md:h-12 md:w-12 lg:h-15 lg:w-15"
                />
                <h1 className="text-2xl lg:text-2xl font-bold">OnDuty</h1>
              </div>
              <p className="text-(--color-gray)">
                The smart way to manage your team's attendance and tracking.
                Simple, efficient, and reliable.
              </p>
            </div>
          </div>

          <div className="flip-card-back absolute inset-0 backdrop-blur-md border border-white bg-white/30 shadow-lg rounded-3xl p-5 flex flex-col gap-5">
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
