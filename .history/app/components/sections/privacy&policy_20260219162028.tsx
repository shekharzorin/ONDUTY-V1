import React from "react";

const PrivacyPolicy = () => {
  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 mx-auto w-full">
      {/* Background flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
        <div className="absolute top-0 w-[60%] h-[60%] bg-[#eccfff] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
        <div className="absolute bottom-0 w-[60%] h-[60%] bg-[#fff0cd] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
      </div>

      <div className="flex flex-col items-center justify-center gap-10 mt-30 mb-15">
        <p className="text-2xl lg:text-3xl font-bold leading-[2.0] lg:text-balance text-center justify-center items-center">
          PRIVACY POLICY <br /> OnDuty Employee Tracking System
        </p>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
