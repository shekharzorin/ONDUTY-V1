"use client";

import { FaTimes, FaBell, FaTrash, FaCheckDouble } from "react-icons/fa";

interface Notification {
    name: string;
    message: string;
    time: string;
    img: string;
    read: boolean;
}

interface NotificationDrawerProps {
    open: boolean;
    onClose: () => void;
    notifications: Notification[];
    setNotifications: (n: Notification[]) => void;
    onMarkAllRead: () => void;
    onSelect: (n: Notification) => void;
}

export default function NotificationDrawer({
    open,
    onClose,
    notifications,
    setNotifications,
    onMarkAllRead,
    onSelect,
}: NotificationDrawerProps) {
    return (
        <>
            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 backdrop-blur-[1px] transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 w-[380px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <FaBell className="text-xl text-[#8D6BDC]" />
                                {notifications.some(n => !n.read) && (
                                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8D6BDC]"></span>
                                    </span>
                                )}
                            </div>
                            <h2 className="text-lg font-bold text-gray-800">Notifications</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-50 transition"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {notifications.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <FaBell className="text-4xl mb-4 text-gray-200" />
                                <p>No new notifications</p>
                            </div>
                        ) : (
                            notifications.map((notif, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => onSelect(notif)}
                                    className={`p-4 rounded-xl shadow-sm border flex gap-4 transition cursor-pointer ${notif.read ? "bg-white border-gray-100 opacity-70" : "bg-white border-purple-100 ring-1 ring-purple-50"
                                        }`}
                                >
                                    <div className="relative">
                                        <img
                                            src={notif.img}
                                            alt={notif.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        {!notif.read && (
                                            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-[#8D6BDC] ring-2 ring-white"></span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className={`text-sm ${notif.read ? "font-semibold text-gray-700" : "font-bold text-gray-900"}`}>
                                                {notif.name}
                                            </h4>
                                            <span className="text-[10px] text-gray-400">{notif.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1 leading-relaxed line-clamp-2">
                                            {notif.message}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100 bg-white space-y-3">
                        <button
                            onClick={onMarkAllRead}
                            className="w-full py-3 flex items-center justify-center gap-2 bg-purple-50 text-[#8D6BDC] hover:bg-purple-100 rounded-xl transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={notifications.length === 0 || notifications.every(n => n.read)}
                        >
                            <FaCheckDouble className="text-xs" />
                            Mark all as read
                        </button>

                        <button
                            onClick={() => setNotifications([])}
                            className="w-full py-3 flex items-center justify-center gap-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={notifications.length === 0}
                        >
                            <FaTrash className="text-xs" />
                            Clear All
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
