"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { FaBuilding, FaClock, FaMapMarkerAlt, FaLock, FaPalette, FaSave } from "react-icons/fa";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("company");
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert("Settings saved successfully!");
        }, 1000);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">

                {/* Header */}
                <div className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0">
                    <h1 className="text-xl font-bold text-gray-800">Settings</h1>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition"
                    >
                        <FaSave /> {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Settings Sidebar */}
                    <div className="w-64 bg-white border-r border-gray-200 p-6 space-y-2">
                        {[
                            { id: 'company', icon: FaBuilding, label: 'Company Details' },
                            { id: 'hours', icon: FaClock, label: 'Working Hours' },
                            { id: 'geofence', icon: FaMapMarkerAlt, label: 'Geo-Fencing' },
                            { id: 'permissions', icon: FaLock, label: 'Permissions' },
                            { id: 'theme', icon: FaPalette, label: 'App Theme' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === item.id ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <item.icon /> {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-8">
                        {activeTab === 'company' && (
                            <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Company Information</h2>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500">Company Name</label>
                                        <input type="text" defaultValue="Acme Corp" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500">Website</label>
                                        <input type="text" defaultValue="https://acme.com" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm" />
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-xs font-semibold text-gray-500">Address</label>
                                        <input type="text" defaultValue="123 Innovation Dr, Tech City" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'hours' && (
                            <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Working Shifts</h2>
                                <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">General Shift</h3>
                                        <p className="text-xs text-gray-500">Mon - Fri</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <input type="time" defaultValue="09:00" className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm" />
                                        <span className="text-gray-400">-</span>
                                        <input type="time" defaultValue="18:00" className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'geofence' && (
                            <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Geo-Fencing Configuration</h2>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500">Default Radius (Meters)</label>
                                        <input type="number" defaultValue="200" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm" />
                                        <p className="text-xs text-gray-400">Employees must be within this radius to clock in.</p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4">
                                        <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-purple-500" />
                                        <span className="text-sm text-gray-700">Enable location enforcement</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'permissions' && (
                            <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Role Permissions</h2>
                                <div className="space-y-3">
                                    {['Edit Attendance', 'Approve Leaves', 'Manage Clients', 'View Reports', 'Delete Employees'].map(perm => (
                                        <div key={perm} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg">
                                            <span className="text-sm font-medium text-gray-700">{perm}</span>
                                            <div className="flex gap-4 text-xs">
                                                <label className="flex items-center gap-1"><input type="checkbox" defaultChecked /> Admin</label>
                                                <label className="flex items-center gap-1"><input type="checkbox" /> Manager</label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'theme' && (
                            <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Appearance</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="border-2 border-purple-500 rounded-xl p-4 bg-gray-50 cursor-pointer">
                                        <div className="h-20 bg-white rounded-lg border border-gray-200 mb-2"></div>
                                        <p className="text-center text-xs font-semibold text-purple-600">Light (Default)</p>
                                    </div>
                                    <div className="border border-gray-200 rounded-xl p-4 bg-gray-900 cursor-pointer hover:border-purple-500">
                                        <div className="h-20 bg-gray-800 rounded-lg border border-gray-700 mb-2"></div>
                                        <p className="text-center text-xs font-semibold text-white">Dark</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
