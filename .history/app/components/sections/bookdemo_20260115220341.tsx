"use client";

import { FaUser } from "react-icons/fa";
import { TbMailFilled } from "react-icons/tb";
import Inputbox from "../ui/Inputbox";
import { useState } from "react";

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
    <section className="flex flex-col gap-10 pb-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 mx-auto items-center justify-center bg-linear-to-r from-[#eccfff]/50 to-[#fff0cd]/50 min-h-screen">
      <div className="flex flex-col items-center justify-center mt-30 text-center gap-5">
        <p className="text-2xl lg:text-3xl font-bold leading-[1.15] lg:text-balance justify-center items-center">
          Schedule a Demo
        </p>
        <p className="md:text-lg text-(--color-gray)">
          Get a personalized demo tailored to your organization.
        </p>
      </div>

      <div className="backdrop-blur-md border border-white bg-white/30 shadow-lg rounded-3xl p-7 md:p-10 flex flex-col gap-10 justify-center w-full max-w-md">
        <div className="flex flex-col gap-5">
          <p className="font-bold text-xl">Send a Request to OnDuty</p>

          <form
            className="flex flex-col w-full h-full gap-3 items-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <Inputbox
              icon={<FaUser size={22} />}
              value={form.name}
              onChange={(v) => handleChange("name", v)}
              placeholder="Enter your name"
              className="rounded-xl bg-white/50 font-semibold md:text-lg text-black"
            />
            <Inputbox
              icon={<TbMailFilled size={26} />}
              type="email"
              value={form.email}
              onChange={(v) => handleChange("email", v)}
              placeholder="Email"
              className="rounded-xl bg-white/50 font-semibold md:text-lg text-black"
            />

            <div className="flex w-full p-3 bg-white/50 rounded-xl gap-2">
              <TbMailFilled size={26} />
              <textarea
                placeholder="Message"
                rows={6}
                className="w-full font-semibold md:text-lg text-black outline-none resize-none rounded-xl"
                value={form.message}
                onChange={(v) => handleChange("message", v.target.value)}
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Bookdemo;
