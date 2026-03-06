"use client";

import { FaUser } from "react-icons/fa";
import { TbMailFilled } from "react-icons/tb";
import Inputbox from "../ui/Inputbox";
import { useState } from "react";
import { MdEdit } from "react-icons/md";
import Button from "../ui/Button";
import { motion } from "framer-motion";

const Bookdemo = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    console.log(form);
  };

  return (
    <section className="flex flex-col gap-10 pb-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 mx-auto items-center justify-center w-full">
      {/* Background flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
        <div className="absolute top-0 w-[60%] h-[60%] bg-[#eccfff] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
        <div className="absolute bottom-0 w-[60%] h-[60%] bg-[#fff0cd] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
      </div>

      <div className="flex flex-col items-center justify-center mt-30 text-center gap-5">
        <p className="text-2xl lg:text-3xl font-bold leading-[1.15] lg:text-balance justify-center items-center">
          Book a Demo
        </p>
        <p className="md:text-lg text-(--color-gray)">
          See how OnDuty works for your team.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="backdrop-blur-md border border-white bg-white/30 shadow-lg rounded-3xl p-7 flex flex-col gap-10 justify-center w-full max-w-md"
      >
        <p className="font-bold text-xl">Request a Demo</p>

        <form
          className="flex flex-col w-full h-full px-3 gap-3 items-center"
          onSubmit={(e) => e.preventDefault()}
        >
          <Inputbox
            icon={<FaUser size={22} />}
            value={form.name}
            onChange={(v) => handleChange("name", v)}
            placeholder="Enter your name"
            className="rounded-xl bg-black/1 font-semibold md:text-lg text-black"
          />
          <Inputbox
            icon={<TbMailFilled size={26} />}
            type="email"
            value={form.email}
            onChange={(v) => handleChange("email", v)}
            placeholder="Enter your Email"
            className="rounded-xl bg-black/1 font-semibold md:text-lg text-black"
          />

          <div className="flex w-full p-4 bg-black/2 rounded-xl gap-2 text-(--color-gray)">
            <MdEdit size={28} />
            <textarea
              placeholder="Tell us about your organization"
              rows={6}
              className="w-full font-semibold md:text-lg text-black outline-none resize-none"
              value={form.message}
              onChange={(v) => handleChange("message", v.target.value)}
            />
          </div>
        </form>

        <Button
          title="Submit Demo Request"
          onClick={() => {}}
          className="
            border border-white p-3 w-full rounded-full
            bg-linear-to-r from-[#ffc1e4] to-[#e7c2ff] 
            hover:animate-pulse text-black/70"
        />
      </motion.div>
    </section>
  );
};

export default Bookdemo;
