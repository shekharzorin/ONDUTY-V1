"use client";

import Image from "next/image";
import Button from "../ui/Button";
import { CheckCircle2 } from "lucide-react";
import features from "@/app/images/features.png";
import { motion } from "framer-motion";
import { useState } from "react";
import CreateAccount from "@/app/components/models/createaccount";

const Features = () => {
  const [isOpenCreateAccount, setIsOpenCreateAccount] = useState(false);

  return (
    <section
      id="features"
      className="relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384"
    >
      {/* Background flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
        <div className="absolute top-0 w-[60%] h-[60%] bg-[#eccfff] rounded-full blur-3xl opacity-60 mix-blend-multiply" />
        <div className="absolute bottom-0 w-[60%] h-[60%] bg-[#fff0cd] rounded-full blur-3xl opacity-60 mix-blend-multiply" />
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mt-40">
        {/* LEFT CONTENT */}
        <motion.div
          className="flex flex-col gap-5"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 30 }}
        >
          <div className="flex px-4 py-2 bg-[#f3e7ff] text-[#8c00ff] rounded-full gap-3 w-fit">
            <span className="h-2.5 w-2.5 rounded-full bg-(--color-primary)" />
            <p className="text-sm font-semibold">The #1 Employee Tracking App</p>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
            Daily Clock-In, Track Employees & Reports
          </h1>

          <p className="text-lg text-(--color-gray)">
            Track employee location, attendance, visits and reports.
            <br />
            Join <span className="font-bold">10,000+</span> companies today.
          </p>

          <Button
            title="Create Account"
            onClick={() => setIsOpenCreateAccount(true)}
            className="p-3 w-full md:w-[60%] rounded-full bg-[#fff0cd]"
          />

          <div className="flex gap-6 text-sm text-(--color-gray)">
            <div className="flex gap-2 items-center">
              <CheckCircle2 className="text-(--color-primary)" />
              No credit card required
            </div>
            <div className="flex gap-2 items-center">
              <CheckCircle2 className="text-(--color-primary)" />
              7-day free trial
            </div>
          </div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 30 }}
        >
          <Image
            src={features}
            alt="Features"
            width={400}
            height={400}
            className="rounded-3xl shadow-2xl"
          />
        </motion.div>
      </div>

      {/* MODAL */}
      <CreateAccount
        isOpen={isOpenCreateAccount}
        onClose={() => setIsOpenCreateAccount(false)}
      />
    </section>
  );
};

export default Features;
