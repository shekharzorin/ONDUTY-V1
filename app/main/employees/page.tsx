"use client";

import {
  getAdminDashboard, adminGetEmployees, fetchEmployeeProfilePhoto, fetchEmployeeProfileMeta, adminAddEmployee,
  adminDeleteEmployee, getEmployeeLiveLocation, getEmployeeLocationHistory, adminGetVisits, getVisitImage
} from "@/app/backend-api/api";
import Button from "@/app/components/Button";
import DashboardCard from "@/app/components/Dashboardcard";
import Gobtn from "@/app/components/Gobtn";
import Searchbar from "@/app/components/Searchbar";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { BsFillCaretDownFill } from "react-icons/bs";
import { FaBriefcase, FaUser, FaUsers, FaUsersSlash } from "react-icons/fa";
import { MdCheckCircle, MdLock } from "react-icons/md";
import defaultProfile from "@/app/images/profile.webp";
import Crossicon from "@/app/components/Crossicon";
import InputBox from "@/app/components/Inputbox";
import { TbMailFilled } from "react-icons/tb";
import emp from "@/app/images/emp.png"
import socket from "@/app/main/services/socket"; // adjust path if needed
import dynamic from "next/dynamic";

const MapComp = dynamic(
  () => import("@/app/main/services/MapComp"),
  { ssr: false }
);

const LeafletMap = dynamic(
  () => import("@/app/main/services/LeafletMap"),
  { ssr: false }
);

/* -------------------- Types -------------------- */

type EmployeeActivity = {
  type?: string;
  clientName?: string;
  clientCheckInTime?: string;
  clientCheckOutTime?: string;
  clockInTime?: string;
  clockOutTime?: string;
  date?: string;
  employeeEmail?: string;
  employeeName?: string;
  status?: string;
  workedHours?: string;
  createdAt: string;
};

type Employee = {
  name: string;
  email: string;
  mobile?: string;
  profilePic: string | null;
  date?: string;
  clockInTime?: string;
  clockOutTime?: string;
  clientCheckInTime?: string;
  clientCheckOutTime?: string;
  lastUpdateTime?: string;
  status?: string;
  workedHours?: string;
  totalTasks?: number;
  completedTasks?: number;
  liveLat?: number;
  liveLng?: number;
};

const getTodayDateString = () => {
  const now = new Date();
  return now.toISOString().split("T")[0]; // YYYY-MM-DD
};

