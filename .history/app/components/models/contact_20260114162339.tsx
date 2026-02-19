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
            we’re always here to help you.
          </p>
        </div>

        <div className="flex flex-col gap-5 px-3">
          <div className="flex gap-5 items-center">
            <MdCall
              size={45}
              className="p-2 rounded-full bg-[#fff0cd] text-(--color-gray) hover:scale-110 transition-all duration-300"
            />
            <div className="flex flex-col font-semibold md:text-lg">
              <p className="text-(--color-gray)">Number :</p>
              <p className="text-black">+91 999 999 9999</p>
            </div>
          </div>
          <TbMailFilled
            size={45}
            className="p-2 rounded-full bg-[#fff0cd] text-(--color-gray) hover:scale-110 transition-all duration-300"
          />
        </div>

        {/* Your form here */}
      </motion.div>
    </div>
  );
};

export default ContactModal;
