import React from "react";

const PrivacyPolicy = () => {
  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 mx-auto w-full">
      {/* Background flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
        <div className="absolute top-0 w-[60%] h-[60%] bg-[#eccfff] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
        <div className="absolute bottom-0 w-[60%] h-[60%] bg-[#fff0cd] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
      </div>
      <div>
        Hello
      </div>
    </section>
  );
};

export default PrivacyPolicy;
