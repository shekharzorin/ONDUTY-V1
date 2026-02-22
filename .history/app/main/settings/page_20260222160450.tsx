import React from "react";

const page = () => {
  return (
    <div className="flex flex-col h-screen w-full p-5 gap-5">
      {/* HEADER */}
      <div className="flex flex-col">
        <div className="flex">
          <div className="w-full text-center md:text-left">
            <h1 className="text-2xl font-semibold text-(--color-primary)">
              Settings
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
