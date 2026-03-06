"use client";

import Image from "next/image";
import Button from "../ui/Button";
import { CheckCircle2 } from "lucide-react";
import features from "@/app/images/features.png";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Features = () => {
  const [isOpenCreateAccount, setIsOpenCreateAccount] = useState(false);

  useEffect(() => {
    if (isOpenCreateAccount) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpenCreateAccount]);

  return (
    <section
      id="features"
      className="relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384"
    >
      {/* Background flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
        <div className="absolute top-0 w-[60%] h-[60%] bg-[#eccfff] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
        <div className="absolute bottom-0 w-[60%] h-[60%] bg-[#fff0cd] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between h-fit gap-5 md:gap-10 mt-40">
        <motion.div
          className="flex flex-col gap-5"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 30,
          }}
        >
          <div className="flex px-4 py-2 bg-[#f3e7ff] text-[#8c00ff] shadow-lg border border-[#f4e7ff] rounded-full items-center justify-center w-fit gap-3 opacity-75 animate-bounce">
            <div className="relative flex items-center justify-center">
              {/* Background blinking dot */}
              <span className="absolute h-3 w-3 rounded-full bg-(--color-primary) opacity-75 animate-ping" />
              {/* Foreground solid dot */}
              <span className="relative h-2.5 w-2.5 rounded-full bg-(--color-primary)" />
            </div>
            <p className="text-sm font-semibold">
              The #1 Employee Tracking App
            </p>
          </div>

          <p className="text-3xl md:text-4xl lg:text-3xl xl:text-5xl font-bold leading-[1.15] lg:text-balance justify-center items-center">
            Daily Clock-In, Track Employees & Check Visits, Reports
          </p>
          <p className="md:text-xl lg:text-lg xl:text-xl lg:mt-2 xl:mt-2 text-(--color-gray) lg:text-balance">
            The smartest way to track employee location with GPS and offline
            support. Daily attendance and visits history, report management
            client location navigation <br />
            Join <span className="font-bold"> 10,000+ </span> companies using
            OnDuty today.
          </p>

          <Button
            title="Create Account"
            onClick={() => setIsOpenCreateAccount(true)}
            className=" md:text-lg text-gray-600 rounded-full p-3 lg:mt2 xl:mt-4 bg-[#f8f1ff] hover:bg-[#fff5dc] shadow-lg border border-[#f9f1ff] w-full flex md:w-[80%] lg:w-[50%] md:mx-auto lg:mx-0"
          />

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-(--color-gray) font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-(--color-primary)" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-(--color-primary)" />
              <span>7-day free trial</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hidden md:flex flex-col gap-5"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 30,
          }}
        >
          <Image
            src={features}
            alt="mobile"
            height={400}
            width={400}
            className="lg:w-3xl xl:w-4xl flex shadow-2xl rounded-3xl"
          />
        </motion.div>
      </div>

      {isOpenCreateAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="w-[90%] max-w-md bg-white/30 backdrop-blur-[4px] rounded-3xl shadow-2xl p-6"
          >
            <h2 className="text-2xl font-bold mb-3">Create Account</h2>

            <p className="text-gray-600 mb-5">
              Start your 7-day free trial. No credit card required.
            </p>

            <Button
              title="Close"
              onClick={() => setIsOpenCreateAccount(false)}
              className="w-full rounded-full"
            />
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Features;
