"use client";

import Button from "@/app/components/Button";
import { useState } from "react";
import { MdDelete } from "react-icons/md";

const page = () => {
  const [searchText, setSearchText] = useState("");
  const [apiKey, setApiKey] = useState("");

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
        <p>Add Map Api to Activate Map</p>

        <input
          type="text"
          placeholder="Enter your Map API key"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full outline-none rounded-lg p-2 bg-gray-200"
        />

        <div className="flex w-[50%] mx-auto">
          <Button title="Save" onClick={() => {}} />
        </div>
      </div>

      <div className="flex flex-col w-full bg-(--color-sidebar) text-(--color-gray) rounded-2xl shadow-lg p-5 text-[18px] font-semibold gap-5">
        <div className="flex">
          <p>Your Api Key : {" "}</p>
          <p>{apiKey}</p>
        </div>
        <div
          className="flex w-fit bg-gray-300 text-(--color-gray) hover:bg-(--color-secondary) hover:scale-110 hover:text-(--color-primary) p-2 rounded-full cursor-pointer transition-all shadow-lg"
          onClick={() => {}}
        >
          <MdDelete size={26} className="flex items-center justify-end"/>
        </div>
      </div>
    </div>
  );
};

export default page;
