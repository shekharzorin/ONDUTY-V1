import React from "react";

const page = () => {
  return (
    <div className="flex flex-col h-screen w-full p-5 gap-5">
      {/* HEADER */}
      <div className="flex flex-col">
        <div className="flex w-full sm:text-center sm:justify-center md:text-left">
          <h1 className="text-xl md:text-2xl font-semibold text-(--color-primary)">
            Settings
          </h1>
        </div>
      </div>
    </div>
  );
};

export default page;
