"use client";

import Button from "@/app/components/Button";
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
          placeholder="Please enter your Map API key here"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full outline-none rounded-lg p-2 bg-gray-200"
        />

        <Button title="Save" onClick={()=>{}} className="w-[50%]"/>
      </div>
    </div>
  );
};

export default page;
