"use client";

import { motion } from "framer-motion";
import Button from "../ui/Button";
import { ArrowRight, Phone } from "lucide-react";
import { FcCallTransfer } from "react-icons/fc";

const Getready = () => {
  return (
    <section
      id="getready"
      className=" px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 w-full "
    >
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
        className="flex flex-col bg-[#eccfff]/30 backdrop-blur-md shadow-2xl border border-white rounded-4xl w-full px-5 md:px-40 xl:px-60 py-20"
      >
        <div className="flex flex-col gap-5 items-center text-center justify-center">
          <p className="text-3xl md:text-4xl lg:text-3xl xl:text-5xl font-bold leading-[1.15] lg:text-balance justify-center items-center lg:w-[70%]">
            Ready to manage your work with OnDuty...
          </p>
          <p className="md:text-lg text-(--color-gray)">
            Join thousands of companies tracking there employees and daily
            attendance with OnDuty. Start your 7-day free trial now.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 lg:gap-10 mt-10 md:mt-20">
          <div className="w-full">
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
          </div>

          <div className="w-full">
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
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Getready;
