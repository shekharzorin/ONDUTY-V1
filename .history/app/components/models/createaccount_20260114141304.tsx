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
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative w-[90%] max-w-md p-7 rounded-3xl bg-linear-to-r from-[#eccfff]/50 to-[#fff4da]/50 shadow-2xl"
      >
        {/* Close */}
        <div className="absolute top-4 right-4 cursor-pointer">
          <Crossicon onClick={onClose} />
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="text-(--color-gray)">
            Register to manage your employees.
          </p>
        </div>

        <form className="flex flex-col gap-4">
          <Inputbox
            icon={<FaUser />}
            placeholder="Name"
            value={form.name}
            onChange={(v) => handleChange("name", v)}
          />

          <Inputbox
            icon={<TbMailFilled />}
            placeholder="Email"
            value={form.email}
            onChange={(v) => handleChange("email", v)}
          />

          <Inputbox
            icon={<IoShieldCheckmark />}
            placeholder="OTP"
            type="number"
            value={form.otp}
            onChange={(v) => handleChange("otp", v)}
          />

          <Inputbox
            icon={<MdLock />}
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(v) => handleChange("password", v)}
          />
        </form>

        <Button
          title="Close"
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-[#fff0cd]"
        />
      </motion.div>
    </div>
  );
};

export default Createaccount;
