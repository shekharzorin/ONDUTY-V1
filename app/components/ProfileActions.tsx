"use client";

import { useState } from "react";
import { FaBan, FaTrash, FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface ProfileActionsProps {
    id: string;
    isActive: boolean;
    status: string;
}

export default function ProfileActions({ id, isActive, status }: ProfileActionsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [currentActive, setCurrentActive] = useState(isActive);

    const handleBlockToggle = async () => {
        if (!confirm(`Are you sure you want to ${currentActive ? 'block' : 'unblock'} this employee?`)) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/employees/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentActive })
            });

            if (res.ok) {
                setCurrentActive(!currentActive);
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to PERMANENTLY delete this employee? This cannot be undone.")) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/employees/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                router.push('/employees');
            } else {
                alert("Failed to delete employee. Check dependencies.");
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting employee");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2 mt-4">
            <button
                onClick={handleBlockToggle}
                disabled={loading}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition ${currentActive
                        ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border border-yellow-200"
                        : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                    }`}
            >
                {currentActive ? <><FaBan /> Block Access</> : <><FaCheckCircle /> Unblock Access</>}
            </button>
            <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition"
            >
                <FaTrash /> Delete
            </button>
        </div>
    );
}
