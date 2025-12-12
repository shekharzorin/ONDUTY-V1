"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Stats from "../components/Stats";
import Header from "../components/Header";
import ActivityCard from "../components/ActivityCard";
import ActivityModal from "../components/ActivityModal";
import NotificationDrawer from "../components/NotificationDrawer";
import NotificationModal from "../components/NotificationModal";
import { FaUserShield, FaVolumeUp } from "react-icons/fa";

// Interfaces
interface Activity {
  id: string;
  type: string;
  employeeName: string;
  employeeImage: string;
  title: string;
  time: string;
  status: string;
}

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  employeesOnLeave: number;
  totalClients: number;
}

interface Notification {
  name: string;
  message: string;
  time: string;
  img: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { name: "System", message: "Welcome to Admin V2", time: "Just now", img: "https://ui-avatars.com/api/?name=System&background=8D6BDC&color=fff", read: false },
];

export default function DashboardPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    employeesOnLeave: 0,
    totalClients: 0
  });
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [userRole, setUserRole] = useState<"Admin" | "Employee">("Admin");
  const [loading, setLoading] = useState(true);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setActivities(data.activities);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        <Header
          onBellClick={() => setOpenDrawer(true)}
          unreadCount={unreadCount}
          userRole={userRole}
        />

        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Team Activity</h1>
              <p className="text-gray-500 mt-1">Real-time overview of your organization.</p>
            </div>
          </div>

          {/* Real Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium">Total Employees</h3>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.totalEmployees}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium">On Duty</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">{stats.activeEmployees}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium">On Leave</h3>
              <p className="text-2xl font-bold text-orange-500 mt-2">{stats.employeesOnLeave}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium">Total Clients</h3>
              <p className="text-2xl font-bold text-purple-600 mt-2">{stats.totalClients}</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <p className="text-gray-400">Loading activities...</p>
            ) : activities.length > 0 ? (
              activities.map((act) => (
                <ActivityCard
                  key={act.id}
                  name={act.employeeName}
                  type={act.title} // Reusing 'type' for activity title
                  img={act.employeeImage || "https://ui-avatars.com/api/?name=User"}
                  onClick={() => { }} // No modal for now
                />
              ))
            ) : (
              <p className="col-span-full text-gray-400">No recent activities.</p>
            )}
          </div>
        </div>
      </div>

      <NotificationDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        notifications={notifications}
        setNotifications={setNotifications}
        onMarkAllRead={() => { }}
        onSelect={() => { }}
      />
    </div>
  );
}
