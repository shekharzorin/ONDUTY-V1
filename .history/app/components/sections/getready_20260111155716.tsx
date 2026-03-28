"use client";

import { motion } from "framer-motion";
import Button from "../ui/Button";

const Getready = () => {
  return (
    <section
      id="getready"
      className="relative overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 w-full"
    >
      <div className="flex flex-col bg-(--color-secondary) rounded-4xl w-full px-5 md:px-40 xl:px-60 py-20 lg:py-30">
        <motion.div
          className="flex flex-col gap-5 items-center text-center justify-center"
          initial={{ opacity: 0, scale: 1.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
        >
          <p className="text-3xl md:text-4xl lg:text-3xl xl:text-5xl font-bold leading-[1.15] lg:text-balance justify-center items-center lg:w-[70%]">
            Ready to manage your work with OnDuty...
          </p>
          <p className="md:text-lg text-(--color-gray)">
            Join thousands of companies tracking there employees and attendance
            with OnDuty. Start your 7-day free trial today.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-5 mt-20">
          {/* Background flare */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
            <div className="absolute bottom-0 w-[60%] h-[60%] bg-[#eccfff] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
            <div className="absolute top-0 w-[60%] h-[60%] bg-[#fff4da] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
          </div>
          <Button
            title="Hello"
            className="p-3 lg:p-4 rounded-full lg:w-[50%] bg-white/30 backdrop-blur-md"
          />
          <Button
            title="Chello"
            className="p-3 lg:p-4 rounded-full lg:w-[50%] bg-white/30 backdrop-blur-md"
          />
        </div>
      </div>
    </section>
  );
};

export default Getready;
