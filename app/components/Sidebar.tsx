"use client";

import Image from "next/image";
import { FaUser, FaChartBar, FaUsers, FaHome, FaMapMarkerAlt, FaCog } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen fixed top-0 left-0 bg-white shadow-md p-6 flex flex-col">

      {/* Logo */}
      <div className="mb-8 flex justify-center ">
        <Image
          src="/images/onduty-logo.png" // exact file in public/images
          alt="OnDuty Logo"
          width={150}                   // adjust size as needed
          height={50}                   // adjust size as needed
          className="object-contain w-36 h-12"
          unoptimized={true}            // only needed for dev mode
        />
      </div>

      {/* Navigation */}
      <nav className="space-y-3">
        {/* Dashboard */}
        <a href="/dashboard" className="flex items-center gap-3 text-gray-600  hover:text-purple-600 hover:bg-purple-200 cursor-pointer transition px-4 py-2 rounded-xl">
          <FaHome size={18} /> Dashboard
        </a>

        {/* Live Tracking */}
        <a href="/tracking" className="flex items-center gap-3 text-gray-600 hover:text-purple-600 hover:bg-purple-200 cursor-pointer transition px-4 py-2 rounded-xl">
          <FaMapMarkerAlt size={18} /> Live Map
        </a>

        {/* Employees */}
        <a href="/employees" className="flex items-center gap-3 text-gray-600 hover:text-purple-600 hover:bg-purple-200 cursor-pointer transition px-4 py-2 rounded-xl">
          <FaUsers size={18} /> Employees
        </a>

        {/* Client Requests */}
        <a href="/client-requests" className="flex items-center gap-3 text-gray-600 hover:text-purple-600 hover:bg-purple-200 cursor-pointer transition px-4 py-2 rounded-xl">
          <FaUser size={18} /> Requests
        </a>

        {/* Reports */}
        <a href="/reports" className="flex items-center gap-3 text-gray-600 hover:text-purple-600 hover:bg-purple-200 cursor-pointer transition px-4 py-2 rounded-xl">
          <FaChartBar size={18} /> Reports
        </a>

        {/* Settings */}
        <a href="/settings" className="flex items-center gap-3 text-gray-600 hover:text-purple-600 hover:bg-purple-200 cursor-pointer transition px-4 py-2 rounded-xl">
          <FaCog size={18} /> Settings
        </a>
      </nav>


      {/* Profile link at bottom */}
      <div className="mt-auto">
        <div className="flex items-center gap-3 text-gray-600 hover:text-purple-600  hover:bg-purple-200 cursor-pointer transition px-4 py-2 rounded-xl">
          <FaUser size={18} /> Profile
        </div>
      </div>
    </div>

  );

}
