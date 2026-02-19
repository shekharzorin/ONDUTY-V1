"use client";

import { motion } from "framer-motion";
import Crossicon from "../ui/Crossicon";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative w-[90%] max-w-md rounded-3xl p-6 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <div className="absolute top-4 right-4 cursor-pointer" onClick={onClose}>
          <Crossicon onClick={onClose}/>
        </div>

        <h2 className="text-2xl font-bold mb-3">Contact Us</h2>
        <p className="text-gray-600 mb-5">
          Our team will get back to you shortly.
        </p>

        {/* Your form here */}
      </motion.div>
    </div>
  );
};

export default ContactModal;
