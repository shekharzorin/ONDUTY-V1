"use client";

import Image from "next/image";
import Button from "../ui/Button";
import { CheckCircle2, Mail, MailCheck } from "lucide-react";
import features from "@/app/images/features.png";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Crossicon from "../ui/Crossicon";
import Inputbox from "../ui/Inputbox";
import { BsMailbox } from "react-icons/bs";
import { MdLock, MdMail, MdShield, MdShieldMoon } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaShield } from "react-icons/fa6";
import { TbMailFilled } from "react-icons/tb";
import { IoShieldCheckmark } from "react-icons/io5";

const Features = () => {
  const [isOpenCreateAccount, setIsOpenCreateAccount] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    otp: "",
    password: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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
            className="border border-white p-3 w-full rounded-full bg-[#fff0cd] text-black hover:bg-[#eccfff]/60 md:text-lg lg:mt2 xl:mt-4 shadow-lg flex md:w-[80%] lg:w-[50%] md:mx-auto lg:mx-0"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="relative w-[90%] max-w-md bg-transparent rounded-3xl shadow-2xl p-5 border border-white/50 bg-linear-to-r from-[#eccfff]/60 to-[#fff4da]/60 flex flex-col gap-10"
          >
            {/* Close Button */}
            <div
              onClick={() => setIsOpenCreateAccount(false)}
              className="absolute top-4 right-4"
            >
              <Crossicon onClick={() => setIsOpenCreateAccount(false)} />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-2xl lg:text-3xl font-bold">Create Account</p>
              <p className="md:text-lg text-(--color-gray)">
                Welcome to OnDuty register page. <br />
                Create account to manage your employees.
              </p>
            </div>

            <form
              className="flex flex-col w-full h-full px-3 gap-3 md:gap-15 items-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <Inputbox
                icon={<FaUser size={28} />}
                value={form.name}
                onChange={(v) => handleChange("name", v)}
                placeholder="Enter your name"
                className="rounded-xl bg-white/20"
              />
              <Inputbox
                icon={<TbMailFilled size={28} />}
                type="email"
                value={form.email}
                onChange={(v) => handleChange("email", v)}
                placeholder="Email"
                className="rounded-xl bg-white/20 w-[60%]"
              />

              <Inputbox
                icon={<IoShieldCheckmark size={28} />}
                value={form.otp}
                onChange={(v) => handleChange("otp", v)}
                placeholder="Enter OTP"
                type="text"
                inputMode="numeric"
                maxLength={6}
                pattern="[0-9]*"
                className="rounded-xl bg-white/20 w-[40%]"
              />

              <Inputbox
                icon={<MdLock size={28} />}
                type="password"
                value={form.password}
                onChange={(v) => handleChange("password", v)}
                placeholder="Create password"
                className="rounded-xl bg-white/20 w-[40%]"
              />
            </form>

            <Button
              title="Close"
              onClick={() => setIsOpenCreateAccount(false)}
              className="border shadow-lg border-white p-3 w-full rounded-full bg-[#fff0cd]/50 text-black hover:bg-[#eccfff]"
            />
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Features;
