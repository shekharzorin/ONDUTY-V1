"use client";

import { FaTimes, FaClock, FaCalendarAlt, FaUser } from "react-icons/fa";

interface Activity {
    name: string;
    type: string;
    img: string;
    time?: string;
    date?: string;
}

interface ActivityModalProps {
    open: boolean;
    onClose: () => void;
    activity: Activity | null;
}

export default function ActivityModal({ open, onClose, activity }: ActivityModalProps) {
    if (!open || !activity) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative transform transition-all scale-100 animate-scale-up">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
                >
                    <FaTimes className="text-xl" />
                </button>

                {/* Modal Content */}
                <div className="text-center mt-2">
                    <div className="relative inline-block mb-4">
                        <img
                            src={activity.img}
                            alt={activity.name}
                            className="w-24 h-24 rounded-full object-cover border-4 border-purple-100 shadow-sm mx-auto"
                        />
                        <div className="absolute bottom-0 right-0 bg-[#8D6BDC] text-white p-1.5 rounded-full border-2 border-white">
                            <FaUser className="text-xs" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{activity.name}</h2>
                    <span className="inline-block bg-purple-100 text-[#8D6BDC] px-3 py-1 rounded-full text-xs font-semibold mb-6">
                        {activity.type}
                    </span>

                    <div className="grid grid-cols-2 gap-4 text-left bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2.5 rounded-lg text-blue-600">
                                <FaClock />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium uppercase">Time</p>
                                <p className="font-semibold text-gray-700">{activity.time || "09:30 AM"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2.5 rounded-lg text-orange-600">
                                <FaCalendarAlt />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium uppercase">Date</p>
                                <p className="font-semibold text-gray-700">{activity.date || "Oct 24, 2024"}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full mt-6 bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
}
