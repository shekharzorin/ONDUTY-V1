"use client";

import { motion } from "framer-motion";
import { Smartphone, UserPlus, FileCheck } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: UserPlus,
    title: "1. Invite your team",
    description:
      "Send invites via email. Team members download the app and join instantly.",
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
  },
  {
    id: 2,
    icon: Smartphone,
    title: "2. Track attendance",
    description: "Staff clock in with GPS. You see their status in real-time.",
    initial: { opacity: 0, scale: 1.5 },
    animate: { opacity: 1, scale: 1 },
    viewport: { amount: 0.4 },
  },
  {
    id: 3,
    icon: FileCheck,
    title: "3. Export reports",
    description:
      "Get detailed time sheets and payroll-ready reports whenever you need.",
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
  },
];

const Getstart = () => {
  return (
    <section
      id="getstart"
      className="relative overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 w-full"
    >
      {/* Background flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
        <div className="absolute bottom-0 w-[60%] h-[60%] bg-[#eccfff] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
        <div className="absolute top-0 w-[60%] h-[60%] bg-[#fff4da] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
      </div>

      <div className="flex flex-col w-full py-20">
        {/* Section Heading */}
        <motion.div
          className="flex flex-col gap-5 items-center text-center justify-center"
          initial={{ opacity: 0, scale: 1.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
        >
          <p className="text-3xl md:text-4xl lg:text-3xl xl:text-5xl font-bold leading-[1.15] lg:text-balance justify-center items-center lg:w-[70%]">
            Get started in minutes
          </p>
          <p className="md:text-lg text-(--color-gray)">
            No complex setup or hardware required. Just download and go.
          </p>
        </motion.div>

        <div className="relative flex flex-col items-center justify-center lg:flex-row lg:justify-between mt-20">
          {/* Connecting Line */}
          <div className="absolute hidden lg:block left-[15.5%] right-[15.5%] top-[17%] -translate-y-1/2 h-1 bg-(--color-secondary)" />

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={step.initial}
              whileInView={step.animate}
              viewport={{ once: false, ...(step.viewport || {}) }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="relative lg:flex-col items-center flex flex-col justify-center text-center z-10 mb-20"
            >
              <div className="w-24 h-24 rounded-full bg-white border-4 border-(--color-secondary) shadow-sm flex items-center justify-center mb-8 relative group">
                <div className="absolute inset-0 rounded-full bg-(--color-secondary) transform scale-0 group-hover:scale-100 group-hover:animate-ping opacity-75 transition-transform duration-300" />
                <step.icon className="h-7 w-7 text-(--color-primary) relative z-10" />
              </div>

              <div className="flex flex-col">
                <h3 className="text-xl md:text-2xl font-bold mb-3">
                  {step.title}
                </h3>
                <p className="md:text-lg text-(--color-gray) leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Getstart;