/* ==================== PAGE ==================== */
const Page = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [todayClockInCount, setTodayClockInCount] = useState(0);
  const [employeesOnLeave, setEmployeesOnLeave] = useState(0);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const options = ["All Status", "Active", "Inactive"];
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [openAddEmployeeModal, setOpenAddEmployeeModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [openTrackModal, setOpenTrackModal] = useState(false);
  const [trackingEmployee, setTrackingEmployee] = useState<Employee | null>(null);
  const [liveLocationsMap, setLiveLocationsMap] = useState<Record<string, { latitude: number; longitude: number }>>({});
  const [groupedHistory, setGroupedHistory] = useState<Record<string, any[]>>({});
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [employeeVisits, setEmployeeVisits] = useState<{ _id: string; taskName: string; type?: string; notes?: string; status?: string; date?: string; }[]>([]);
  const [visitImages, setVisitImages] = useState<Record<string, string>>({});
  const [totalVisitCount, setTotalVisitCount] = useState(0);
  const [completedVisits, setCompletedVisits] = useState(0);
  const [totalTasksAllEmployees, setTotalTasksAllEmployees] = useState(0);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* -------------------- Time Formatter -------------------- */
  const formatTime = (value?: string) => {
    if (!value) return "";
    if (/^\d{1,2}:\d{2}(\s?[APap][Mm])?$/.test(value)) return value;

    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;
    }
    return value;
  };

  /* -------------------- MAIN DASHBOARD LOADER -------------------- */
  const loadDashboardAndEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const [empRes, dash] = await Promise.all([
        adminGetEmployees(),
        getAdminDashboard(),
      ]);

      if (!empRes?.success || !dash?.success) {
        setEmployees([]);
        return;
      }

      setTotalEmployees(dash.totalEmployees || 0);
      setTodayClockInCount(dash.todayClockInCount || 0);
      setEmployeesOnLeave(
        (dash.totalEmployees || 0) - (dash.todayClockInCount || 0)
      );

      const today = getTodayDateString();

      const allActivities: EmployeeActivity[] =
        dash.activities
          ?.filter((g: any) => g._id === today) // 🔥 ONLY TODAY GROUP
          .flatMap((g: any) => g.activities) || [];


      const enriched: Employee[] = await Promise.all(
        empRes.employees.map(async (emp: any) => {
          const [profilePic, meta] = await Promise.all([
            fetchEmployeeProfilePhoto(emp.email),
            fetchEmployeeProfileMeta(emp.email),
          ]);

          const empActivities = allActivities
            .filter(a => a.employeeEmail === emp.email)
            .sort(
              (a, b) =>
                new Date(b.createdAt!).getTime() -
                new Date(a.createdAt!).getTime()
            );

          const latest = empActivities[0];

          /* 🔥 CORRECT STATUS LOGIC */
          const lastClockIn = empActivities.find(a => a.type === "clock-in");
          const lastClockOut = empActivities.find(a => a.type === "clock-out");

          const isActive =
            lastClockIn &&
            (!lastClockOut ||
              new Date(lastClockIn.createdAt!).getTime() >
              new Date(lastClockOut.createdAt!).getTime());

          return {
            name: emp.name,
            email: emp.email,
            mobile: meta?.profile?.mobile || "N/A",
            profilePic,

            clockInTime: latest?.clockInTime
              ? formatTime(latest.clockInTime)
              : "",

            clockOutTime: latest?.clockOutTime
              ? formatTime(latest.clockOutTime)
              : "",

            clientCheckInTime: latest?.clientCheckInTime
              ? formatTime(latest.clientCheckInTime)
              : "",

            clientCheckOutTime: latest?.clientCheckOutTime
              ? formatTime(latest.clientCheckOutTime)
              : "",

            lastUpdateTime: latest
              ? formatTime(
                latest.clockOutTime ||
                latest.clientCheckOutTime ||
                latest.clockInTime ||
                latest.clientCheckInTime
              )
              : "N/A",

            status: isActive ? "Active" : "Inactive",
            workedHours: latest?.workedHours,
          };
        })
      );

      setEmployees(enriched);
    } catch (err) {
      console.error("❌ Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);



  const fetchEmployeeVisits = useCallback(
    async (empEmail: string) => {
      console.log("🚀 fetchEmployeeVisits called with:", empEmail);

      try {
        const data = await adminGetVisits(empEmail);

        console.log("📦 Raw API response (adminGetVisits):", data);

        const visits = data?.visits || [];
        console.log("📋 Visits array:", visits);
        console.log("📊 Visits count:", visits.length);

        console.log("✅ Total Visits:", data?.totalVisits);
        console.log("✅ Completed Visits:", data?.completed);

        setEmployeeVisits(visits);
        setTotalVisitCount(data?.totalVisits || 0);
        setCompletedVisits(data?.completed || 0);

        /* ------------------------------------------
           Fetch visit images in parallel
        ------------------------------------------ */
        const images: Record<string, string> = {};
        console.log("🖼️ Starting visit image fetch...");

        await Promise.all(
          visits.map(async (visit: any, index: number) => {
            if (!visit?._id) {
              console.warn(`⚠️ Visit at index ${index} has no _id`, visit);
              return;
            }

            console.log(`➡️ Fetching image for visit ID: ${visit._id}`);

            try {
              const imgBase64 = await getVisitImage(visit._id);

              if (imgBase64) {
                images[visit._id] = imgBase64;
                console.log(
                  `✅ Image fetched for visit ${visit._id} (length: ${imgBase64.length})`
                );
              } else {
                console.warn(`⚠️ No image returned for visit ${visit._id}`);
              }
            } catch (err) {
              console.warn(
                `❌ Error fetching image for visit ${visit._id}:`,
                err
              );
            }
          })
        );

        console.log("🧩 Final visitImages object:", images);
        console.log("🧮 Total images fetched:", Object.keys(images).length);

        // ✅ Single state update
        setVisitImages(images);

        console.log("🎉 fetchEmployeeVisits completed successfully");

      } catch (err) {
        console.error("❌ Error fetching employee visits:", err);

        setEmployeeVisits([]);
        setTotalVisitCount(0);
        setCompletedVisits(0);
        setVisitImages({});
      }
    },
    []
  );


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
    []
  );

  useEffect(() => {
    fetchTotalTasksAllEmployees(setTotalTasksAllEmployees);
  }, [fetchTotalTasksAllEmployees]);


  useEffect(() => {
    if (!openImageModal || !selectedEmployee?.email) return;

    // 🔥 Fetch visits even if Track modal was never opened
    fetchEmployeeVisits(selectedEmployee.email);
  }, [openImageModal, selectedEmployee?.email, fetchEmployeeVisits]);



  /* -------------------- LOAD EMPLOYEE VISITS -------------------- */
  useEffect(() => {
    if (!openTrackModal || !trackingEmployee?.email) return;

    fetchEmployeeVisits(trackingEmployee.email);
  }, [openTrackModal, trackingEmployee?.email, fetchEmployeeVisits]);


  /* -------------------- EFFECT -------------------- */
  useEffect(() => {
    loadDashboardAndEmployees();
  }, [loadDashboardAndEmployees]);

  const filteredEmployees = employees
    .filter((emp) => {
      const q = searchText.toLowerCase();
      return (
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q)
      );
    })
    .filter((emp) => {
      if (statusFilter === "All Status") return true;
      return emp.status === statusFilter;
    });

  const handleAddEmployee = async () => {
    const { name, email, password } = form;
    if (!name || !email || !password) {
      alert("❌ Please fill all fields");
      return;
    }
    const normalizedPassword = password.trim();
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#&*.])[A-Za-z\d@#&*.]{6,}$/;

    if (!strongPasswordRegex.test(normalizedPassword)) {
      alert("❌ Weak Password\n\n" + "Password must be at least 6 characters and include:\n" + "- Uppercase letters\n" + "- Lowercase letters\n" + "- Numbers\n" + "- Special characters (@ # & * .)");
      return;
    }
    try {
      setLoading(true);
      const payload = { name: name.trim(), email: email.trim(), password: normalizedPassword, };
      const res = await adminAddEmployee(payload);
      if (!res.success) {
        alert(res.message || "Failed to add employee");
        return;
      }
      alert("✅ Employee added successfully");
      setForm({ name: "", email: "", password: "" });
      setOpenAddEmployeeModal(false);
      await loadDashboardAndEmployees();
    } catch (err: any) {
      console.error("❌ Error adding employee:", err);
      alert("❌ Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeEmail: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmed) return;
    try {
      setLoading(true);
      const res = await adminDeleteEmployee(employeeEmail);
      if (!res.success) {
        alert(res.message || "Failed to delete employee");
        return;
      }
      alert("✅ Employee deleted successfully");
      await loadDashboardAndEmployees();
      setOpenImageModal(false);
      setSelectedEmployee(null);
    } catch (err) {
      console.error("❌ Error deleting employee:", err);
      alert("❌ Failed to delete employee");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    // 🔌 Connection logs
    const onConnect = () => {
      console.log("🟢 Socket connected:", socket.id);
    };

    const onDisconnect = (reason: string) => {
      console.log("🔴 Socket disconnected:", reason);
    };

    const onConnectError = (err: any) => {
      console.error("❌ Socket connection error:", err.message || err);
    };

    // 📍 Location updates
    const handleLocationUpdate = (data: any) => {
      setLiveLocationsMap((prev) => ({
        ...prev,
        [data.employeeEmail]: {
          latitude: data.latitude,
          longitude: data.longitude,
        },
      }));
    };

    // ✅ Attach listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("locationUpdate", handleLocationUpdate);

    return () => {
      // 🧹 Cleanup listeners ONLY
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("locationUpdate", handleLocationUpdate);
    };
  }, []);



  useEffect(() => {
    if (!openTrackModal || !trackingEmployee) return;

    const loadInitial = async () => {
      const [live, history] = await Promise.all([
        getEmployeeLiveLocation(trackingEmployee.email),
        getEmployeeLocationHistory(trackingEmployee.email),
      ]);

      if (live?.latitude && live?.longitude) {
        setLiveLocationsMap((prev) => ({
          ...prev,
          [trackingEmployee.email]: {
            latitude: live.latitude,
            longitude: live.longitude,
          },
        }));
      }

      console.log("History points:", history);
    };

    loadInitial();
  }, [openTrackModal, trackingEmployee?.email]);

  const groupHistoryByDate = (history: any[]) =>
    history.reduce((acc: any, loc: any) => {
      const d = new Date(loc.timestamp).toLocaleDateString("en-GB");
      if (!acc[d]) acc[d] = [];
      acc[d].push(loc);
      return acc;
    }, {});

  useEffect(() => {
    if (!openTrackModal || !trackingEmployee) return;

    (async () => {
      const [live, history] = await Promise.all([
        getEmployeeLiveLocation(trackingEmployee.email),
        getEmployeeLocationHistory(trackingEmployee.email),
      ]);

      if (live?.latitude) {
        setLiveLocationsMap(prev => ({
          ...prev,
          [trackingEmployee.email]: {
            latitude: live.latitude,
            longitude: live.longitude,
          },
        }));
      }

      setGroupedHistory(groupHistoryByDate(history || []));
    })();
  }, [openTrackModal, trackingEmployee?.email]);

  useEffect(() => {
    if (!openTrackModal || !trackingEmployee) return;

    const loadHistory = async () => {
      const history = await getEmployeeLocationHistory(trackingEmployee.email);
      setGroupedHistory(groupHistoryByDate(history || []));
    };

    loadHistory();
  }, [openTrackModal, trackingEmployee?.email]);

  /* -------------------- MAP POINT -------------------- */

  const historyPoints =
    selectedDate && groupedHistory[selectedDate]
      ? groupedHistory[selectedDate]
      : null;

  const mapPoint = historyPoints
    ? historyPoints[historyPoints.length - 1]
    : trackingEmployee
      ? liveLocationsMap[trackingEmployee.email]
      : null;

  /* -------------------- UI -------------------- */
  return (
    <div className="flex flex-col p-2.5 gap-5 h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="font-semibold text-2xl text-(--color-primary) px-2.5 pt-2.5">Employees List</p>
        <div className="w-[20%] pr-4">
          <Button title="+ Add Employee" onClick={() => setOpenAddEmployeeModal(true)} />
        </div>
      </div>

      {openAddEmployeeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-1">
          <div className="relative bg-(--color-bg) flex flex-col items-center justify-center rounded-4xl shadow-md w-[400px]">
            <form className="flex flex-col w-full h-full p-5 gap-8 md:gap-15" onSubmit={(e) => e.preventDefault()} >
              <p className="font-semibold text-[18px] text-(--color-primary)">Add Employee</p>

              <div className="flex flex-col w-full gap-3 items-center justify-center">
                <Image src={emp} alt="Emp-logo" height={250} width={250} />
                <InputBox
                  icon={<FaUser size={20} />}
                  type="text"
                  placeholder="Enter employeel name"
                  value={form.name}
                  onChange={(value) => handleChange("name", value)}
                  required
                />
                <InputBox
                  icon={<TbMailFilled size={24} />}
                  type="email"
                  placeholder="Enter employeel email"
                  value={form.email}
                  onChange={(v) => handleChange("email", v)}
                  required
                />
                <InputBox
                  icon={<MdLock size={26} />}
                  type="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(v) => handleChange("password", v)}
                  required
                />
              </div>

              <div className="flex flex-col w-full gap-3 md:gap-5 mt-auto">
                <Button title={loading ? "Adding Employee..." : "Add Employee"} onClick={handleAddEmployee} disabled={loading} />
              </div>
            </form>
            <div className="absolute top-4 right-4">
              <Crossicon onClick={() => setOpenAddEmployeeModal(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Dashboard */}
      <div className="px-2.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5">
        <DashboardCard title="Total Employees" value={totalEmployees} icon={<FaUsers size={36} />} />
        <DashboardCard title="Employees On Work" value={todayClockInCount} icon={<FaBriefcase size={30} />} />
        <DashboardCard title="Employees On Leave" value={employeesOnLeave} icon={<FaUsersSlash size={36} />} />
        <DashboardCard title="Employees Total Tasks" value={totalTasksAllEmployees} icon={<FaBriefcase size={30} />} />
      </div>

      {/* Search + Filter */}
      <div className="flex gap-4 px-2.5">
        <Searchbar placeholder="Search employees..." value={searchText} onChange={setSearchText} />

        <div ref={dropdownRef} className="relative w-[25%] font-medium text-(--color-gray)">
          <div onClick={() => setOpen(!open)} className="flex px-4 rounded-full border-2 border-[#b2b2b2] h-full bg-(--color-sidebar) items-center justify-between cursor-pointer">
            <span>{statusFilter}</span>
            <BsFillCaretDownFill size={24} className={open ? "rotate-180" : ""} />
          </div>

          {open && (
            <div className="absolute top-full mt-5 w-full bg-(--color-sidebar) rounded-3xl border-2 border-[#b2b2b2]">
              {options.map((opt) => (
                <div key={opt} onClick={() => { setStatusFilter(opt); setOpen(false); }}
                  className="flex justify-between px-4 py-3 hover:bg-gray-100 hover:rounded-3xl cursor-pointer"
                >
                  <span>{opt}</span>
                  {statusFilter === opt && <MdCheckCircle size={24} />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Employee List */}
      <div className="overflow-y-auto grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-2.5 pb-5 pt-1.5">
        {filteredEmployees.length === 0 ? (
          <p className="font-medium text-(--color-gray) ml-3">No employees found</p>
        ) : (
          filteredEmployees.map((emp) => (
            <div key={emp.email} className="bg-(--color-sidebar) rounded-3xl p-4 shadow-lg hover:scale-105 transition hover:bg-gray-100" >
              <div className="flex justify-between items-center relative">
                <div className="flex w-[75px] h-[75px]">
                  <Image src={emp.profilePic || defaultProfile} alt={emp.name} width={75} height={75} className="rounded-xl object-cover" />
                </div>

                <div className="relative">
                  <Gobtn onClick={() => setOpenMenu(openMenu === emp.email ? null : emp.email)} />

                  {openMenu === emp.email && (
                    <div className="absolute flex bg-(--color-sidebar) border-2 border-[#b2b2b2] rounded-3xl p-3 flex-col w-[140px] mt-2 -right-1.5 gap-2">
                      <Button title="View" onClick={() => {
                        setSelectedEmployee(emp);
                        setSelectedImage(emp.profilePic);
                        setSelectedName(emp.name);
                        setSelectedStatus(emp.status || "Inactive");
                        setOpenImageModal(true);
                        setOpenMenu(null);
                      }} />

                      <Button title="Track" onClick={() => {
                        setTrackingEmployee(emp);
                        setOpenTrackModal(true);
                        setOpenMenu(null);
                      }} />
                    </div>
                  )}
                </div>
              </div>

              <p className="mt-4 text-[18px] font-semibold">{emp.name}</p>

              <div className="flex flex-col mt-1 font-medium text-(--color-gray)">
                <p className={emp.status === "Active" ? "text-green-600" : "text-red-500"}>{emp.status}</p>
                <p className="mt-1">Last update at : {emp.lastUpdateTime || "N/A"}</p>
              </div>
            </div>
          ))
        )}

        {openImageModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative bg-(--color-sidebar) p-5 rounded-4xl w-[400px] shadow-xl">
              <div className="absolute top-4 right-4">
                <Crossicon onClick={() => setOpenImageModal(false)} />
              </div>

              <div className="flex">
                <div className="relative w-[140px] h-[140px] rounded-2xl overflow-hidden">
                  <Image src={selectedImage || defaultProfile} alt={selectedName || "Employee"} fill className="object-cover" />
                </div>

                <div className="flex flex-col gap-5 ml-5 w-[170px] font-medium">
                  <p className="mt-4 text-[18px] font-semibold">{selectedName || "N/A"}</p>
                  <p className={selectedStatus === "Active" ? "text-green-600" : "text-red-500"}>{selectedStatus || "Inactive"}</p>
                </div>
              </div>

              <div className="flex flex-col my-5 gap-3 font-medium">
                {[
                  ["Mobile :", selectedEmployee?.mobile || "N/A"],
                  ["Mail :", selectedEmployee?.email || "N/A"],
                  ["Clock In :", selectedEmployee?.clockInTime || "Not yet"],
                  ["Clock Out :", selectedEmployee?.clockOutTime || "Not yet"],
                  ["Worked Hours :", selectedEmployee?.workedHours || "Calculating ..."],
                  ["Total Tasks :", totalVisitCount || "0"],
                  ["Completed Tasks :", completedVisits || "0"],

                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <p>{label}</p>
                    <p>{value}</p>
                  </div>
                ))}
              </div>
              <Button title={loading ? "Deleting Employee..." : "Delete Employee"} onClick={() => handleDeleteEmployee(selectedEmployee?.email!)} disabled={loading} />
            </div>
          </div>
        )}

        {openTrackModal && trackingEmployee && (
          <div className="fixed inset-0 flex justify-end gap-5 h-full ">
            <div className="relative w-full h-full bg-(--color-bg) overflow-hidden p-5">
              {/* 🔹 Header */}
              <div className="flex justify-between items-center">
                <p className="font-semibold text-2xl text-(--color-primary)">Live Tracking</p>
                <div className="pr-2">
                  <Crossicon onClick={() => { setOpenTrackModal(false); setTrackingEmployee(null); }} />
                </div>
              </div>

              <div className="flex gap-5 h-full mt-4.5">
                <div className="flex flex-col w-[60%] gap-5">
                  <button onClick={() => setOpenHistoryModal(true)}
                    className="flex bg-(--color-sidebar) p-2.5 items-center justify-center rounded-2xl text-center border-2 border-[#b2b2b2] font-medium text-(--color-gray)">
                    Live and History
                  </button>

                  {/* ================= MAP CONTAINER ================= */}
                  <div className="xl:h-[82.5%] lg:h-[78%] border-2 border-[#b2b2b2] rounded-3xl overflow-hidden">

                    {/* For Demo */}

                    {mapPoint ? (
                      <iframe
                        key={`${mapPoint.latitude}-${mapPoint.longitude}`}
                        title="Employee Location"
                        width="100%"
                        height="100%"
                        className="border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps?q=${mapPoint.latitude},${mapPoint.longitude}&z=16&output=embed`}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-(--color-gray)">
                        📍 Location not available
                      </div>
                    )}


                    {/* Live + History Map For Production */}

                    {/* {historyPoints && historyPoints.length > 0 ? (
                      <MapComp points={historyPoints} />
                    ) : mapPoint ? (
                      <MapComp points={[mapPoint]} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        📍 Location not available
                      </div>
                    )} */}


                    {/* Leaf Let Map Free  */}

                    {/* {mapPoint ? (
                      <div className="w-full h-full rounded-xl overflow-hidden">
                        <LeafletMap
                          latitude={mapPoint.latitude}
                          longitude={mapPoint.longitude}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-(--color-gray)">
                        📍 Location not available
                      </div>
                    )} */}

                  </div>
                </div>

                <div className="flex flex-col w-[40%] gap-5 h-full">
                  <div className="flex items-center p-5 bg-(--color-sidebar) rounded-3xl shadow-lg gap-4">
                    <div className="flex w-[75px] h-[75px]">
                      <Image src={trackingEmployee.profilePic || defaultProfile} alt={trackingEmployee.name} width={75} height={75} className="rounded-xl object-cover" />
                    </div>

                    <div className="flex flex-col font-medium text-(--color-gray)">
                      <p className="text-[18px] font-semibold text-black">{trackingEmployee.name}</p>
                      <p className={trackingEmployee.status === "Active" ? "text-green-600" : "text-red-500"}>{trackingEmployee.status}</p>
                      <p className="">Last update at : {trackingEmployee.lastUpdateTime || "N/A"}</p>
                    </div>
                  </div>

                  <div className="xl:h-[74%] lg:h-[68%] font-medium text-(--color-gray) overflow-y-auto">
                    {employeeVisits.length === 0 ? (
                      <p className="text-center mt-5 text-(--color-gray)">
                        No visits found
                      </p>
                    ) : (
                      <div className="space-y-4 px-2.5">
                        <p className="text-[18px] font-semibold text-black">Total Visits ( {totalVisitCount} )</p>
                        {employeeVisits.map((visit: any) => (
                          <div key={visit._id} className="relative flex items-center px-6 py-4 bg-(--color-sidebar) rounded-3xl shadow-lg gap-4 hover:bg-gray-100 transition mb-5">
                            <div className="flex w-[75px] h-[75px]">
                              <Image src={visitImages[visit._id] || defaultProfile} alt="Visit" width={75} height={75} className="rounded-xl object-cover" />
                            </div>

                            <div className="flex-1">
                              <p className="text-[18px] font-semibold text-black">{visit.taskName || "No Task Name"}</p>
                              <p className="mt-1">{visit.type || "N/A"}</p>

                              {visit.notes && (<p className="mt-1">{visit.notes}</p>)}

                              <p className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${visit.status === "completed"
                                ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}
                              >
                                {visit.status || "pending"}
                              </p>

                              {visit.date && (<p className="mt-2 text-right">{visit.date}</p>)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {openHistoryModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-(--color-sidebar) rounded-3xl p-5 w-[360px] max-h-[420px]">
              <div className="flex justify-between items-center mb-4">
                <p className="font-semibold text-lg">Select Date</p>
                <Crossicon onClick={() => setOpenHistoryModal(false)} />
              </div>

              <button onClick={() => { setSelectedDate(null); setOpenHistoryModal(false); }}
                className="w-full text-left px-4 py-2 rounded-xl hover:bg-green-100 text-green-600 font-medium"
              >
                Go to Live Location
              </button>

              <div className="flex flex-col min-h-0 max-h-[260px] overflow-y-auto font-medium text-(--color-gray) gap-3 mt-3">
                {Object.keys(groupedHistory).length > 0 ? (
                  Object.keys(groupedHistory).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).map((date) => (
                    <button key={date} onClick={() => { setSelectedDate(date); setOpenHistoryModal(false); }}
                      className="w-full flex justify-between items-center px-4 py-2 rounded-xl hover:bg-gray-100"
                    >
                      <span>{date}</span>
                      {selectedDate === date && (<MdCheckCircle size={26} color="#5d5d5d" />)}
                    </button>
                  ))
                ) : (
                  <p className="text-center font-medium text-(--color-gray) my-4">No history available</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;