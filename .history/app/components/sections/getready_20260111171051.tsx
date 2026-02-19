"use client";

import { motion } from "framer-motion";
import Button from "../ui/Button";
import { ArrowRight, Phone } from "lucide-react";
import { FcCallTransfer } from "react-icons/fc";

const Getready = () => {
  return (
    <section
      id="getready"
      className=" relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 w-full "
    >
      {/* Background flare */}
      {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10 bg-fuchsia-800">
        <div className="absolute bottom-0 w-[60%] h-[60%] bg-[#eccfff] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
        <div className="absolute top-0 w-[60%] h-[60%] bg-[#fff4da] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
      </div> */}

      {/* Background flares */}
      {/* <div className="absolute inset-99 -z-10 pointer-events-none">
        <div className="absolute bottom-0 -left-40 w-[60%] h-[60%] bg-[#eccfff] rounded-full blur-3xl opacity-70" />
        <div className="absolute top-0 -right-40 w-[60%] h-[60%] bg-[#fff4da] rounded-full blur-3xl opacity-70" />
      </div> */}

      <div className="flex flex-col bg-[#eccfff]/40 backdrop-blur-md shadow-2xl border border-white rounded-4xl w-full px-5 md:px-40 xl:px-60 py-20">
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
            Join thousands of companies tracking there employees and daily
            attendance with OnDuty. Start your 7-day free trial now.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-5 lg:gap-10 mt-10 md:mt-20">
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <Button
              icon={<ArrowRight />}
              iconPosition="right"
              title="Get Start with OnDuty"
              className="
                md:text-lg text-gray-600
                p-3 md:p-4 rounded-full w-full
                bg-linear-to-r from-[#ffc1e4] to-[#e7c2ff]
                hover:animate-pulse
                backdrop-blur-md
                shadow-lg
            "
            />
          </motion.div>

          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <Button
              icon={<Phone />}
              iconPosition="right"
              title="Contact us"
              className="
                text-lg text-gray-600
                p-3 md:p-4 rounded-full w-full
                border border-white
                hover:bg-white
                hover:animate-pulse
                bg-white/30
                backdrop-blur-md
                shadow-lg
            "
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Getready;
