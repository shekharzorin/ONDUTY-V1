import React from "react";

const Bookdemo = () => {
  return (
    <section className="flex flex-col gap-10 pb-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 mx-auto items-center justify-center bg-linear-to-r from-[#eccfff]/50 to-[#fff0cd]/50 min-h-screen">
      <div className="flex flex-col items-center justify-center mt-30 text-center gap-5">
        <p className="text-2xl lg:text-3xl font-bold leading-[1.15] lg:text-balance justify-center items-center">
          Connect with OnDuty
        </p>
        <p className="md:text-lg text-(--color-gray)">
          Have questions about OnDuty? We’re here to help.
        </p>
      </div>

      <div className="backdrop-blur-md border border-white bg-white/30 shadow-lg rounded-3xl flex flex-col items-center justify-center p-5 w-full md:w-fit">
        Hello
      </div>
    </section>
  );
};

export default Bookdemo;
