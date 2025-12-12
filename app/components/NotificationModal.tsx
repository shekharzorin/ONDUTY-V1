"use client";

import { FaTimes, FaBell, FaCheckDouble } from "react-icons/fa";

interface Notification {
    name: string;
    message: string;
    time: string;
    img: string;
    read: boolean;
}

interface NotificationModalProps {
    open: boolean;
    onClose: () => void;
    notification: Notification | null;
    onMarkRead?: () => void;
}

export default function NotificationModal({
    open,
    onClose,
    notification,
    onMarkRead
}: NotificationModalProps) {
    if (!open || !notification) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 relative transform transition-all scale-100 animate-scale-up">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
                >
                    <FaTimes className="text-xl" />
                </button>

                <div className="flex flex-col items-center text-center mt-4">
                    <div className="relative">
                        <img
                            src={notification.img}
                            alt={notification.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-purple-50"
                        />
                        <div className="absolute bottom-0 right-0 bg-[#8D6BDC] text-white p-1.5 rounded-full border-2 border-white">
                            <FaBell className="text-xs" />
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-800 mt-4">{notification.name}</h2>
                    <p className="text-sm text-gray-400 font-medium mb-6">{notification.time}</p>

                    <div className="bg-gray-50 p-4 rounded-xl w-full text-left">
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {notification.message}
                        </p>
                    </div>

                    {!notification.read && onMarkRead && (
                        <button
                            onClick={() => {
                                onMarkRead();
                                onClose();
                            }}
                            className="mt-6 flex items-center justify-center gap-2 text-[#8D6BDC] font-semibold hover:bg-purple-50 px-6 py-2 rounded-full transition w-full"
                        >
                            <FaCheckDouble /> Mark as Read
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="mt-2 w-full text-gray-400 hover:text-gray-600 py-2 text-sm font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
