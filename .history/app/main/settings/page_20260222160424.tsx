import React from "react";

const page = () => {
  return (
    <div className="flex flex-col h-screen w-full p-5 gap-5">
      {/* HEADER */}
      <div className="flex flex-col">
        <div className="flex">
          <div className="w-full text-center md:text-left">
            <h1 className="hidden md:block text-2xl font-semibold text-(--color-primary)">
              Welcome to the Dashboard
            </h1>
            <h1 className="block md:hidden text-xl font-semibold text-(--color-primary)">
              Welcome to the Dashboard
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
