"use client";

import { motion } from "framer-motion";
import Crossicon from "../ui/Crossicon";
import { MdCall } from "react-icons/md";
import { Phone } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative w-[90%] max-w-md bg-transparent rounded-3xl shadow-2xl p-7 border border-white/50 bg-linear-to-r from-[#eccfff]/50 to-[#fff4da]/50 flex flex-col gap-10"
      >
        {/* Close */}
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

          <div className="flex">
            <Phone />
          </div>

        {/* Your form here */}
      </motion.div>
    </div>
  );
};

export default ContactModal;
