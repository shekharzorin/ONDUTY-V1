"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar"; // Assuming reuse of existing sidebar
import ClientRequestCard from "../components/ClientRequestCard";
import { FaFilter, FaSearch, FaSync } from "react-icons/fa";

interface Request {
    id: string;
    employee: {
        firstName: string;
        lastName: string;
        image?: string;
        position: string;
    };
    client?: {
        name: string;
        company: string;
        image?: string;
        address?: string;
    };
    clientName?: string;
    location?: string;
    reason?: string;
    status: string;
    createdAt: string;
}

export default function ClientRequestsPage() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL"); // ALL, PENDING, APPROVED, REJECTED

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/client-requests");
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleUpdateStatus = async (id: string, status: string, reason?: string) => {
        // optimistic update
        setRequests(prev => prev.map(req =>
            req.id === id ? { ...req, status } : req
        ));

        try {
            const res = await fetch("/api/client-requests", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status, rejectionReason: reason }),
            });

            if (!res.ok) {
                // revert if failed
                fetchRequests();
                alert("Failed to update status");
            }
        } catch (error) {
            console.error("Update failed", error);
            fetchRequests();
        }
    };

    const filteredRequests = requests.filter(req => {
        if (filter === "ALL") return true;
        return req.status === filter;
    });

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar />

            <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 shrink-0">
                    <h1 className="text-xl font-bold text-gray-800">Client Requests</h1>
                    <div className="flex items-center gap-4">
                        <button onClick={fetchRequests} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition" title="Refresh">
                            <FaSync className={loading ? "animate-spin" : ""} />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                            A
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {/* Filters */}
                    <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
                        {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${filter === f
                                        ? "bg-gray-800 text-white"
                                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                    }`}
                            >
                                {f.charAt(0) + f.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    {loading && requests.length === 0 ? (
                        <div className="flex items-center justify-center h-64 text-gray-400">Loading requests...</div>
                    ) : filteredRequests.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredRequests.map(req => (
                                <ClientRequestCard
                                    key={req.id}
                                    request={req}
                                    onUpdateStatus={handleUpdateStatus}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <p>No requests found matching this filter.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
