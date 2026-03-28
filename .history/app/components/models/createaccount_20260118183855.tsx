"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Crossicon from "../ui/Crossicon";
import Inputbox from "../ui/Inputbox";
import Button from "../ui/Button";
import { FaUser } from "react-icons/fa";
import { TbMailFilled } from "react-icons/tb";
import { IoShieldCheckmark } from "react-icons/io5";
import { MdLock } from "react-icons/md";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const Createaccount = ({ isOpen, onClose }: Props) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    otp: "",
    password: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      {/* Modal Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative w-[90%] max-w-md rounded-3xl shadow-2xl p-7 border border-white/50 bg-white/50 flex flex-col gap-10"
      >
        {/* Close Button */}
        <div className="absolute top-4 right-4">
          <Crossicon onClick={onClose} />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-2xl lg:text-3xl font-bold">Create Account</p>
          <p className="md:text-lg text-(--color-gray)">
            Welcome to OnDuty register page. <br />
            Create account to manage your employees.
          </p>
        </div>

        <form
          className="flex flex-col w-full h-full px-3 gap-3 items-center"
          onSubmit={(e) => e.preventDefault()}
        >
          <Inputbox
            icon={<FaUser size={22} />}
            value={form.name}
            onChange={(v) => handleChange("name", v)}
            placeholder="Enter your name"
            className="rounded-xl bg-white/20 font-semibold md:text-lg text-black"
          />
          <Inputbox
            icon={<TbMailFilled size={26} />}
            type="email"
            value={form.email}
            onChange={(v) => handleChange("email", v)}
            placeholder="Email"
            className="rounded-xl bg-white/20 font-semibold md:text-lg text-black"
          />
          <div className="flex gap-15">
            <Inputbox
              icon={<IoShieldCheckmark size={26} />}
              value={form.otp}
              onChange={(v) => handleChange("otp", v)}
              placeholder="Enter OTP"
              type="number"
              className="rounded-xl bg-white/20 font-semibold md:text-lg text-black"
            />
            <Button
              title={otpLoading ? "Please wait..." : "Get OTP"}
              onClick={()=>{}}
              disabled={otpLoading}
              className="w-fit"
            />
          </div>
          <Inputbox
            icon={<MdLock size={28} />}
            type="password"
            value={form.password}
            onChange={(v) => handleChange("password", v)}
            placeholder="Create password"
            className="rounded-xl bg-white/20 font-semibold md:text-lg text-black"
          />
        </form>

        <Button
          title="Register"
          onClick={() => alert("hello")}
          className="border shadow-lg border-white p-3 w-full rounded-full bg-[#fff0cd]/50 text-black hover:bg-[#eccfff]"
        />
      </motion.div>
    </div>
  );
};

export default Createaccount;
