"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsClockFill } from "react-icons/bs";
import { MdCall, MdLocationOn } from "react-icons/md";
import { TbMailFilled } from "react-icons/tb";
import Logo from "@/app/images/od_logo.png";

const Contact = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipped(true);
      setIsAnimating(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="flex flex-col gap-10 pb-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 mx-auto w-full items-center justify-center bg-linear-to-r from-[#eccfff]/50 to-[#fff0cd]/50 min-h-screen">
      <div className="flex flex-col items-center justify-center mt-30 text-center gap-5">
        <p className="text-2xl lg:text-3xl font-bold leading-[1.15] lg:text-balance justify-center items-center">
          Connect with OnDuty
        </p>
        <p className="md:text-lg text-(--color-gray)">
          Have questions about OnDuty? We’re here to help.
        </p>
      </div>

      <div className="flip-card relative w-full max-w-md h-140 md:h-150 rounded-3xl md:text-lg">
        <motion.div
          className="flip-card-inner relative w-full h-full"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: isFlipped ? 180 : 360 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          {/* First card before flip */}
          <div className="flip-card-front absolute inset-0 backdrop-blur-md border border-white bg-white/30 shadow-lg rounded-3xl p-5 flex flex-col items-center justify-center">
            <div className="absolute flex h-7 w-[60%] left-0 top-[15%] bg-[#fff0cd]/50 rounded-r-full" />
            <div className="absolute flex h-7 w-[50%] left-0 top-[22%] bg-[#fff0cd]/35 rounded-r-full" />
            <div className="absolute flex h-7 w-[40%] left-0 top-[29%] bg-[#fff0cd]/25 rounded-r-full" />
            <div className="flex flex-col gap-1 w-full items-center justify-center">
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
              <p className="text-(--color-gray) text-center">
                Official OnDuty contact details
              </p>
            </div>
            <div className="absolute flex h-7 w-[40%] right-0 bottom-[29%] bg-[#eccfff]/25 rounded-l-full" />
            <div className="absolute flex h-7 w-[50%] right-0 bottom-[22%] bg-[#eccfff]/35 rounded-l-full" />
            <div className="absolute flex h-7 w-[60%] right-0 bottom-[15%] bg-[#eccfff]/50 rounded-l-full" />
          </div>

          {/* Second card after flip */}
          <div className="flip-card-back absolute inset-0 backdrop-blur-md border border-white bg-white/30 shadow-lg rounded-3xl p-5 md:p-5 flex flex-col gap-10 justify-center">
            <div className="flex flex-col gap-1 w-full items-center justify-center">
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
              <p className="text-(--color-gray) text-center">
                Official OnDuty contact details
              </p>
            </div>

            <div className="flex flex-col gap-50">
              <p className="font-bold text-xl">Contact Information</p>

              <div className="flex flex-col gap-5 text-(--color-gray)">
                <div className="flex gap-5 items-center">
                  <MdCall
                    className="p-2 rounded-full bg-[#fff0cd]/50 border border-white"
                    size={42}
                  />
                  <div>
                    <p className="text-(--color-gray)">Number</p>
                    <p className="font-medium text-black">+91 999 999 9999</p>
                  </div>
                </div>

                <div className="flex gap-5 items-center">
                  <TbMailFilled
                    className="p-2 rounded-full bg-[#fff0cd]/50 border border-white"
                    size={42}
                  />
                  <div>
                    <p className="text-(--color-gray)">Mail</p>
                    <p className="font-medium text-black">onduty@gmail.com</p>
                  </div>
                </div>

                <div className="flex gap-5 items-center">
                  <MdLocationOn
                    className="p-2 rounded-full bg-[#fff0cd]/50 border border-white"
                    size={42}
                  />
                  <div>
                    <p className="text-(--color-gray)">Office</p>
                    <p className="font-medium text-black">
                      Siddipet IT Tower, 2nd floor
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-5">
              <p className="font-bold text-xl">Working Hours</p>
              <div className="flex gap-5 items-center text-(--color-gray)">
                <BsClockFill
                  className="p-2.5 rounded-full bg-[#fff0cd]/50 border border-white"
                  size={42}
                />
                <div>
                  <p className="font-medium text-black">
                    Monday - Friday : 10AM - 5PM
                  </p>
                  <p className="text-(--color-gray)">Weekend : Closed</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
