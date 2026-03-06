"use client";

import { motion } from "framer-motion";
import { MdCall, MdLocationOn } from "react-icons/md";
import { TbMailFilled } from "react-icons/tb";

const Contact = () => {
  return (
    <div className="relative z-10 flex justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className=" mt-300 w-full max-w-md rounded-3xl p-7 border border-white/50 bg-linear-to-r from-[#eccfff]/50 to-[#fff4da]/50 shadow-2xl flex flex-col gap-10"
      >
        <div className="flex flex-col gap-3">
          <p className="text-2xl lg:text-3xl font-bold">
            Connect with OnDuty
          </p>
          <p className="md:text-lg text-(--color-gray)">
            Have questions about OnDuty? We’re here to help.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex gap-5 items-center">
            <MdCall className="p-2 rounded-full bg-[#fff0cd]" size={42} />
            <div>
              <p className="text-(--color-gray)">Number</p>
              <p className="font-semibold">+91 999 999 9999</p>
            </div>
          </div>

          <div className="flex gap-5 items-center">
            <TbMailFilled className="p-2 rounded-full bg-[#fff0cd]" size={42} />
            <div>
              <p className="text-(--color-gray)">Mail</p>
              <p className="font-semibold">onduty@gmail.com</p>
            </div>
          </div>

          <div className="flex gap-5 items-center">
            <MdLocationOn className="p-2 rounded-full bg-[#fff0cd]" size={42} />
            <div>
              <p className="text-(--color-gray)">Office</p>
              <p className="font-semibold">
                Siddipet IT Tower, 2nd floor
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
