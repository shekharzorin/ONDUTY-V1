"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import defaultProfile from "@/app/images/profile.webp";
import Header from "@/app/components/Header";
import {
  getProfileImage,
  fetchEmployeeProfilePhoto,
  getAdminDashboard,
  fetchEmployeeProfileMeta,
  getNotifications,
  getAdminClients,
  deleteNotification,
  clearAllNotifications,
  approveOrDeclineClient,
  adminGetVisits,
  getMapConfig,
} from "@/app/backend-api/api";
import DashboardCard from "@/app/components/Dashboardcard";
import {
  FaHandshake,
  FaUsers,
  FaUsersSlash,
  FaBriefcase,
  FaTrash,
  FaBell,
} from "react-icons/fa";
import { RiFileList3Fill } from "react-icons/ri";
import Gobtn from "@/app/components/Gobtn";
import Button from "@/app/components/Button";
import Crossicon from "@/app/components/Crossicon";
import Deletebtn from "@/app/components/Deletebtn";

type EmployeeActivity = {
  name: string;
  email: string;
  type: string;
  clientName?: string;
  checkInTime?: string;
  checkOutTime?: string;
  clockInTime?: string;
  clockOutTime?: string;
  profilePic?: string | null;
  date?: string;
};

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [profileImage, setProfileImage] = useState(defaultProfile);
  const [openEmpModal, setOpenEmpModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeActivity | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [todayClockInCount, setTodayClockInCount] = useState(0);
  const [employeesOnLeave, setEmployeesOnLeave] = useState(0);
  const [todayActivities, setTodayActivities] = useState<EmployeeActivity[]>(
    [],
  );
  const [notifications, setNotifications] = useState<any[]>([]);
  const [openNotificationModal, setOpenNotificationModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [totalTasksAllEmployees, setTotalTasksAllEmployees] = useState(0);
  const [totalClients, setTotalClients] = useState(0);

  const [mapEnabled, setMapEnabled] = useState(false);
  const [mapKey, setMapKey] = useState<string | null>(null);

  const formatType = (type: string) => {
    switch (type) {
      case "clock-in":
        return "Clock In";
      case "clock-out":
        return "Clock Out";
      case "client-check-in":
        return "Check In";
      case "client-check-out":
        return "Check Out";
      default:
        return type;
    }
  };

  useEffect(() => {
    const loadConfig = async () => {
      const config = await getMapConfig();

      if (config.success) {
        setMapEnabled(config.mapEnabled);
        setMapKey(config.webMapKey);
      }

      setLoading(false);
    };

    loadConfig();
  }, []);

  if (loading) {
    return <p>Loading map configuration…</p>;
  }

  if (!mapEnabled) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-lg font-semibold text-red-500">
          Map disabled by admin
        </p>
      </div>
    );
  }
  /* ---------------- LOAD LOGGED-IN ADMIN PROFILE IMAGE ---------------- */
  useEffect(() => {
    const loadImage = async () => {
      const img = await getProfileImage();
      if (img) setProfileImage(img as any);
    };
    loadImage();
    window.addEventListener("focus", loadImage);
    return () => window.removeEventListener("focus", loadImage);
  }, []);

  /* ---------------- LOAD DASHBOARD + EMPLOYEE DATA ---------------- */
  const metaCache: Record<string, any> = {};
  const photoCache: Record<string, any> = {};

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const data = await getAdminDashboard();
      if (!data?.success) return;

      const total = data.totalEmployees || 0;
      const clockedIn = data.todayClockInCount || 0;

      setTotalEmployees(total);
      setTodayClockInCount(clockedIn);
      setEmployeesOnLeave(total - clockedIn);

      if (!Array.isArray(data.activities)) {
        setTodayActivities([]);
        return;
      }

      const today = new Date().toISOString().split("T")[0];
      const todayGroup = data.activities.find((g: any) => g._id === today);

      if (!todayGroup?.activities?.length) {
        setTodayActivities([]);
        return;
      }

      const activities = todayGroup.activities;

      /* ---------------------------------------------
         ✅ STEP 1: UNIQUE EMPLOYEE EMAILS
      --------------------------------------------- */
      const uniqueEmails = [
        ...new Set(activities.map((a: any) => a.employeeEmail)),
      ];

      /* ---------------------------------------------
         ✅ STEP 2: FETCH META + PHOTO IN PARALLEL
      --------------------------------------------- */
      const [metaResults, photoResults] = await Promise.all([
        Promise.all(
          uniqueEmails.map(async (email) => ({
            email,
            meta: await fetchEmployeeProfileMeta(email as any),
          })),
        ),
        Promise.all(
          uniqueEmails.map(async (email) => ({
            email,
            photo: await fetchEmployeeProfilePhoto(email as any),
          })),
        ),
      ]);

      /* ---------------------------------------------
         ✅ STEP 3: BUILD LOOKUP MAPS
      --------------------------------------------- */
      const metaMap: Record<string, any> = {};
      const photoMap: Record<string, any> = {};

      metaResults.forEach((m) => (metaMap[m.email as any] = m.meta));
      photoResults.forEach((p) => (photoMap[p.email as any] = p.photo));

      /* ---------------------------------------------
         ✅ STEP 4: BUILD UI DATA (INSTANT)
      --------------------------------------------- */
      const finalActivities = activities.map((act: any) => ({
        email: act.employeeEmail,
        name:
          metaMap[act.employeeEmail]?.profile?.name ||
          act.employeeName ||
          "Unknown",
        profilePic: photoMap[act.employeeEmail] || null,
        type: act.type,
        clientName: act.clientName || "Unknown Client",
        checkInTime: act.clientCheckInTime || "",
        checkOutTime: act.clientCheckOutTime || "",
        clockInTime: act.clockInTime || "",
        clockOutTime: act.clockOutTime || "",
        date: today,
      }));

      setTodayActivities(finalActivities);
    } catch (err) {
      console.error("❌ Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalTasksAllEmployees = useCallback(
    async (setTotalTasksAllEmployees: (value: number) => void) => {
      try {
        const data = await adminGetVisits(); // no email → all employees

        console.log("📊 Total tasks (all employees):", data?.totalVisits);

        setTotalTasksAllEmployees(data?.totalVisits || 0);
      } catch (err) {
        console.error("❌ Error fetching total tasks:", err);
        setTotalTasksAllEmployees(0);
      }
    },
    [],
  );

  /* -------------------Notifications ------------------------ */

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();

      if (!data.success || !Array.isArray(data.notifications)) {
        setNotifications([]);
        return;
      }

      const notes = data.notifications;

      const emails = [
        ...new Set(notes.map((n: any) => n.employeeEmail).filter(Boolean)),
      ];

      await Promise.all(
        emails.map(async (email) => {
          if (!photoCache[email as any]) {
            photoCache[email as any] = await fetchEmployeeProfilePhoto(
              email as any,
            );
          }
        }),
      );

      const finalNotes = notes.map((note: any) => ({
        ...note,
        profilePic: photoCache[note.employeeEmail] || null,
      }));

      setNotifications(finalNotes);
    } catch (err) {
      console.error("❌ Error fetching notifications:", err);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("❌ Error deleting notification:", err);
    }
  };

  const handleClearAll = async () => {
    const ok = confirm("Are you sure you want to clear all notifications?");
    if (!ok) return;

    try {
      await clearAllNotifications();
      setNotifications([]);
    } catch (err) {
      console.error("❌ Error clearing notifications:", err);
    }
  };

  const handleApproveDecline = async (action: "approve" | "decline") => {
    if (!selectedClient?._id) return;

    const ok = confirm(`Are you sure you want to ${action} this client?`);
    if (!ok) return;

    try {
      const approved = action === "approve";
      const res = await approveOrDeclineClient(selectedClient._id, approved);

      if (res?.success) {
        setNotifications((prev) =>
          prev.filter((n) => n._id !== selectedClient._id),
        );
      } else {
        alert(res?.message || "Something went wrong");
      }
    } catch (err: any) {
      alert(err.message || "Failed to process request");
    } finally {
      setSelectedClient(null);
    }
  };

  const reloadClients = async () => {
    const data = await getAdminClients();
    setTotalClients(data?.totalClients ?? 0);
  };

  /* ---------------- CALL DASHBOARD LOADER ---------------- */
  useEffect(() => {
    loadDashboardData();
    fetchNotifications();
    reloadClients();
    fetchTotalTasksAllEmployees(setTotalTasksAllEmployees);
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-(--color-primary)">
      {/* ------------------ TOP HEADER ------------------ */}
      <div className="flex h-[100px] w-full p-4 justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex justify-between w-[75px] h-[75px] overflow-hidden rounded-2xl relative">
            <Image
              src={profileImage}
              alt="Profile"
              width={60}
              height={60}
              className="w-full h-full object-cover"
            />
            <div className="flex bg-red-500 absolute top-12.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full text-(--color-sidebar) text-[12px]">
              Admin
            </div>
          </div>
          <div className="text-(--color-sidebar) gap-2.5 flex flex-col">
            <p className="font-bold text-2xl">Welcome</p>
            <p className="font-semibold">Let’s start today’s work</p>
          </div>
        </div>
        <div
          className="mr-5 relative bg-(--color-sidebar) p-3 rounded-full hover:cursor-pointer hover:shadow-lg"
          onClick={() => {
            fetchNotifications();
            setOpenModal(true);
          }}
        >
          <FaBell className="text-(--color-primary)" size={30} />
          {notifications.length > 0 && (
            <span className="absolute -top-0.5 right-1 w-3.5 h-3.5 bg-red-600 rounded-full animate-pulse"></span>
          )}
        </div>
      </div>

      {/* ------------------ MAIN CONTENT ------------------ */}
      <div className="flex flex-col bg-(--color-bg) w-full flex-1 overflow-y-auto rounded-t-4xl p-2.5 gap-5">
        {/* DASHBOARD CARDS */}
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-2.5">
          <DashboardCard
            title="Total Number of Employee Count"
            value={totalEmployees}
            icon={<FaUsers size={40} />}
          />
          <DashboardCard
            title="Employees On Work Count"
            value={todayClockInCount}
            icon={<FaBriefcase size={32} />}
          />
          <DashboardCard
            title="Employees On Leave Count"
            value={employeesOnLeave}
            icon={<FaUsersSlash size={40} />}
          />
          <DashboardCard
            title="Total Task Assigned Count"
            value={totalTasksAllEmployees}
            icon={<RiFileList3Fill size={35} />}
          />
          <DashboardCard
            title="Total Number of Client Count"
            value={totalClients}
            icon={<FaHandshake size={40} />}
          />
        </div>

        <p className="pl-5 text-[18px] font-semibold">Today's Activity</p>

        {/* EMPLOYEE CARDS */}
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-2.5 pb-2.5 pt-1.5">
          {todayActivities.length === 0 && (
            <p className="font-medium text-(--color-gray) ml-3">
              No activity yet...
            </p>
          )}

          {todayActivities.map((act, index) => (
            <div
              key={index}
              className="bg-(--color-sidebar) rounded-3xl p-4 shadow-lg hover:scale-105 transition hover:bg-gray-100"
            >
              <div className="flex justify-between w-[75px] h-[75px]">
                <Image
                  src={act.profilePic || defaultProfile}
                  alt="Employee profile"
                  width={75}
                  height={75}
                  className="rounded-xl  object-cover"
                />
              </div>

              <p className="mt-4 text-[18px] font-semibold">{act.name}</p>

              <div className="flex justify-between items-center">
                <div>
                  <p className="mt-1 font-medium text-(--color-gray)">
                    {formatType(act.type)}
                  </p>
                  {act.type === "clock-in" && (
                    <p className="mt-1 font-medium text-(--color-gray)">
                      {act.clockInTime}
                    </p>
                  )}
                  {act.type === "clock-out" && (
                    <p className="mt-1 font-medium text-(--color-gray)">
                      {act.clockOutTime}
                    </p>
                  )}
                  {act.type === "client-check-in" && (
                    <p className="mt-1 font-medium text-(--color-gray)">
                      {act.checkInTime}
                    </p>
                  )}
                  {act.type === "client-check-out" && (
                    <p className="mt-1 font-medium text-(--color-gray)">
                      {act.checkOutTime}
                    </p>
                  )}
                </div>

                <div className="mt-2">
                  <Gobtn
                    onClick={() => {
                      setSelectedEmployee(act);
                      setOpenEmpModal(true);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* EMPLOYEE POPUP */}
        {openEmpModal && selectedEmployee && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-(--color-sidebar) p-5 rounded-4xl w-[400px] shadow-xl animate-fade-in">
              <div className="flex justify-between w-[140px] h-[140px]">
                <Image
                  src={selectedEmployee.profilePic || defaultProfile}
                  alt="Employee profile"
                  width={140}
                  height={140}
                  className="rounded-xl object-cover"
                />
              </div>

              <p className="mt-6 text-[18px] font-semibold ">
                {selectedEmployee.name}
              </p>
              <p className="mt-2 font-medium text-(--color-gray) capitalize">
                Type : {selectedEmployee.type}
              </p>
              {selectedEmployee.type === "clock-in" && (
                <p className="mt-2 font-medium text-(--color-gray)">
                  Clock In At : {selectedEmployee.clockInTime}
                </p>
              )}
              {selectedEmployee.type === "clock-out" && (
                <p className="mt-2 font-medium text-(--color-gray)">
                  Clock Out At : {selectedEmployee.clockOutTime}
                </p>
              )}
              {(selectedEmployee?.type === "client-check-in" ||
                selectedEmployee?.type === "client-check-out") &&
                selectedEmployee?.clientName && (
                  <p className="mt-2 font-medium text-(--color-gray)">
                    {" "}
                    Client Name : {selectedEmployee.clientName}
                  </p>
                )}
              {selectedEmployee.type === "client-check-in" && (
                <p className="mt-2 font-medium text-(--color-gray)">
                  Client Check In At : {selectedEmployee.checkInTime}
                </p>
              )}
              {selectedEmployee.type === "client-check-out" && (
                <p className="mt-2 font-medium text-(--color-gray)">
                  Client Check Out At : {selectedEmployee.checkOutTime}
                </p>
              )}
              {selectedEmployee?.date && (
                <p className="mt-2 font-medium text-(--color-gray)">
                  Date : {selectedEmployee.date}
                </p>
              )}

              <div className="mt-6">
                <Button title="Close" onClick={() => setOpenEmpModal(false)} />
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATION MODAL */}
        {openModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end">
            <div className="w-[35%] h-full bg-(--color-sidebar) shadow-2xl animate-slide-left">
              <Header
                title={"Notifications"}
                onClick={() => setOpenModal(false)}
              />

              <div className="px-5">
                {notifications.length > 0 && (
                  <button
                    className="text-red-500 mb-4 cursor-pointer font-medium"
                    onClick={handleClearAll}
                  >
                    Clear All
                  </button>
                )}

                <div className="flex flex-col gap-4 overflow-y-auto h-[calc(100vh-160px)] pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-gray-500 text-center">
                      No notifications yet.
                    </p>
                  ) : (
                    notifications.map((note) => (
                      <div
                        key={note._id}
                        className="flex justify-between items-center p-4 bg-(--color-bg) rounded-3xl"
                      >
                        <div className="flex gap-4">
                          <div className="relative w-[75px] h-[75px]">
                            <Image
                              src={note.profilePic || "/profile.webp"}
                              alt="Profile"
                              fill
                              className="rounded-2xl object-cover"
                            />
                          </div>

                          <div>
                            {note.employeeName && (
                              <p className="text-[18px] font-semibold ">
                                {note.employeeName}
                              </p>
                            )}
                            <p className="font-medium text-(--color-gray) capitalize">
                              {note.type.replace(/-/g, " ")}
                            </p>
                            <p className="font-medium text-(--color-gray)">
                              {note.date} - {note.time}
                            </p>
                          </div>
                        </div>

                        {note.type === "client-pending" ? (
                          <div>
                            <Button
                              title="View"
                              onClick={() => {
                                setSelectedClient(note);
                                setOpenNotificationModal(true);
                              }}
                            />
                          </div>
                        ) : (
                          <Deletebtn
                            onClick={() => handleDeleteNotification(note._id)}
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CLIENT MODAL */}
        {openNotificationModal && selectedClient && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white w-[420px] rounded-4xl p-6 shadow-2xl animate-fade-in relative">
              <div className="relative w-full h-[200px] rounded-2xl overflow-hidden">
                <Image
                  src={
                    selectedClient?.clientData?.image?.data
                      ? `data:${selectedClient.clientData.image.contentType};base64,${selectedClient.clientData.image.data}`
                      : "/org.png"
                  }
                  alt="Client"
                  fill
                  className="object-cover"
                />
              </div>

              <p className="mt-6 text-[18px] font-semibold mb-2">
                Client Name :{" "}
                {selectedClient?.clientData?.name || "Unknown Client"}
              </p>
              <p className="mt-2 font-medium text-(--color-gray)">
                Address : {selectedClient?.clientData?.address || "N/A"}
              </p>
              <p className="mt-2 font-medium text-(--color-gray)">
                Number : {selectedClient?.clientData?.clientNumber || "N/A"}
              </p>

              <div className="flex gap-4 mt-6">
                <Button
                  title="Approve"
                  onClick={() => handleApproveDecline("approve")}
                />
                <Button
                  title="Decline"
                  onClick={() => handleApproveDecline("decline")}
                />
              </div>

              <div className="flexa absolute top-4 right-4">
                <Crossicon onClick={() => setOpenNotificationModal(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
