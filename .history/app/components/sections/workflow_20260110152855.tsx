"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Attendence from "@/app/images/clay_attendance.png";
import Track from "@/app/images/clay_tracking.png";
import Report from "@/app/images/clay_reports.png";
import Sync from "@/app/images/clay_sync.png";

const workflow = () => {
  return (
    <section
      id="workflow"
      className="relative overflow-hidden mt-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-384"
    >
      {/* Background flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
        <div className="absolute bottom-0 w-[60%] h-[60%] bg-[#eccfff] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
        <div className="absolute top-0 w-[60%] h-[60%] bg-[#fff4da] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
      </div>

      <div className="flex gap-20 flex-col w-full">
        <motion.div
          className="flex flex-col gap-5 items-center text-center justify-center"
          initial={{ opacity: 0, y: 100 }} // ⬇️ start from bottom
          whileInView={{ opacity: 1, y: 0 }} // ⬆️ move up
          viewport={{ once: false, amount: 0.4 }} // 🔁 animate every scroll
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
        >
          <p className="text-3xl md:text-4xl lg:text-3xl xl:text-5xl font-bold leading-[1.15] lg:text-balance justify-center items-center lg:w-[70%]">
            Everything you need to manage your employees workflow
          </p>
          <p className="md:text-lg text-(--color-gray)">
            Powerful features designed to streamline your employees operations
            and boost productivity.
          </p>
        </motion.div>

        <div className="flex flex-col gap-20 w-full">
          <div className="flex flex-col items-center justify-center lg:justify-start lg:flex-row gap-5 lg:gap-20">
            <motion.div
              className=" flex items-center justify-center"
              initial={{ opacity: 0, x: 100 }} // start from right
              whileInView={{ opacity: 1, x: 0 }} // move to center
              viewport={{ once: false }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
            >
              <Image
                src={Attendence}
                alt="Image"
                className="w-[80%] lg:w-2xl flex shadow-2xl rounded-3xl relative transform transition-transform duration-700 hover:scale-105"
              />
            </motion.div>

            <motion.div
              className="text-center lg:text-start flex flex-col gap-2 md:gap-5"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
            >
              <p className="text-2xl md:text-3xl font-bold">Smart Attendance</p>
              <p className="text-xl md:text-2xl font-semibold">
                Eliminate time theft with facial verification
              </p>
              <p className="text-(--color-gray) lg:text-lg">
                Allow employees to clock in with a selfie. Our facial
                recognition technology verifies identity instantly, preventing
                buddy punching.
              </p>
            </motion.div>
          </div>

          <div className="flex flex-col items-center justify-center lg:justify-end lg:flex-row gap-5 lg:gap-20">
            <motion.div
              className=" flex items-center justify-center"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
            >
              <Image
                src={Track}
                alt="Image"
                className="w-[80%] lg:hidden flex shadow-2xl rounded-3xl relative transform transition-transform duration-700 hover:scale-105"
              />
            </motion.div>

            <motion.div
              className="text-center lg:text-start flex flex-col gap-2 md:gap-5"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
            >
              <p className="text-2xl md:text-3xl font-bold">
                Employee Tracking
              </p>
              <p className="text-xl md:text-2xl font-semibold">
                Monitor your field staff's real-time location
              </p>
              <p className="text-(--color-gray) lg:text-lg">
                Know exactly where your team is during work hours and ensure
                they are at the right client site with our advanced GPS tracking
                system.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }} // start from right
              whileInView={{ opacity: 1, x: 0 }} // move to center
              viewport={{ once: false }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
            >
              <Image
                src={Track}
                alt="Image"
                className="hidden lg:flex lg:w-3xl shadow-2xl rounded-3xl relative transform transition-transform duration-700 hover:scale-105"
              />
            </motion.div>
          </div>

          <div className="flex flex-col items-center justify-center lg:justify-start lg:flex-row gap-5 lg:gap-20">
            <motion.div
              className=" flex items-center justify-center"
              initial={{ opacity: 0, x: 100 }} // start from right
              whileInView={{ opacity: 1, x: 0 }} // move to center
              viewport={{ once: false }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
            >
              <Image
                src={Report}
                alt="Image"
                className="w-[80%] lg:w-3xl flex shadow-2xl rounded-3xl relative transform transition-transform duration-700 hover:scale-105"
                
              />
            </motion.div>

            <motion.div
              className="text-center lg:text-start flex flex-col gap-2 md:gap-5"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
            >
              <p className="text-2xl md:text-3xl font-bold">
                Detailed reporting & analytics
              </p>
              <p className="text-xl md:text-2xl font-semibold">
                Transform time tracking data into actionable insights
              </p>
              <p className="text-(--color-gray) lg:text-lg">
                Gain valuable insights into employee productivity, project
                efficiency, and resource allocation. Make informed decisions
                based on real-time data, not just guesswork.
              </p>
            </motion.div>
          </div>

          <div className="flex flex-col items-center justify-center lg:justify-end lg:flex-row gap-5 lg:gap-20">
            <motion.div
              className=" flex items-center justify-center"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
            >
              <Image
                src={Sync}
                alt="Image"
                className="w-[80%] lg:hidden flex shadow-2xl rounded-3xl relative transform transition-transform duration-700 hover:scale-105"
              />
            </motion.div>

            <motion.div
              className="text-center lg:text-start flex flex-col gap-2 md:gap-5"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
            >
              <p className="text-2xl md:text-3xl font-bold">Offline Sync</p>
              <p className="text-xl md:text-2xl font-semibold">
                Seamless data synchronization, anywhere
              </p>
              <p className="text-(--color-gray) lg:text-lg">
                No internet? No problem. The app works perfectly offline and
                automatically syncs all data when the connection is restored.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }} // start from right
              whileInView={{ opacity: 1, x: 0 }} // move to center
              viewport={{ once: false }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
            >
              <Image
                src={Sync}
                alt="Image"
                className="hidden lg:flex lg:w-2xl shadow-2xl rounded-3xl relative transform transition-transform duration-700 hover:scale-105"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default workflow;
