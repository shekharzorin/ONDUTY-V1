"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const workflowItems = [
  {
    id: 1,
    title: "Smart Attendance",
    subtitle: "Eliminate time theft with facial verification",
    description:
      "Allow employees to clock in with a selfie. Our facial recognition technology verifies identity instantly, preventing buddy punching.",
    image: "/images/clay_attendance.png",
    layout: "start",
  },
  {
    id: 2,
    title: "Employee Tracking",
    subtitle: "Monitor your field staff's real-time location",
    description:
      "Know exactly where your team is during work hours and ensure they are at the right client site with our advanced GPS tracking system.",
    image: "/images/clay_attendance.png",
    layout: "end",
  },
  {
    id: 3,
    title: "Detailed reporting & analytics",
    subtitle: "Transform time tracking data into actionable insights",
    description:
      "Gain valuable insights into employee productivity, project efficiency, and resource allocation. Make informed decisions based on real-time data, not just guesswork.",
    image: "/images/clay_attendance.png",
    layout: "start",
  },
  {
    id: 4,
    title: "Offline Sync",
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
        <div className="">
          {workflowItems.map((feature, index) => (
            
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-5 pb-20 lg:gap-24 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <motion.div
                className={`flex items-center justify-center`}
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                <Image
                  src={feature.image}
                  alt={feature.title}
                  height={300}
                  width={300}
                  className="relative rounded-3xl shadow-2xl md:w-sm xl:w-md transform transition-transform duration-700 hover:scale-105"
                />
              </motion.div>

              <div className="flex flex-col text-center lg:text-start gap-2">
                <h3 className="text-2xl md:text-3xl lg:text-2xl xl:text-3xl font-bold">
                  {feature.title}
                </h3>

                <h5 className="text-xl md:text-2xl lg:text-xl xl:text-2xl font-semibold">
                  {feature.subtitle}
                </h5>

                <p className="md:text-lg text-(--color-gray) leading-relaxed max-w-xl">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Workflow;
