"use client";

import { useState } from "react";

const page = () => {
  const [searchText, setSearchText] = useState("");

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
      <div className="flex flex-col w-full bg-(--color-sidebar) text-(--color-gray) rounded-2xl shadow-lg p-5 text-[18px] font-semibold gap-5">
        <p>Add Map Api</p>

        <input
          type="text"
          placeholder="Search by name / email"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full outline-none bg-transparent"
        />
      </div>
    </div>
  );
};

export default page;
