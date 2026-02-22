"use client";

import Button from "@/app/components/Button";
import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import Caution from "../caution/Caution";

import { getMapSettings, saveMapSettings, deleteMapKey } from "@/app/api/api";

const Page = () => {
  /* ===============================
     INPUT STATES
  =============================== */
  const [androidKeyInput, setAndroidKeyInput] = useState("");
  const [iosKeyInput, setIosKeyInput] = useState("");
  const [webKeyInput, setWebKeyInput] = useState("");

  /* ===============================
     BACKEND DATA STATES
  =============================== */
  const [androidKey, setAndroidKey] = useState("");
  const [iosKey, setIosKey] = useState("");
  const [webKey, setWebKey] = useState("");
  const [mapEnabled, setMapEnabled] = useState(false);

  const [loading, setLoading] = useState(false);

  /* ===============================
     FETCH SETTINGS
  =============================== */
  const fetchSettings = async () => {
    const res = await getMapSettings();

    if (res.success && res.data) {
      setAndroidKey(res.data.androidMapKey || "");
      setIosKey(res.data.iosMapKey || "");
      setWebKey(res.data.webMapKey || "");
      setMapEnabled(res.data.mapEnabled || false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  /* ===============================
     SAVE SETTINGS
  =============================== */
  const handleSave = async () => {
    if (!androidKeyInput && !iosKeyInput && !webKeyInput) {
      return alert("❌ Please enter at least one key");
    }

    setLoading(true);

    const res = await saveMapSettings({
      androidKey: androidKeyInput,
      iosKey: iosKeyInput,
      webKey: webKeyInput,
      mapEnabled,
    });

    alert(res.message);

    if (res.success) {
      setAndroidKeyInput("");
      setIosKeyInput("");
      setWebKeyInput("");
      fetchSettings();
    }

    setLoading(false);
  };

  /* ===============================
     DELETE KEY
  =============================== */
  const handleDelete = async (keyName: string) => {
    if (!confirm("Delete this key?")) return;

    const res = await deleteMapKey(keyName);
    alert(res.message);

    if (res.success) fetchSettings();
  };

  /* ===============================
     TOGGLE MAP ENABLE
  =============================== */
  const toggleMap = async () => {
    const newValue = !mapEnabled;
    setMapEnabled(newValue);

    await saveMapSettings({
      androidKey,
      iosKey,
      webKey,
      mapEnabled: newValue,
    });

    fetchSettings();
  };

  return (
    <div className="flex flex-col h-screen w-full p-5 gap-5">
      {/* HEADER */}
      <h1 className="text-xl md:text-2xl font-semibold text-(--color-primary)">
        Settings
      </h1>

      {/* ===============================
          ADD MAP API (3 INPUTS)
      =============================== */}
      <div className="flex flex-col w-full bg-(--color-sidebar) rounded-3xl shadow-lg p-5 gap-4">
        <p className="font-semibold">Add Map Api to Activate Map</p>

        <input
          placeholder="Android Map API Key"
          value={androidKeyInput}
          onChange={(e) => setAndroidKeyInput(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-200 outline-none"
        />

        <input
          placeholder="iOS Map API Key"
          value={iosKeyInput}
          onChange={(e) => setIosKeyInput(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-200 outline-none"
        />

        <input
          placeholder="Web Map API Key"
          value={webKeyInput}
          onChange={(e) => setWebKeyInput(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-200 outline-none"
        />

        <Button
          title={loading ? "Saving..." : "Save Settings"}
          onClick={handleSave}
        />
      </div>

      {/* ===============================
          DISPLAY SETTINGS
      =============================== */}
      <div className="relative flex flex-col w-full font-semibold text-[16px] text-(--color-gray) bg-(--color-sidebar) rounded-3xl shadow-lg p-5 gap-4">
        {/* ANDROID */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col lg:flex-row gap-2">
            <p>Android Key :</p>
            <p className="text-black">{androidKey || "Not set"}</p>
          </div>
          
          <div
            className="flex bg-gray-300 text-(--color-gray) hover:bg-(--color-secondary) hover:scale-110 hover:text-(--color-primary) p-2 rounded-full cursor-pointer transition-all shadow-lg"
            onClick={() => handleDelete("android_map_key")}
          >
            <MdDelete size={26} />
          </div>
        </div>

        {/* IOS */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col lg:flex-row gap-2">
            <p>iOS Key :</p>
            <p className="text-black">{iosKey || "Not set"}</p>
          </div>

          <button onClick={() => handleDelete("ios_map_key")}>
            <MdDelete size={24} />
          </button>
        </div>

        {/* WEB */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col lg:flex-row gap-2">
            <p>Web Key : </p>
            <p className="text-black">{webKey || "Not set"}</p>
          </div>

          <button onClick={() => handleDelete("web_map_key")}>
            <MdDelete size={24} />
          </button>
        </div>

        {/* MAP ENABLE TOGGLE */}
        <div className="flex items-center justify-between mt-4">
          <p className="font-semibold">Map Status</p>

          <label className="flex items-center gap-3 cursor-pointer">
            <span className={mapEnabled ? "text-green-500" : "text-red-500"}>
              {mapEnabled ? "Enabled" : "Disabled"}
            </span>

            <input
              type="checkbox"
              checked={mapEnabled}
              onChange={toggleMap}
              className="w-5 h-5"
            />
          </label>
        </div>
      </div>

      <Caution />
    </div>
  );
};

export default Page;
