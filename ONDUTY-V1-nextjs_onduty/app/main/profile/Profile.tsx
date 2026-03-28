"use client";

import { getProfile, getProfileImage, postProfile, logoutUser } from "@/app/backend-api/api";
import Addicon from "@/app/components/Addicon";
import Button from "@/app/components/Button";
import Header from "@/app/components/Header";
import ProfileCard from "@/app/components/Profilecard";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import profileImg from "@/app/images/profile.webp";
import { useRouter } from "next/navigation";
import AdminLocationTracker from "../services/AdminLocationTracker";
import { StatusTrackerService } from "../services/StatusTrackerService";
import socket from "@/app/main/services/socket";
import { FaBan } from "react-icons/fa";



export default function ProfileModal({ open, onClose, }: { open: boolean; onClose: () => void; }) {
  if (!open) return null;

  /* -------------------- STATES -------------------- */
  const [profileData, setProfileData] = useState({ name: "", mobile: "", email: "" });
  const [profileImage, setProfileImage] = useState<any>(profileImg);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  /* -------------------- FETCH PROFILE -------------------- */
  const loadProfile = async () => {
    try {
      const data = await getProfile();
      const img = await getProfileImage();

      setProfileData({
        name: data.profile.name,
        mobile: data.profile.mobile,
        email: data.profile.email,
      });

      if (img) setProfileImage(img);
    } catch (err) {
      console.log("❌ Failed to load profile:", err);
    }
  };

  useEffect(() => {
    if (open) loadProfile();
  }, [open]);

  /* -------------------- OPEN FILE PICKER -------------------- */
  const handleOpenPicker = () => fileInputRef.current?.click();

  /* -------------------- HANDLE IMAGE CHANGE -------------------- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempUrl = URL.createObjectURL(file);
    setProfileImage(tempUrl);
  };

  /* -------------------- UPDATE PROFILE -------------------- */
  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("mobile", profileData.mobile);

      if (fileInputRef.current?.files?.[0]) {
        formData.append("profilePic", fileInputRef.current.files[0]);
      }

      const res = await postProfile(formData);

      if (res.success) {
        alert("Profile updated successfully!");
        loadProfile();
      } else {
        alert(res.message || "Failed to update");
      }
    } catch (err) {
      alert("Error updating profile");
    }
  };


  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");

    if (!confirmed) return;

    try {
      AdminLocationTracker.stopTracking();
      StatusTrackerService.forceStop();

      const success = await logoutUser();

      if (success) {
        // 🔌 Disconnect socket ONLY HERE
        if (socket.connected) {
          socket.disconnect();
        }
        router.replace("/authentication/login");
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (err) {
      console.error("⚠️ Error during logout:", err);
      alert("Something went wrong while logging out.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-start z-50">
      <div className="bg-(--color-bg) w-[35%] h-full shadow-xl flex flex-col">

        <Header title="Profile" onClick={onClose} />

        <div className="flex flex-col p-5 gap-4 items-center flex-1 overflow-auto">
          {/* IMAGE SECTION */}
          <div className="relative bg-(--color-sidebar) p-1.5 rounded-4xl mb-3">
            <div className="w-[120px] h-[120px] overflow-hidden rounded-[26px]">
              <Image src={profileImage} alt="Profile Photo" width={120} height={120} className="w-full h-full object-cover" />
            </div>

            {/* Add icon */}
            <div className="absolute bottom-0 right-0 translate-x-3 translate-y-3">
              <Addicon onClick={handleOpenPicker} />
            </div>

            {/* Hidden file input */}
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
          </div>

          {/* NAME */}
          <ProfileCard
            type="text"
            title="Name :"
            placeholder="Enter name"
            value={profileData.name}
            setValue={(text) => setProfileData({ ...profileData, name: text })}
          />

          {/* MOBILE */}
          <ProfileCard
            type="number"
            title="Mobile :"
            placeholder="Enter number"
            value={profileData.mobile}
            setValue={(text) =>
              setProfileData({ ...profileData, mobile: text })
            }
          />

          {/* EMAIL DISPLAY */}
          <div className="flex flex-col bg-(--color-sidebar) rounded-2xl px-7 py-3 w-full h-[90px] gap-3">
            <div className="flex justify-between items-center font-medium text-(--color-gray)">
              <label>Email :</label>
              <div className="flex gap-1.5 items-center">
                <FaBan size={18} />
                <p>Not editable</p>
              </div>
            </div>
            <p className="font-semibold">{profileData.email || "NA"}</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 p-6">
          <Button title="Update Profile" onClick={handleUpdateProfile} />
          <Button title="Log Out" onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
}
