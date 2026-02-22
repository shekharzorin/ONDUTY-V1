import React from "react";

const page = () => {
  return (
    <div className="flex flex-col h-screen w-full p-5 gap-5">
      {/* HEADER */}
      <div className="flex flex-col">
        <div className="flex w-full justify-center md:justify-start">
          <h1 className="text-xl md:text-2xl font-semibold text-(--color-primary)">
            Settings
          </h1>
        </div>
      </div>
      {/* CONTENT */}
      <div className="flex items-center w-full bg-(--color-sidebar) text-(--color-gray) rounded-2xl shadow-lg p-5 text-[18px] font-semibold">
        <p>Add Map Api</p>
        <input type="text" />
      </div>
    </div>
  );
};

export default page;
