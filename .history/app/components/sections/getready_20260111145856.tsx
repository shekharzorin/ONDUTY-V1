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
            Join thousands of companies tracking there employees and attendance with
            OnDuty. Start your 7-day free trial today.
          </p>
        </motion.div>

        <div>
            <Button title="Hello"/>
            <Button title="Chello"/>
        </div>
      </div>
    </section>
  );
};

export default Getready;
