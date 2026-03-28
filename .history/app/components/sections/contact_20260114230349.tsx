"use client";

import { motion } from "framer-motion";
import { MdCall, MdLocationOn } from "react-icons/md";
import { TbMailFilled } from "react-icons/tb";

const Contact = () => {
  return (
    <section className="flex flex-col w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 mx-auto bg-linear-to-r from-[#eccfff]/50 to-[#fff0cd]/50">
      <div className="flex flex-col gap-10 mb-15 items-center justify-center">
        <div className="flex flex-col items-center justify-center mt-30 text-center gap-5">
          <p className="text-2xl lg:text-3xl font-bold leading-[1.15] lg:text-balance justify-center items-center">
            Connect with OnDuty
          </p>
          <p className="md:text-lg lg:mt-2 xl:mt-2 text-(--color-gray) lg:text-balance">
            Have questions about OnDuty? We’re here to help.
          </p>
        </div>

        <div className="flex flex-wrap">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-full max-w-md rounded-3xl p- border border-white bg-white/30 shadow-lg flex flex-col gap-10"
          >
            <div className="flex flex-col gap-10 md:text-lg">
              <h5 className="text-xl md:text-2xl lg:text-xl xl:text-2xl font-semibold">
                Contact Information
              </h5>

              <div className="flex flex-col gap-5">
                <div className="flex gap-5 items-center">
                  <MdCall className="p-2 rounded-full bg-[#fff0cd]" size={42} />
                  <div>
                    <p className="text-(--color-gray)">Number</p>
                    <p className="font-semibold">+91 999 999 9999</p>
                  </div>
                </div>

                <div className="flex gap-5 items-center">
                  <TbMailFilled
                    className="p-2 rounded-full bg-[#fff0cd]"
                    size={42}
                  />
                  <div>
                    <p className="text-(--color-gray)">Mail</p>
                    <p className="font-semibold">onduty@gmail.com</p>
                  </div>
                </div>

                <div className="flex gap-5 items-center">
                  <MdLocationOn
                    className="p-2 rounded-full bg-[#fff0cd]"
                    size={42}
                  />
                  <div>
                    <p className="text-(--color-gray)">Office</p>
                    <p className="font-semibold">
                      Siddipet IT Tower, 2nd floor
                    </p>
                  </div>
                </div>
              </div>

              <h5 className="text-xl md:text-2xl lg:text-xl xl:text-2xl font-semibold">
                Working Hours
              </h5>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
