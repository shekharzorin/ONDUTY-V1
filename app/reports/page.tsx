"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { FaDownload, FaCalendarAlt, FaChartPie, FaChartBar } from "react-icons/fa";

export default function ReportsPage() {
    const [filter, setFilter] = useState("Weekly"); // Daily, Weekly, Monthly

    // Dummy aggregation data
    const stats = {
        attendance: 85,
        onTime: 70,
        late: 15,
        absent: 5,
        clientVisits: 42,
        tasksCompleted: 128
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">

                {/* Header */}
                <div className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0">
                    <h1 className="text-xl font-bold text-gray-800">Reports & Analytics</h1>
                    <div className="flex items-center gap-3">
                        <select
                            className="bg-gray-100 border-none rounded-lg text-sm font-medium px-4 py-2 cursor-pointer focus:ring-2 focus:ring-purple-500/20"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Monthly</option>
                        </select>
                        <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition">
                            <FaDownload className="text-gray-400" /> Export PDF
                        </button>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition">
                            <FaDownload /> Export CSV
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 overflow-y-auto">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-gray-500 text-sm font-medium">Avg Attendance</h3>
                            <div className="flex items-end gap-2 mt-2">
                                <span className="text-3xl font-bold text-gray-800">{stats.attendance}%</span>
                                <span className="text-sm text-green-500 font-medium mb-1">+2% vs last {filter.toLowerCase()}</span>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-gray-500 text-sm font-medium">Client Visits</h3>
                            <div className="flex items-end gap-2 mt-2">
                                <span className="text-3xl font-bold text-purple-600">{stats.clientVisits}</span>
                                <span className="text-sm text-gray-400 mb-1">Total visits</span>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-gray-500 text-sm font-medium">Tasks Completed</h3>
                            <div className="flex items-end gap-2 mt-2">
                                <span className="text-3xl font-bold text-blue-600">{stats.tasksCompleted}</span>
                                <span className="text-sm text-green-500 font-medium mb-1">+12% productivity</span>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section (Visual Mockups) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <FaChartBar className="text-purple-500" /> Attendance Trends
                                </h3>
                            </div>
                            {/* CSS Bar Chart Mockup */}
                            <div className="h-64 flex items-end justify-between gap-2 px-4">
                                {[60, 80, 45, 90, 75, 85, 95].map((h, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 w-full">
                                        <div
                                            className="w-full bg-purple-500 rounded-t-sm hover:bg-purple-600 transition-all cursor-pointer relative group"
                                            style={{ height: `${h}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                                {h}% Attendance
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400">Day {i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <FaChartPie className="text-blue-500" /> Task Distribution
                                </h3>
                            </div>
                            <div className="h-64 flex items-center justify-center relative">
                                {/* CSS Pie Chart Mockup using conic-gradient */}
                                <div
                                    className="w-48 h-48 rounded-full"
                                    style={{ background: 'conic-gradient(#8D6BDC 0% 60%, #4facfe 60% 85%, #ff9a9e 85% 100%)' }}
                                />
                                <div className="absolute inset-0 flex flex-col justify-center ml-64 text-sm space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-[#8D6BDC]"></span>
                                        <span className="text-gray-600">Site Visits (60%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-[#4facfe]"></span>
                                        <span className="text-gray-600">Office Work (25%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-[#ff9a9e]"></span>
                                        <span className="text-gray-600">Meetings (15%)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="font-bold text-gray-800">Detailed Report</h3>
                        </div>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium">
                                <tr>
                                    <th className="p-4">Employee</th>
                                    <th className="p-4">Department</th>
                                    <th className="p-4">Attendance</th>
                                    <th className="p-4">Tasks</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition">
                                        <td className="p-4 font-medium text-gray-800">Employee Name {i}</td>
                                        <td className="p-4 text-gray-500">Engineering</td>
                                        <td className="p-4 text-green-600 font-medium">9{i}%</td>
                                        <td className="p-4 text-gray-600">1{i} / 15</td>
                                        <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Excellent</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
}
