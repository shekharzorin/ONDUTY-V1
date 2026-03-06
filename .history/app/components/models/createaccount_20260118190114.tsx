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
import { registerUser, sendOtp } from "@/app/backend-api/api";

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

  /* ---------------------- SEND OTP ---------------------- */
  const handleSendOtp = async () => {
    if (!form.email) {
      alert("❌ Please enter your email");
      return;
    }
    try {
      setOtpLoading(true);
      const res = await sendOtp(form.email);
      if (res.success) {
        setOtpSent(true);
        alert("✅ OTP Sent: " + res.message);
      } else {
        alert("❌ " + (res.message || "Failed to send OTP"));
      }
    } catch (error: any) {
      alert("❌ " + error.message);
    } finally {
      setOtpLoading(false);
    }
  };

  /* ---------------------- REGISTER ---------------------- */
  const handleRegister = async () => {
    const { name, email, password, otp } = form;
    if (!name || !email || !password || !otp) {
      alert("❌ All fields are required");
      return;
    }
    const normalizedPassword = password.trim();
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#&*.])[A-Za-z\d@#&*.]{6,}$/;
    if (!strongPasswordRegex.test(normalizedPassword)) {
      alert(
        "❌ Weak Password\nPassword must be at least 6 characters and include:\n- Uppercase letters\n- Lowercase letters\n- Numbers\n- Special characters (@ # & * .)",
      );
      return;
    }
    try {
      setLoading(true);
      const res = await registerUser(
        name.trim(),
        email.trim(),
        normalizedPassword,
        otp.trim(),
      );
      if (res.success) {
        alert("✅ Registration successful!");
        onClose();
      } else {
        alert("❌ " + (res.message || "Unable to register"));
      }
    } catch (error: any) {
      alert("❌ " + error.message);
    } finally {
      setLoading(false);
    }
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

          <div className="flex flex-col md:flex-row gap-3 w-full items-center justify-center">
            <Inputbox
              icon={<IoShieldCheckmark size={26} />}
              value={form.otp}
              onChange={(v) => handleChange("otp", v)}
              placeholder="Enter OTP"
              type="number"
              className="rounded-xl bg-white/20 font-semibold md:text-lg text-black w-full"
            />
            <Button
              title={otpLoading ? "Please wait..." : "Get OTP"}
              onClick={handleSendOtp}
              disabled={otpLoading}
              className="w-[50%] border shadow-lg border-white p-3 rounded-full bg-[#fff0cd]/50 text-black hover:bg-[#eccfff]"
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
          onClick={handleRegister}
          className="border shadow-lg border-white p-3 w-full rounded-full bg-[#fff0cd]/50 text-black hover:bg-[#eccfff]"
        />
      </motion.div>
    </div>
  );
};

export default Createaccount;
