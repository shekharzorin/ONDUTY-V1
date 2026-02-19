"use client";

import { motion } from "framer-motion";

const Interface = () => {
  return (
    <section
      id="interface"
      className="relative overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 w-full"
    >
      {/* Background flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
        <div className="absolute top-0 w-[60%] h-[60%] bg-[#eccfff] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
        <div className="absolute bottom-0 w-[60%] h-[60%] bg-[#fff0cd] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
      </div>

      <div className="flex gap-20 flex-col w-full mt-20 items-center">
        <div className="flex px-4 py-2 bg-[#f3e7ff] text-[#8c00ff] shadow-lg border border-[#f4e7ff] rounded-full items-center justify-center w-fit gap-3 opacity-50 animate-pulse">
          <div className="relative flex items-center justify-center">
            {/* Background blinking dot */}
            <span className="absolute h-3 w-3 rounded-full bg-(--color-primary) opacity-75 animate-ping" />
            {/* Foreground solid dot */}
            <span className="relative h-2.5 w-2.5 rounded-full bg-(--color-primary)" />
          </div>
          <p className="text-sm font-semibold">INTERFACE</p>
        </div>
      </div>

      <div className="flex gap-20 flex-col w-full">
        <motion.div
          className="flex flex-col gap-5 items-center text-center justify-center"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
        >
          <p className="text-3xl md:text-4xl lg:text-3xl xl:text-5xl font-bold leading-[1.15] lg:text-balance justify-center items-center lg:w-[70%]">
            Everything you need to manage your employees workflow
          </p>
          <p className="md:text-lg text-(--color-gray)">
            Powerful features designed to streamline your employees operations
            and boost productivity.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Interface;
