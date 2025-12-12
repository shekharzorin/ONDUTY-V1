"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const [openDrawer, setOpenDrawer] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
                <Header
                    onBellClick={() => setOpenDrawer(true)}
                    unreadCount={3}
                    userRole="Admin"
                />
                <div className="flex-1 overflow-y-auto p-8 relative">
                    {children}
                </div>
            </div>
        </div>
    );
}
