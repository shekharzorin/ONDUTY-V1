"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Attendence from "@/public/images/clay_attendance.png";
import Track from "@/public/images/clay_tracking.png";
import Report from "@/public/images/clay_reports.png";
import Sync from "../../../public/images/clay_sync.png"


const workflowItems = [
  {
    id: 1,
    title: "Smart Attendance",
    subtitle: "Eliminate time theft with facial verification",
    description:
      "Allow employees to clock in with a selfie. Our facial recognition technology verifies identity instantly, preventing buddy punching.",
    image: Attendence,
    layout: "start",
  },
  {
    id: 2,
    title: "Employee Tracking",
    subtitle: "Monitor your field staff's real-time location",
    description:
      "Know exactly where your team is during work hours and ensure they are at the right client site with our advanced GPS tracking system.",
    image: Track,
    layout: "end",
  },
  {
    id: 3,
    title: "Detailed reporting & analytics",
    subtitle: "Transform time tracking data into actionable insights",
    description:
      "Gain valuable insights into employee productivity, project efficiency, and resource allocation. Make informed decisions based on real-time data, not just guesswork.",
    image: Report,
    layout: "start",
  },
  {
    id: 4,
    title: "Offline Sync",
    subtitle: "Seamless data synchronization, anywhere",
    description:
      "No internet? No problem. The app works perfectly offline and automatically syncs all data when the connection is restored.",
    image: Sync,
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
        <div className="flex flex-col gap-20 w-full">
          {workflowItems.map((item) => {
            const isStart = item.layout === "start";

            return (
              <div
                key={item.id}
                className={`flex flex-col items-center justify-center gap-5 lg:gap-20
                  ${isStart ? "lg:justify-start" : "lg:justify-end"}
                  lg:flex-row`}
              >
                {/* Mobile / left image */}
                {(!isStart || isStart) && (
                  <motion.div
                    className={`flex items-center justify-center ${
                      !isStart ? "lg:hidden" : ""
                    }`}
                    initial={{ opacity: 0, x: isStart ? 100 : -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  >
                    {/* <Image
                      src={item.image}
                      alt={item.title}
                      className={`w-[80%] ${
                        isStart ? "lg:w-2xl" : ""
                      } shadow-2xl rounded-3xl transform transition-transform duration-700 hover:scale-105`}
                    /> */}

                    <img
                      src={item.image}
                      alt={item.title}
                      className="relative w-full h-auto transform transition-transform duration-700 hover:scale-105"
                    />
                  </motion.div>
                )}

                {/* Text */}
                <motion.div
                  className="text-center lg:text-start flex flex-col gap-2 md:gap-5"
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                  <p className="text-2xl md:text-3xl font-bold">{item.title}</p>
                  <p className="text-xl md:text-2xl font-semibold">
                    {item.subtitle}
                  </p>
                  <p className="text-(--color-gray) lg:text-lg">
                    {item.description}
                  </p>
                </motion.div>

                {/* Desktop right image */}
                {!isStart && (
                  <motion.div
                    className="hidden lg:flex"
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  >
                    {/* <Image
                      src={item.image}
                      alt={item.title}
                      className="lg:w-2xl shadow-2xl rounded-3xl transform transition-transform duration-700 hover:scale-105"
                    /> */}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Workflow;
