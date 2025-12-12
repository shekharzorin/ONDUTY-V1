"use client";

import { useState } from "react";
import { FaCheck, FaTimes, FaMapMarkerAlt, FaBuilding, FaUser } from "react-icons/fa";

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

interface ClientRequestCardProps {
    request: Request;
    onUpdateStatus: (id: string, status: string, reason?: string) => void;
}

export default function ClientRequestCard({ request, onUpdateStatus }: ClientRequestCardProps) {
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    const handleDecline = () => {
        if (!rejectionReason.trim()) return;
        onUpdateStatus(request.id, "REJECTED", rejectionReason);
        setIsRejecting(false);
    };

    const statusColors: Record<string, string> = {
        PENDING: "bg-yellow-100 text-yellow-800",
        APPROVED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header with Employee Info */}
            <div className="p-4 border-b border-gray-50 flex justify-between items-start bg-gray-50/50">
                <div className="flex items-center gap-3">
                    <img
                        src={request.employee.image || "https://ui-avatars.com/api/?name=Employee"}
                        alt="Employee"
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                        <h3 className="font-semibold text-gray-800 text-sm">{request.employee.firstName} {request.employee.lastName}</h3>
                        <p className="text-xs text-gray-500">{request.employee.position}</p>
                    </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[request.status] || "bg-gray-100"}`}>
                    {request.status}
                </span>
            </div>

            {/* Body Content */}
            <div className="p-4 space-y-4">
                {/* Client Info */}
                <div className="flex gap-4">
                    {/* Building Image if available */}
                    {(request.client?.image) && (
                        <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            <img src={request.client.image} alt="Building" className="w-full h-full object-cover" />
                        </div>
                    )}

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                            <FaBuilding className="text-gray-400 text-sm" />
                            {request.client?.company || request.clientName || "Unknown Client"}
                        </div>

                        <div className="flex items-start gap-2 text-sm text-gray-500">
                            <FaMapMarkerAlt className="text-gray-400 mt-1 shrink-0" />
                            <span className="line-clamp-2">{request.client?.address || request.location || "No address provided"}</span>
                        </div>

                        {request.client?.name && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <FaUser className="text-gray-400" />
                                {request.client.name}
                            </div>
                        )}
                    </div>
                </div>

                {/* Reason Box */}
                <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-600 font-semibold mb-1">Request Reason</p>
                    <p className="text-sm text-gray-700">{request.reason || "No reason provided."}</p>
                </div>
            </div>

            {/* Actions */}
            {request.status === "PENDING" && (
                <div className="p-4 border-t border-gray-50 flex gap-2">
                    {!isRejecting ? (
                        <>
                            <button
                                onClick={() => onUpdateStatus(request.id, "APPROVED")}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                            >
                                <FaCheck /> Approve
                            </button>
                            <button
                                onClick={() => setIsRejecting(true)}
                                className="flex-1 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                            >
                                <FaTimes /> Decline
                            </button>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col gap-2 animate-in fade-in zoom-in duration-200">
                            <input
                                type="text"
                                placeholder="Reason for rejection..."
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDecline}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1.5 rounded-lg text-xs font-medium transition"
                                >
                                    Confirm Decline
                                </button>
                                <button
                                    onClick={() => setIsRejecting(false)}
                                    className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 py-1.5 rounded-lg text-xs font-medium transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
