import { prisma } from '../../lib/db';
import Sidebar from '../../components/Sidebar';
import ProfileActions from '../../components/ProfileActions';
import { FaPhone, FaEnvelope, FaBriefcase, FaUserCircle } from 'react-icons/fa';

async function getEmployee(id: string) {
    return await prisma.employee.findUnique({
        where: { id },
        include: {
            attendance: {
                orderBy: { createdAt: 'desc' },
                take: 5
            },
            requests: {
                orderBy: { createdAt: 'desc' },
                take: 5
            }
        }
    });
}

export default async function EmployeeProfile({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const employee = await getEmployee(id);

    if (!employee) {
        return <div>Employee not found</div>;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar />
            <div className="flex-1 ml-64 overflow-y-auto">
                {/* Cover / Header */}
                <div className="h-48 bg-gradient-to-r from-purple-600 to-indigo-600 relative">
                    <div className="absolute -bottom-16 left-8 flex items-end">
                        <img
                            src={employee.image || "https://ui-avatars.com/api/?name=" + employee.firstName}
                            alt={employee.firstName}
                            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                        />
                        <div className="mb-4 ml-4">
                            <h1 className="text-3xl font-bold text-white shadow-sm">{employee.firstName} {employee.lastName}</h1>
                            <p className="text-white/80">{employee.position}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-20 px-8 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Details */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="font-bold text-gray-800 mb-4">Contact Info</h2>
                            <div className="space-y-4 text-sm">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <FaPhone className="text-purple-500" />
                                    {employee.contact || "N/A"}
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <FaEnvelope className="text-purple-500" />
                                    {employee.email}
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <FaBriefcase className="text-purple-500" />
                                    {employee.department || "General"}
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <FaUserCircle className="text-purple-500" />
                                    Status: <span className={`font - semibold ${employee.status === 'ON_DUTY' ? 'text-green-600' : 'text-gray-600'} `}>{employee.status}</span>
                                </div>
                            </div>

                            <ProfileActions id={employee.id} isActive={employee.isActive} status={employee.status} />
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="font-bold text-gray-800 mb-4">Performance</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-purple-50 rounded-lg text-center">
                                    <p className="text-xs text-gray-500">Tasks</p>
                                    <p className="font-bold text-purple-700 text-lg">12</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg text-center">
                                    <p className="text-xs text-gray-500">Attendance</p>
                                    <p className="font-bold text-green-700 text-lg">95%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Activity & Timeline */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Recent Attendance */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="font-bold text-gray-800 mb-4">Recent Attendance</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500">
                                        <tr>
                                            <th className="p-3 rounded-l-lg">Date</th>
                                            <th className="p-3">Clock In</th>
                                            <th className="p-3">Clock Out</th>
                                            <th className="p-3 rounded-r-lg">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employee.attendance.length > 0 ? employee.attendance.map(att => (
                                            <tr key={att.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                                <td className="p-3 font-medium text-gray-700">{new Date(att.date).toLocaleDateString()}</td>
                                                <td className="p-3 text-gray-600">{att.clockIn ? new Date(att.clockIn).toLocaleTimeString() : '-'}</td>
                                                <td className="p-3 text-gray-600">{att.clockOut ? new Date(att.clockOut).toLocaleTimeString() : '-'}</td>
                                                <td className="p-3">
                                                    <span className={`px - 2 py - 1 rounded - full text - xs font - semibold ${att.status === 'PRESENT' ? 'bg-green-100 text-green-700' :
                                                        att.status === 'ABSENT' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                        } `}>
                                                        {att.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={4} className="p-4 text-center text-gray-400">No attendance records found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Client Requests History */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="font-bold text-gray-800 mb-4">Client Requests</h2>
                            <div className="space-y-4">
                                {employee.requests.length > 0 ? employee.requests.map(req => (
                                    <div key={req.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                        <div>
                                            <h4 className="font-medium text-gray-800 text-sm">{req.clientName || "Existing Client"}</h4>
                                            <p className="text-xs text-gray-500">{req.reason}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px - 2 py - 0.5 rounded text - xs font - bold ${req.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                                                req.status === 'REJECTED' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                                                } `}>{req.status}</span>
                                            <p className="text-[10px] text-gray-400 mt-1">{new Date(req.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-gray-400 text-sm">No client requests found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
