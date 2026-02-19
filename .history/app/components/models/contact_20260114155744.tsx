"use client";

import { motion } from "framer-motion";
import Crossicon from "../ui/Crossicon";
import { MdCall } from "react-icons/md";
import { Mail, Phone } from "lucide-react";
import { TbMailFilled } from "react-icons/tb";

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
          <p className="text-2xl lg:text-3xl font-bold">Connect with OnDuty</p>
          <p className="md:text-lg text-(--color-gray)">
            — we’re here to help you.
          </p>
        </div>

        <div className="flex items-center justify-between text-center px-5">
          <div className="flex flex-col items-center gap-2">
            <MdCall size={30} className="p-1 rounded-full bg-amber-100"/>
            <p>Contact Info</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <TbMailFilled size={24} />
            <p>Mail to OnDuty</p>
          </div>
        </div>

        {/* Your form here */}
      </motion.div>
    </div>
  );
};

export default ContactModal;
