"use client";

import Button from "@/app/components/Button";
import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";

const page = () => {
  const [searchText, setSearchText] = useState("");

  // backend data states
  const [keyName, setKeyName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [mapEnabled, setMapEnabled] = useState(false);

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

      {/* ADD MAP API */}
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

      {/* DISPLAY BACKEND DATA */}
      <div className="flex flex-col w-full bg-(--color-sidebar) text-(--color-gray) rounded-2xl shadow-lg p-5 text-[18px] font-semibold gap-5">
        <div className="flex items-center justify-between">
          {/* LEFT SIDE DATA */}
          <div className="flex flex-col gap-1">
            <p>Key Name:</p>
            <p className="text-sm font-normal break-all">{keyName}</p>

            <p className="mt-3">Your Api Key:</p>
            <p className="text-sm font-normal break-all">{apiKey}</p>

            <p className="mt-3">Map Status:</p>
            <p className={mapEnabled ? "text-green-500" : "text-red-500"}>
              {mapEnabled ? "Enabled" : "Disabled"}
            </p>
          </div>

          {/* DELETE BUTTON */}
          <div
            className="flex items-center justify-end w-fit bg-gray-300 hover:bg-(--color-secondary) hover:scale-110 p-2 rounded-full cursor-pointer transition-all shadow-lg"
            onClick={() => {}}
          >
            <MdDelete size={26} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
