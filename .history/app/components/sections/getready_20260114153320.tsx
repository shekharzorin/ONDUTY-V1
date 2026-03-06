"use client";

import Button from "../ui/Button";
import { ArrowRight, Phone } from "lucide-react";
import { useState } from "react";
import ContactModal from "@/app/components/models/contact";
import { motion } from "framer-motion";
import { MdCall } from "react-icons/md";

const Getready = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const openContactModal = () => {
    setIsContactOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeContactModal = () => {
    setIsContactOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <section
      id="getready"
      className="relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 w-full"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
        className="flex flex-col bg-[#ffc1e4]/20 bg-linear-to-r backdrop-blur-sm shadow-lg border border-white rounded-4xl w-full px-5 md:px-40 xl:px-60 py-10 md:py-20 my-5 md:my-10"
      >
        <div className="flex flex-col gap-5 items-center text-center justify-center">
          <p className="text-3xl md:text-4xl lg:text-3xl xl:text-5xl font-bold leading-[1.15] lg:text-balance justify-center items-center lg:w-[70%]">
            Get ready to manage your work with OnDuty...
          </p>
          <p className="md:text-lg text-(--color-gray)">
            Join thousands of companies tracking there employees and daily
            attendance with OnDuty. <br />
            Start your 7-day free trial now.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 lg:gap-10 mt-10 md:mt-20">
          <div className="w-full">
            <Button
              icon={<ArrowRight />}
              iconPosition="right"
              title="Book Demo"
              className="
                md:text-lg text-gray-600
                p-3 md:p-4 rounded-full w-full
                border border-gray-200
                bg-linear-to-r from-[#ffc1e4] to-[#e7c2ff]
                animate-pulse
                backdrop-blur-md
                shadow-lg
            "
              onClick={() => alert("wait")}
            />
          </div>

          <div className="w-full">
            <Button
              icon={<MdCall />}
              iconPosition="right"
              title="Contact us"
              className="
                text-lg text-gray-600
                p-3 md:p-4 rounded-full w-full
                border border-white
                hover:bg-white
                animate-pulse
                bg-white/80
                backdrop-blur-md
                shadow-lg
            "
              onClick={openContactModal}
            />
          </div>
        </div>
      </motion.div>
      <ContactModal isOpen={isContactOpen} onClose={closeContactModal} />
    </section>
  );
};

export default Getready;
