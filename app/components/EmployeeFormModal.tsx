"use client";

import { useState } from "react";
import { FaTimes, FaCamera } from "react-icons/fa";

interface EmployeeFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EmployeeFormModal({ isOpen, onClose, onSuccess }: EmployeeFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        position: "",
        department: "Engineering",
        contact: "",
        image: ""
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Mock API call or real one if we implement POST
            // We haven't implemented POST /api/employees yet, let's assume we will or mock it.
            // I'll create the POST handler in /api/employees/route.ts next.
            const res = await fetch("/api/employees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                alert("Failed to create employee");
            }
        } catch (error) {
            console.error(error);
            alert("Error creating employee");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-2xl p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200 mx-4">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
                >
                    <FaTimes />
                </button>

                <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Employee</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1 space-y-1">
                            <label className="text-xs font-semibold text-gray-500">First Name</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                                value={formData.firstName}
                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>
                        <div className="flex-1 space-y-1">
                            <label className="text-xs font-semibold text-gray-500">Last Name</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                                value={formData.lastName}
                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500">Email Address</label>
                        <input
                            required
                            type="email"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 space-y-1">
                            <label className="text-xs font-semibold text-gray-500">Position</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                                value={formData.position}
                                onChange={e => setFormData({ ...formData, position: e.target.value })}
                            />
                        </div>
                        <div className="flex-1 space-y-1">
                            <label className="text-xs font-semibold text-gray-500">Department</label>
                            <select
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                                value={formData.department}
                                onChange={e => setFormData({ ...formData, department: e.target.value })}
                            >
                                <option>Engineering</option>
                                <option>Design</option>
                                <option>Product</option>
                                <option>HR</option>
                                <option>Marketing</option>
                                <option>Sales</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500">Image URL (Optional)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="https://..."
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                                value={formData.image}
                                onChange={e => setFormData({ ...formData, image: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl mt-4 transition flex items-center justify-center gap-2"
                    >
                        {loading ? "Creating..." : "Create Employee"}
                    </button>
                </form>

            </div>
        </div>
    );
}
