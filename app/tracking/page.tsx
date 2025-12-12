"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Sidebar from "../components/Sidebar";
import { FaFilter, FaSearch, FaMapMarkerAlt, FaCircle } from "react-icons/fa";

// Dynamically import Map to avoid SSR issues
const Map = dynamic(() => import("../components/Map"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">Loading Map...</div>
});

interface Location {
    id: string;
    lat: number;
    lng: number;
    name: string;
    status: string; // Active, Idle, Offline
    image?: string;
    address?: string;
    role: string;
    lastUpdate: string;
}

export default function TrackingPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [filter, setFilter] = useState("All"); // All, Active, Idle, Offline
    const [loading, setLoading] = useState(true);

    // Mock fetch - in real app, fetch from API which gets real-time coords
    useEffect(() => {
        const fetchLocations = async () => {
            // Simulate API call
            setTimeout(() => {
                const mockLocations: Location[] = [
                    { id: "1", lat: 12.9716, lng: 77.5946, name: "Alice Williams", status: "Active", role: "Designer", lastUpdate: "2 mins ago", image: "https://randomuser.me/api/portraits/women/1.jpg", address: "Cubbon Park, Bengaluru" },
                    { id: "2", lat: 19.0760, lng: 72.8777, name: "Bob Johnson", status: "Idle", role: "Manager", lastUpdate: "15 mins ago", image: "https://randomuser.me/api/portraits/men/2.jpg", address: "Bandra West, Mumbai" },
                    { id: "3", lat: 28.6139, lng: 77.2090, name: "Charlie Brown", status: "Offline", role: "Developer", lastUpdate: "1 hour ago", image: "https://randomuser.me/api/portraits/men/3.jpg", address: "Connaught Place, New Delhi" },
                    { id: "4", lat: 13.0827, lng: 80.2707, name: "Diana Prince", status: "Active", role: "Product Owner", lastUpdate: "Just now", image: "https://randomuser.me/api/portraits/women/4.jpg", address: "Marina Beach, Chennai" },
                    { id: "5", lat: 17.3850, lng: 78.4867, name: "Evan Wright", status: "Active", role: "Developer", lastUpdate: "5 mins ago", image: "https://randomuser.me/api/portraits/men/5.jpg", address: "Charminar, Hyderabad" },
                ];
                setLocations(mockLocations);
                setLoading(false);
            }, 1000);
        };

        fetchLocations();
    }, []);

    const filteredLocations = filter === "All"
        ? locations
        : locations.filter(l => l.status === filter);

    const selectedLocation = locations.find(l => l.id === selectedId);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar />

            <div className="flex-1 ml-64 flex h-screen overflow-hidden relative">

                {/* Map Area */}
                <div className="flex-1 relative h-full">
                    <Map
                        locations={filteredLocations}
                        onMarkerClick={setSelectedId}
                    />

                    {/* Overlay Controls */}
                    <div className="absolute top-4 left-4 z-[1000] bg-white p-2 rounded-lg shadow-md flex gap-2">
                        {["All", "Active", "Idle", "Offline"].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${filter === f ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Side Panel */}
                <div className="w-80 bg-white border-l border-gray-200 flex flex-col z-10 shadow-xl">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="font-bold text-gray-800">Live Tracking</h2>
                        <div className="mt-2 relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <input
                                type="text"
                                placeholder="Search employee..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-400 text-sm">Loading...</div>
                        ) : filteredLocations.map(loc => (
                            <div
                                key={loc.id}
                                onClick={() => setSelectedId(loc.id)}
                                className={`p-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition flex items-center gap-3 ${selectedId === loc.id ? "bg-purple-50/50 border-l-4 border-l-purple-500" : ""}`}
                            >
                                <div className="relative">
                                    <img src={loc.image} alt={loc.name} className="w-10 h-10 rounded-full object-cover" />
                                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${loc.status === "Active" ? "bg-green-500" :
                                            loc.status === "Idle" ? "bg-orange-500" :
                                                "bg-gray-400"
                                        }`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-800 text-sm truncate">{loc.name}</h4>
                                    <p className="text-xs text-gray-500 truncate">{loc.role}</p>
                                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                        <FaMapMarkerAlt /> {loc.address?.split(',')[0]}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Selected Details Footer */}
                    {selectedLocation && (
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <h3 className="font-bold text-gray-800 text-sm mb-2">Selected Details</h3>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Last Update</span>
                                    <span className="font-medium text-gray-800">{selectedLocation.lastUpdate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Current Task</span>
                                    <span className="font-medium text-gray-800">Site Inspection</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Battery</span>
                                    <span className="font-medium text-green-600">85%</span>
                                </div>
                                <button className="w-full mt-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-100 transition">
                                    View Full Profile
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
