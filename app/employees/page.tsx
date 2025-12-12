"use client";

import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import Link from 'next/link';
import EmployeeFormModal from '../components/EmployeeFormModal';

interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
    department: string | null;
    status: string;
    image: string | null;
}

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/employees');
            const data = await res.json();
            setEmployees(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const filteredEmployees = employees.filter(emp => {
        const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
        return fullName.includes(search.toLowerCase()) ||
            emp.position.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <div className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0">
                    <h1 className="text-xl font-bold text-gray-800">Employees</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition"
                        >
                            <FaPlus /> Add Employee
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="text-gray-400 text-center mt-10">Loading employees...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredEmployees.map(emp => (
                                <Link href={`/employees/${emp.id}`} key={emp.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="relative">
                                            <img
                                                src={emp.image || `https://ui-avatars.com/api/?name=${emp.firstName}`}
                                                alt={emp.firstName}
                                                className="w-20 h-20 rounded-full object-cover mb-4 group-hover:scale-105 transition"
                                            />
                                            <span className={`absolute bottom-4 right-1 w-3 h-3 rounded-full border-2 border-white ${emp.status === 'ON_DUTY' ? 'bg-green-500' :
                                                emp.status === 'OFF_DUTY' ? 'bg-gray-400' : 'bg-orange-500'
                                                }`} />
                                        </div>
                                        <h3 className="font-bold text-gray-900">{emp.firstName} {emp.lastName}</h3>
                                        <p className="text-sm text-purple-600 font-medium mb-1">{emp.position}</p>
                                        <p className="text-xs text-gray-500">{emp.department || 'General'}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <EmployeeFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchEmployees}
                />
            </div>
        </div>
    );
}
