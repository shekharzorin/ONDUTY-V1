"use client";

import { getAdminClients, getClientImage, addClient, updateClient, deleteClient } from "@/app/backend-api/api";
import Gobtn from "@/app/components/Gobtn";
import Searchbar from "@/app/components/Searchbar";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import defaultProfile from "@/app/images/profile.webp";
import Deletebtn from "@/app/components/Deletebtn";
import Crossicon from "@/app/components/Crossicon";
import Button from "@/app/components/Button";
import InputBox from "@/app/components/Inputbox";
import { FaEdit, FaFolderOpen, FaHandshake, FaMobile } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { IoClose } from "react-icons/io5";

/* -------------------------------------------------------
   TYPES
------------------------------------------------------- */
type SelectedImage = {
  file: File;
  preview: string;
};

/* -------------------------------------------------------
   IMAGE CACHE
------------------------------------------------------- */
const clientImageCache: Record<string, string | null> = {};

/* -------------------------------------------------------
   ADDRESS → LATITUDE & LONGITUDE  ✅ ADDED
------------------------------------------------------- */
const getLatLngFromAddress = async (address: string) => {
  const query = `${address}, India`;
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      query
    )}&countrycodes=in`,
    {
      headers: {
        "User-Agent": "YourAppName/1.0 (contact@yourapp.com)",
      },
    }
  );
  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(
      "Address not found.\nPlease enter a valid address like street, state"
    );
  }
  return {
    latitude: data[0].lat,
    longitude: data[0].lon,
  };
};

const Page = () => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [openEmpModal, setOpenEmpModal] = useState(false);
  const [openAddClientModal, setOpenAddClientModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", number: "", location: ""});
  const [image, setImage] = useState<SelectedImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditClick = (client: any) => {
    setForm({ name: client.name || "", number: client.clientNumber || "", location: client.address || "" });
    setImage(null);
    setEditingClientId(client._id);
    setIsEditMode(true);
    setOpenEmpModal(false);
    setOpenAddClientModal(true);
  };

  /* -------------------------------------------------------
     LOAD ADMIN CLIENTS (UPDATED)
  ------------------------------------------------------- */
  const loadClients = async () => {
    try {
      setLoading(true);
      const res = await getAdminClients();
      const data = res?.clients || [];

      setClients(
        data.map((c: any) => ({
          ...c,
          clientImage: clientImageCache[c._id] || null,
        }))
      );
      data.forEach(async (client: any) => {
        if (clientImageCache[client._id] !== undefined) return;
        try {
          const img = await getClientImage(client._id);
          clientImageCache[client._id] = img;
          setClients((prev) =>
            prev.map((c) =>
              c._id === client._id ? { ...c, clientImage: img } : c
            )
          );
        } catch (err) {
          console.error("❌ Image load failed:", err);
          clientImageCache[client._id] = null;
        }
      });
    } catch (err) {
      console.error("❌ Error loading clients:", err);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------
     ADD / UPDATE CLIENT (UPDATED)
  ------------------------------------------------------- */
  const handleSubmitClient = async () => {
    try {
      setLoading(true);
      const { latitude, longitude } = await getLatLngFromAddress(form.location);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("clientNumber", form.number);
      formData.append("address", form.location);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      if (image?.file) {
        formData.append("image", image.file);
      }
      if (isEditMode && editingClientId) {
        await updateClient(editingClientId, formData);
        delete clientImageCache[editingClientId];
      } else {
        await addClient(formData);
      }
      setOpenAddClientModal(false);
      setForm({ name: "", number: "", location: "" });
      setImage(null);
      setIsEditMode(false);
      setEditingClientId(null);
      loadClients();
    } catch (err: any) {
      alert("❌ "+err.message || "Failed to save client");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------
     IMAGE PICKER
  ------------------------------------------------------- */
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage({ file, preview: URL.createObjectURL(file)});
  };

  const removeImage = () => setImage(null);

  useEffect(() => {
    loadClients();
  }, []);


  /* -------------------------------------------------------
     DELET CLIENT 
  ------------------------------------------------------- */
  const handleDeleteClient = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?"
    );
    if (!confirmDelete) return;
    try {
      setLoading(true);
      await deleteClient(id);
      delete clientImageCache[id];
      setClients((prev) => prev.filter((c) => c._id !== id));
      setOpenEmpModal(false);
      setSelectedEmployee(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete client");
    } finally {
      setLoading(false);
    }
  };

  const resetClientForm = () => {
    setForm({ name: "", number: "", location: "" });
    setImage(null);
    setIsEditMode(false);
    setEditingClientId(null);
  };

  /* -------------------------------------------------------
     SEARCH
  ------------------------------------------------------- */
  const filteredClients = clients.filter((client: any) =>
    client?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex flex-col p-2.5 gap-5 h-screen">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-2xl text-(--color-primary) px-2.5 pt-2.5">Clients</p>
        <div className="w-[20%] pr-4">
          <Button title="+ Add Client" onClick={() => { resetClientForm(); setOpenAddClientModal(true); }} />
        </div>
      </div>

      <div className="px-2.5">
        <Searchbar placeholder="Search clients..." value={searchText} onChange={setSearchText} />
      </div>

      <div className="overflow-y-auto grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-2.5 pb-5 pt-1.5">
        {filteredClients.length === 0 ? (
          <p className="font-medium text-(--color-gray) ml-3">
            No clients found
          </p>
        ) : (
          filteredClients.map((c: any) => (
            <div key={c._id} className="bg-(--color-sidebar) rounded-3xl p-4 shadow-lg hover:scale-105 transition hover:bg-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex w-[75px] h-[75px]">
                  <Image src={c.clientImage || defaultProfile} alt={c.name} width={75} height={75} className="rounded-xl object-cover" />
                </div>
                <Gobtn onClick={() => { setSelectedEmployee(c); setOpenEmpModal(true); }} />
              </div>

              <p className="mt-4 text-[18px] font-semibold">{c.name}</p>

              <div className="flex">
                <p className="mt-1 font-medium text-(--color-gray)"> {c.address} </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ------------------ MODAL ------------------ */}
      {openEmpModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="relative bg-(--color-sidebar) p-5 rounded-4xl w-[400px] shadow-xl">
            <div className="relative w-full h-[200px] rounded-2xl overflow-hidden">
              <Image src={selectedEmployee.clientImage || defaultProfile} alt="Client image" fill className="object-cover" />
            </div>

            <p className="mt-6 text-[20px] font-semibold">Client : {selectedEmployee.name}</p>
            <p className="mt-2 font-medium text-(--color-gray)">Address : {selectedEmployee.address}</p>
            <p className="mt-2 font-medium text-(--color-gray)">Mobile : {selectedEmployee.clientNumber}</p>

            <div className="flex justify-end gap-3">
              <div className="bg-(--color-primary) p-3 rounded-full cursor-pointer" onClick={() => handleEditClick(selectedEmployee)}>
                <FaEdit size={24} color="#fff" />
              </div>
              <Deletebtn onClick={() => handleDeleteClient(selectedEmployee._id)} />
            </div>

            <div className="absolute top-4 right-4">
              <Crossicon onClick={() => setOpenEmpModal(false)} />
            </div>
          </div>
        </div>
      )}

      {openAddClientModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="relative bg-(--color-bg) flex flex-col items-center justify-center rounded-4xl shadow-md w-[400px]">
            <form className="flex flex-col w-full h-full p-5 gap-8 md:gap-15" onSubmit={(e) => e.preventDefault()} >
              <p className="font-semibold text-[18px] text-(--color-primary)">Add Client</p>

              <div className="flex flex-col w-full gap-3">
                <InputBox
                  icon={<FaHandshake size={25} />}
                  type="text"
                  placeholder="Enter client name"
                  value={form.name}
                  onChange={(value) => handleChange("name", value)}
                  required
                />

                <InputBox
                  icon={<FaMobile size={22} />}
                  type="number"
                  placeholder="Enter client number"
                  value={form.number}
                  onChange={(value) => handleChange("number", value)}
                  required
                />

                <InputBox
                  icon={<MdLocationOn size={26} />}
                  type="text"
                  placeholder="Enter address like street state"
                  value={form.location}
                  onChange={(value) => handleChange("location", value)}
                  required
                />

                <div className="flex bg-(--color-sidebar) items-center justify-center gap-3 p-3 rounded-xl">
                  <div className="flex w-18 h-18 rounded-2xl bg-[#B9B9B9] items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <FaFolderOpen size={50} color="#fff" />
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageSelect}
                  />

                  {image && (
                    <div className="relative w-18 h-18 rounded-xl overflow-hidden">
                      <img src={image.preview} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={removeImage} className="absolute top-0.5 right-0.5 bg-(--color-primary) rounded-full p-1 transition cursor-pointer">
                        <IoClose size={20} color="#fff" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col w-full gap-3 md:gap-5 mt-auto">
                <Button title={loading ? isEditMode ? "Updating Client..." : "Adding Client..." : isEditMode ? "Update Client" : "Add Client"}
                  onClick={handleSubmitClient}
                  disabled={loading}
                />
              </div>
            </form>
            <div className="absolute top-4 right-4">
              <Crossicon onClick={() => { setOpenAddClientModal(false); resetClientForm(); }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;