"use client";

import Button from "@/app/components/Button";
import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import Caution from "../caution/Caution";

// ✅ import axios services
import {
  getMapSettings,
  saveMapSettings,
  deleteMapSettings,
} from "@/app/api/api";

const page = () => {
  const [searchText, setSearchText] = useState("");

  const [keyName, setKeyName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [mapEnabled, setMapEnabled] = useState(false);

  const [loading, setLoading] = useState(false);

  /* ===============================
     FETCH MAP SETTINGS ON LOAD
  =============================== */
  const fetchSettings = async () => {
    const res = await getMapSettings();

    if (res.success && res.data) {
      setKeyName(res.data.key_name || "");
      setApiKey(res.data.googleMapKey || "");
      setMapEnabled(res.data.mapEnabled || false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  /* ===============================
     SAVE MAP SETTINGS
  =============================== */
  const handleSave = async () => {
    if (!searchText) return alert("❌ Enter API key");

    setLoading(true);

    const res = await saveMapSettings(searchText, true);

    alert(res.message);

    if (res.success) {
      setSearchText("");
      fetchSettings();
    }

    setLoading(false);
  };

  /* ===============================
     DELETE MAP SETTINGS
  =============================== */
  const handleDelete = async () => {
    if (!confirm("❌ Delete map configuration?")) return;

    const res = await deleteMapSettings();

    alert("✅ "+res.message);

    if (res.success) {
      setKeyName("");
      setApiKey("");
      setMapEnabled(false);
    }
  };

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
          <Button
            title={loading ? "Saving..." : "Save"}
            onClick={handleSave}
          />
        </div>
      </div>

      {/* DISPLAY BACKEND DATA */}
      <div className="flex relative flex-col w-full bg-(--color-sidebar) text-(--color-gray) rounded-2xl shadow-lg p-5 text-[18px] font-semibold gap-5">
        <div className="flex items-center justify-between">

          {/* LEFT SIDE */}
          <div className="flex flex-col gap-4 font-semibold">
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
              <p>Key Name :</p>
              <p className="text-black">{keyName}</p>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
              <p>Your Api Key :</p>
              <p className="text-black">{apiKey}</p>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
              <p>Map Status :</p>
              <p className={mapEnabled ? "text-green-500" : "text-red-500"}>
                {mapEnabled ? "Enabled" : "Disabled"}
              </p>
            </div>

          </div>

          {/* DELETE BUTTON */}
          <div
            className=" absolute flex items-center justify-end right-5 bottom-5 w-fit bg-gray-300 hover:bg-(--color-secondary) hover:scale-110 p-2 rounded-full cursor-pointer transition-all shadow-lg"
            onClick={handleDelete}
          >
            <MdDelete size={26} />
          </div>

        </div>
      </div>

      <Caution />
    </div>
  );
};

export default page;