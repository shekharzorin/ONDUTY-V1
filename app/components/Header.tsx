"use client";

import { FaBell, FaUserCircle } from "react-icons/fa";

interface HeaderProps {
    onBellClick: () => void;
    unreadCount?: number;
    userRole?: "Admin" | "Employee";
}

export default function Header({ onBellClick, unreadCount = 0, userRole = "Admin" }: HeaderProps) {
    return (
        <div className="flex items-center justify-between bg-white px-8 py-4 shadow-sm">
            {/* Welcome Message */}
            <div>
                <h1 className="text-2xl font-bold text-[#8D6BDC]">Welcome back, {userRole === "Admin" ? "Admin" : "Pawan"}!</h1>
                <p className="text-gray-500 text-sm">Here's what's happening via your dashboard today.</p>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-6">
                {/* Notification Bell */}
                <button
                    onClick={onBellClick}
                    className="relative text-gray-400 hover:text-[#8D6BDC] transition text-2xl"
                >
                    <FaBell />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white transform translate-x-1/2 -translate-y-1/2"></span>
                    )}
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                    <FaUserCircle className="text-4xl text-gray-300" />
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-gray-700">{userRole === "Admin" ? "Super Admin" : "Pawan Kumar"}</p>
                        <p className="text-xs text-gray-500">{userRole}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
