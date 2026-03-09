"use client";

import Image from "next/image";
import onduty_logo from "@/app/images/onduty-logo.png";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import ProfileModal from "../profile/Profile";
import { FaHandshake, FaUserAlt, FaUsers } from "react-icons/fa";
import { MdDashboard, MdDescription } from "react-icons/md";

export default function Navbar() {
  const pathname = usePathname();
  const [openProfile, setOpenProfile] = useState(false);

  const links = [
    { name: "Dashboard", path: "/main/dashboard", icon: MdDashboard, size: 22 },
    { name: "Employees", path: "/main/employees", icon: FaUsers, size: 24 },
    { name: "Reposts", path: "/main/reports", icon: MdDescription, size: 22 },
    { name: "clients", path: "/main/clients", icon: FaHandshake, size: 25 },
  ];

  return (
    <div className="h-screen bg-(--color-sidebar) md:w-[30%] lg:w-[20%] xl:w-[16%] shadow-md flex flex-col items-center p-4">
      <div className="mb-15 mt-6">
        <Image
          src={onduty_logo}
          alt="OnDuty Logo"
          width={150}
          height={150}
          style={{ height: "auto" }}
          priority
        />

      </div>

      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col space-y-3 w-full flex-1">
          {links.map((link) => {
            const isActive = pathname === link.path;
            const Icon = link.icon;

            return (
              <Link key={link.name} href={link.path} className={`px-4 py-2 rounded-xl flex items-center gap-3 w-full transition duration-300 font-medium
                ${isActive ? "bg-(--color-primary) text-white" : "text-(--color-secondary) hover:bg-gray-200"}`}
              >
                <Icon size={link.size} />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto pb-4">
          <button onClick={() => setOpenProfile(true)} className="flex items-center justify-center text-(--color-secondary) gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg font-medium cursor-pointer" >
            <FaUserAlt size={18} />
            <span>Profile</span>
          </button>
        </div>
      </div>

      <ProfileModal open={openProfile} onClose={() => setOpenProfile(false)} />
    </div>
  );
}