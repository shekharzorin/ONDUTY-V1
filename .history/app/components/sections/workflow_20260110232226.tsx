"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const workflowItems = [
  {
    id: 1,
    title: "Smart Attendance 1",
    subtitle: "Eliminate time theft with facial verification",
    description:
      "Allow employees to clock in with a selfie. Our facial recognition technology verifies identity instantly, preventing buddy punching.",
    image: "/images/clay_attendance.png",
    layout: "start",
  },
  {
    id: 2,
    title: "Employee Tracking 2",
    subtitle: "Monitor your field staff's real-time location",
    description:
      "Know exactly where your team is during work hours and ensure they are at the right client site with our advanced GPS tracking system.",
    image: "/images/clay_attendance.png",
    layout: "end",
  },
  {
    id: 3,
    title: "Detailed reporting & analytics 3",
    subtitle: "Transform time tracking data into actionable insights",
    description:
      "Gain valuable insights into employee productivity, project efficiency, and resource allocation. Make informed decisions based on real-time data, not just guesswork.",
    image: "/images/clay_attendance.png",
    layout: "start",
  },
  {
    id: 4,
    title: "Offline Sync 4",
    subtitle: "Seamless data synchronization, anywhere",
    description:
      "No internet? No problem. The app works perfectly offline and automatically syncs all data when the connection is restored.",
    image: "/images/clay_attendance.png",
    layout: "end",
  },
];

const Workflow = () => {
  return (
    <section
      id="workflow"
      className="relative overflow-hidden mt-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384"
    >
      {/* Background flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
        <div className="absolute bottom-0 w-[60%] h-[60%] bg-[#eccfff] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
        <div className="absolute top-0 w-[60%] h-[60%] bg-[#fff4da] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
      </div>

      <div className="flex gap-20 flex-col w-full mt-20 pb-20">
        {/* Heading */}
        <motion.div
          className="flex flex-col gap-5 items-center text-center justify-center"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }} // 🔁 animate every scroll
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
        >
          <p className="text-3xl md:text-4xl lg:text-3xl xl:text-5xl font-bold leading-[1.15] lg:w-[70%]">
            Everything you need to manage your employees workflow
          </p>
          <p className="md:text-lg text-(--color-gray)">
            Powerful features designed to streamline your employees operations
            and boost productivity.
          </p>
        </motion.div>

        {/* Workflow items */}
        <div className="space-y-32">
          {workflowItems.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    height={300}
                    width={300}
                    className="relative md:w-sm lg:w-md xl:w-lg transform transition-transform duration-700 hover:scale-105"
                  />

              <div className="flex-1 space-y-6">
                <h3 className="text-4xl font-bold text-gray-900 leading-tight">
                  {feature.title}
                </h3>
                {/* <p className="text-xl font-bold text-gray-900">
                  {feature.subheadline}
                </p> */}
                <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
                  {feature.description}
                </p>

                {/* <div className="pt-4">
                  <button className="group flex items-center gap-2 text-brand-600 font-semibold text-lg hover:text-brand-700 transition-colors">
                    {feature.button}
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Workflow;
