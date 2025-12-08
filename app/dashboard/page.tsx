// "use client";

// import { useState } from "react";
// import Stats from "../components/Stats";
// import EmployeeCard from "../components/EmployeeCard";
// import Sidebar from "../components/Sidebar";
// import EmployeeModal from "../components/EmployeeModal";
// import AddEmployeeModal from "../components/AddEmployeeModal";

// import { FaSearch } from "react-icons/fa";
// import { HiChevronDown } from "react-icons/hi";

// interface Emp {
//   name: string;
//   status: string;
//   image?: string;
//   mobile?: string;
//   mail?: string;
// }

// export default function EmployeesPage() {
//   const [selectedEmployee, setSelectedEmployee] = useState<Emp | null>(null);
//   const [openModal, setOpenModal] = useState(false);
//   const [openAddModal, setOpenAddModal] = useState(false);

//   const employees: Emp[] = [
//     { name: "Pawan", status: "Active", image: "https://randomuser.me/api/portraits/men/32.jpg" },
//     { name: "Sohail", status: "Active", image: "https://randomuser.me/api/portraits/men/39.jpg" },
//     { name: "Vennela", status: "Active", image: "https://randomuser.me/api/portraits/women/22.jpg" },
//     { name: "Hema", status: "Active", image: "https://randomuser.me/api/portraits/women/45.jpg" },
//   ];

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-100">
//       <Sidebar />

//       <div className="flex-1 ml-64 p-6 overflow-hidden flex flex-col">
        
//         {/* TOP FIXED CONTENT */}
//         <div className="pb-4 shrink-0">
//           <div className="flex items-center justify-between mb-4">
//             <h1 className="text-4xl font-bold text-purple-600">Employees List</h1>

//             {/* OPEN ADD EMPLOYEE MODAL */}
//             <button
//               className="bg-purple-600 text-white px-6 py-3 rounded-full shadow active:scale-95 transition"
//               onClick={() => setOpenAddModal(true)}
//             >
//               + Add Employee
//             </button>
//           </div>

//           <Stats />

//           {/* Search + Filter */}
//           <div className="flex items-center gap-4 mt-4">
//             <div className="relative w-full">
//               <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search employees by name"
//                 className="w-full h-12 pl-12 pr-4 rounded-full border border-gray-300 shadow bg-white"
//               />
//             </div>

//             <div className="relative">
//               <select className="h-12 p-3 rounded-full border border-gray-300 shadow bg-white appearance-none pr-8 text-sm">
//                 <option>All Status</option>
//                 <option>Active</option>
//                 <option>Inactive</option>
//               </select>
//               <HiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
//             </div>
//           </div>
//         </div>

//         {/* SCROLL AREA */}
//         <div className="grow mt-4 overflow-y-auto pr-2 no-scrollbar scroll-smooth">
//           <div className="grid grid-cols-4 gap-6">
//             {employees.map((emp, idx) => (
//               <EmployeeCard
//                 key={idx}
//                 name={emp.name}
//                 status={emp.status}
//                 image={emp.image}
//                 onView={() => {
//                   setSelectedEmployee(emp);
//                   setOpenModal(true);
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* EMPLOYEE DETAILS MODAL */}
//       <EmployeeModal
//         isOpen={openModal}
//         onClose={() => setOpenModal(false)}
//         employee={selectedEmployee}
//       />

//       {/* ADD EMPLOYEE MODAL */}
//       <AddEmployeeModal
//         isOpen={openAddModal}
//         onClose={() => setOpenAddModal(false)}
//       />
//     </div>
//   );
// }


// "use client";

// import { useState } from "react";
// import Stats from "../components/Stats";
// import EmployeeCard from "../components/EmployeeCard";
// import Sidebar from "../components/Sidebar";
// import EmployeeModal from "../components/EmployeeModal";
// import AddEmployeeModal from "../components/AddEmployeeModal";

// import { FaSearch } from "react-icons/fa";
// import { HiChevronDown } from "react-icons/hi";

// interface Emp {
//   name: string;
//   status: string;
//   image?: string;
// }

// export default function EmployeesPage() {
//   const [employees, setEmployees] = useState<Emp[]>([
//     { name: "Pawan", status: "Active", image: "https://randomuser.me/api/portraits/men/32.jpg" },
//     { name: "Sohail", status: "Active", image: "https://randomuser.me/api/portraits/men/39.jpg" },
//   ]);

//   const [selectedEmployee, setSelectedEmployee] = useState<Emp | null>(null);
//   const [openModal, setOpenModal] = useState(false);
//   const [openAddModal, setOpenAddModal] = useState(false);

//   // Add new employee
//   const handleAddEmployee = (newEmp: Emp) => {
//     setEmployees((prev) => [...prev, newEmp]);
//   };

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-100">
//       <Sidebar />

//       <div className="flex-1 ml-64 p-6 overflow-hidden flex flex-col">
//         {/* TOP FIXED CONTENT */}
//         <div className="pb-4 shrink-0">
//           <div className="flex items-center justify-between mb-4">
//             <h1 className="text-4xl font-bold text-[#8D6BDC]">Employees List</h1>

//             <button
//               className="bg-[#8D6BDC] text-white px-6 py-3 rounded-full shadow active:scale-95 transition"
//               onClick={() => setOpenAddModal(true)}
//             >
//               + Add Employee
//             </button>
//           </div>

//           <Stats />

//           <div className="flex items-center gap-4 mt-4">
//             <div className="relative w-full">
//               <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search employees by name"
//                 className="w-full h-12 pl-12 pr-4 rounded-full border border-gray-300 shadow bg-white"
//               />
//             </div>

//             <div className="relative">
//               <select className="h-12 p-3 rounded-full border border-gray-300 shadow bg-white appearance-none pr-8 text-sm">
//                 <option>All Status</option>
//                 <option>Active</option>
//                 <option>Inactive</option>
//               </select>
//               <HiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xl pointer-events-none" />
//             </div>
//           </div>
//         </div>

//         {/* Scroll Section */}
//         <div className="grow mt-4 overflow-y-auto pr-2 no-scrollbar scroll-smooth">
//           <div className="grid grid-cols-4 gap-6">
//             {employees.map((emp, idx) => (
//               <EmployeeCard
//                 key={idx}
//                 name={emp.name}
//                 status={emp.status}
//                 image={emp.image}
//                 onView={() => {
//                   setSelectedEmployee(emp);
//                   setOpenModal(true);
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* MODALS */}
//       <EmployeeModal
//         isOpen={openModal}
//         onClose={() => setOpenModal(false)}
//         employee={selectedEmployee}
//       />

//       <AddEmployeeModal
//         isOpen={openAddModal}
//         onClose={() => setOpenAddModal(false)}
//         onAdd={handleAddEmployee}
//       />
//     </div>
//   );
// }


// "use client";

// import { useState } from "react";
// import Stats from "../components/Stats";
// import EmployeeCard from "../components/EmployeeCard";
// import Sidebar from "../components/Sidebar";
// import EmployeeModal from "../components/EmployeeModal";
// import AddEmployeeModal from "../components/AddEmployeeModal";

// import { FaSearch } from "react-icons/fa";
// import { HiChevronDown } from "react-icons/hi";

// interface Emp {
//   name: string;
//   status: string;
//   image?: string;
// }

// export default function EmployeesPage() {
//   const [employees, setEmployees] = useState<Emp[]>([
//     { name: "Pawan", status: "Active", image: "https://randomuser.me/api/portraits/men/32.jpg" },
//     { name: "Sohail", status: "Active", image: "https://randomuser.me/api/portraits/men/39.jpg" },
//   ]);

//   const [searchText, setSearchText] = useState(""); // 🔍 NEW
//   const [selectedEmployee, setSelectedEmployee] = useState<Emp | null>(null);
//   const [openModal, setOpenModal] = useState(false);
//   const [openAddModal, setOpenAddModal] = useState(false);

//   // Add employee
//   const handleAddEmployee = (newEmp: Emp) => {
//     setEmployees((prev) => [...prev, newEmp]);
//   };

//   // 🔍 FILTER EMPLOYEES BASED ON SEARCH
//   const filteredEmployees = employees.filter((emp) =>
//     emp.name.toLowerCase().includes(searchText.toLowerCase())
//   );

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-100">
//       <Sidebar />

//       <div className="flex-1 ml-64 p-6 overflow-hidden flex flex-col">
        
//         {/* TOP FIXED SECTION */}
//         <div className="pb-4 shrink-0">
//           <div className="flex items-center justify-between mb-4">
//             <h1 className="text-4xl font-bold text-[#8D6BDC]">Employees List</h1>

//             <button
//               className="bg-[#8D6BDC] text-white px-6 py-3 rounded-full shadow active:scale-95 transition"
//               onClick={() => setOpenAddModal(true)}
//             >
//               + Add Employee
//             </button>
//           </div>

//           <Stats />

//           <div className="flex items-center gap-4 mt-4">

//             {/* 🔍 SEARCH INPUT */}
//             <div className="relative w-full">
//               <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search employees by name"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 className="w-full h-12 pl-12 pr-4 rounded-full border border-gray-300 shadow bg-white"
//               />
//             </div>

//             {/* FILTER DROPDOWN (unchanged) */}
//             <div className="relative">
//               <select className="h-12 p-3 rounded-full border border-gray-300 shadow bg-white appearance-none pr-8 text-sm">
//                 <option>All Status</option>
//                 <option>Active</option>
//                 <option>Inactive</option>
//               </select>
//               <HiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xl pointer-events-none" />
//             </div>
//           </div>
//         </div>

//         {/* SCROLL SECTION */}
//         <div className="grow mt-4 overflow-y-auto pr-2 no-scrollbar scroll-smooth">
//           <div className="grid grid-cols-4 gap-6">
//             {filteredEmployees.map((emp, idx) => (
//               <EmployeeCard
//                 key={idx}
//                 name={emp.name}
//                 status={emp.status}
//                 image={emp.image}
//                 onView={() => {
//                   setSelectedEmployee(emp);
//                   setOpenModal(true);
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* EMPLOYEE DETAILS MODAL */}
//       <EmployeeModal
//         isOpen={openModal}
//         onClose={() => setOpenModal(false)}
//         employee={selectedEmployee}
//       />

//       {/* ADD EMPLOYEE MODAL */}
//       <AddEmployeeModal
//         isOpen={openAddModal}
//         onClose={() => setOpenAddModal(false)}
//         onAdd={handleAddEmployee}
//       />
//     </div>
//   );
// }


// "use client";

// import { useState } from "react";
// import Stats from "../components/Stats";
// import EmployeeCard from "../components/EmployeeCard";
// import Sidebar from "../components/Sidebar";
// import EmployeeModal from "../components/EmployeeModal";
// import AddEmployeeModal from "../components/AddEmployeeModal";

// import { FaSearch } from "react-icons/fa";
// import { HiChevronDown } from "react-icons/hi";

// interface Emp {
//   name: string;
//   status: string;
//   image?: string;
// }

// export default function EmployeesPage() {

//   // EMPLOYEES (added one inactive)
//   const [employees, setEmployees] = useState<Emp[]>([
//     { name: "Pawan", status: "Active", image: "https://randomuser.me/api/portraits/men/32.jpg" },
//     { name: "Sohail", status: "Active", image: "https://randomuser.me/api/portraits/men/39.jpg" },

//     // 🔥 Inactive card added
//     { name: "Hema", status: "Inactive", image: "https://randomuser.me/api/portraits/women/45.jpg" },
//   ]);

//   const [searchText, setSearchText] = useState("");        // SEARCH
//   const [statusFilter, setStatusFilter] = useState("All Status"); // STATUS FILTER

//   const [selectedEmployee, setSelectedEmployee] = useState<Emp | null>(null);
//   const [openModal, setOpenModal] = useState(false);
//   const [openAddModal, setOpenAddModal] = useState(false);

//   // ADD NEW EMPLOYEE FUNCTION
//   const handleAddEmployee = (newEmp: Emp) => {
//     setEmployees((prev) => [...prev, newEmp]);
//   };

//   // 🔍 + 🟢 FILTER EMPLOYEES
//   const filteredEmployees = employees.filter((emp) => {
//     const matchesSearch = emp.name.toLowerCase().includes(searchText.toLowerCase());

//     const matchesStatus =
//       statusFilter === "All Status"
//         ? true
//         : emp.status === statusFilter;

//     return matchesSearch && matchesStatus;
//   });

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-100">

//       <Sidebar />

//       <div className="flex-1 ml-64 p-6 overflow-hidden flex flex-col">

//         {/* TOP SECTION */}
//         <div className="pb-4 shrink-0">

//           <div className="flex items-center justify-between mb-4">
//             <h1 className="text-4xl font-bold text-[#8D6BDC]">Employee List</h1>

//             <button
//               className="bg-[#8D6BDC] text-white px-6 py-3 rounded-full shadow active:scale-95 transition"
//               onClick={() => setOpenAddModal(true)}
//             >
//               + Add Employee
//             </button>
//           </div>

//           <Stats />

//           {/* SEARCH + FILTER */}
//           <div className="flex items-center gap-4 mt-4">

//             {/* SEARCH INPUT */}
//             <div className="relative w-full">
//               <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

//               <input
//                 type="text"
//                 placeholder="Search employees by name"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 className="w-full h-12 pl-12 pr-4 rounded-full border border-gray-300 shadow bg-white"
//               />
//             </div>

//             {/* STATUS FILTER */}
//             <div className="relative">
//               <select
//                 className="h-12 p-3 rounded-full border border-gray-300 shadow bg-white appearance-none pr-8 text-sm"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option>All Status</option>
//                 <option>Active</option>
//                 <option>Inactive</option>
//               </select>

//               <HiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xl pointer-events-none" />
//             </div>

//           </div>
//         </div>

//         {/* SCROLL AREA */}
//         <div className="grow mt-4 overflow-y-auto pr-2 no-scrollbar scroll-smooth">
//           <div className="grid grid-cols-4 gap-6">
//             {filteredEmployees.map((emp, idx) => (
//               <EmployeeCard
//                 key={idx}
//                 name={emp.name}
//                 status={emp.status}
//                 image={emp.image}
//                 onView={() => {
//                   setSelectedEmployee(emp);
//                   setOpenModal(true);
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* EMPLOYEE DETAILS */}
//       <EmployeeModal
//         isOpen={openModal}
//         onClose={() => setOpenModal(false)}
//         employee={selectedEmployee}
//       />

//       {/* ADD EMPLOYEE MODAL */}
//       <AddEmployeeModal
//         isOpen={openAddModal}
//         onClose={() => setOpenAddModal(false)}
//         onAdd={handleAddEmployee}
//       />
//     </div>
//   );
// }



// "use client";

// import { useState } from "react";
// import Stats from "../components/Stats";
// import EmployeeCard from "../components/EmployeeCard";
// import Sidebar from "../components/Sidebar";
// import EmployeeModal from "../components/EmployeeModal";
// import AddEmployeeModal from "../components/AddEmployeeModal";

// import { FaSearch } from "react-icons/fa";
// import { HiChevronDown } from "react-icons/hi";

// interface Emp {
//   name: string;
//   status: string;
//   image?: string;
// }

// export default function EmployeesPage() {

//   // Employees
//   const [employees, setEmployees] = useState<Emp[]>([
//     { name: "Pawan", status: "Active", image: "https://randomuser.me/api/portraits/men/32.jpg" },
//     { name: "Sohail", status: "Active", image: "https://randomuser.me/api/portraits/men/39.jpg" },
//     { name: "Hema", status: "Inactive", image: "https://randomuser.me/api/portraits/women/45.jpg" },
//   ]);

//   // Counts for Stats
//   const total = employees.length;
//   const active = employees.filter((e) => e.status === "Active").length;
//   const inactive = employees.filter((e) => e.status === "Inactive").length;

//   const [searchText, setSearchText] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All Status");

//   const [selectedEmployee, setSelectedEmployee] = useState<Emp | null>(null);
//   const [openModal, setOpenModal] = useState(false);
//   const [openAddModal, setOpenAddModal] = useState(false);

//   // Add Employees
//   const handleAddEmployee = (newEmp: Emp) => {
//     setEmployees((prev) => [...prev, newEmp]);
//   };

//   // Search + Filter
//   const filteredEmployees = employees.filter((emp) => {
//     const matchesSearch = emp.name.toLowerCase().includes(searchText.toLowerCase());
//     const matchesStatus =
//       statusFilter === "All Status" ? true : emp.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-100">
//       <Sidebar />

//       <div className="flex-1 ml-64 p-6 overflow-hidden flex flex-col">
        
//         {/* TOP SECTION */}
//         <div className="pb-4 shrink-0">

//           <div className="flex items-center justify-between mb-4">
//             <h1 className="text-4xl font-bold text-[#8D6BDC]">Employee List</h1>

//             <button
//               className="bg-[#8D6BDC] text-white px-6 py-3 rounded-full shadow active:scale-95 transition"
//               onClick={() => setOpenAddModal(true)}
//             >
//               + Add Employee
//             </button>
//           </div>

//           {/* Stats with dynamic values */}
//           <Stats />

//           {/* SEARCH + FILTER */}
//           <div className="flex items-center gap-4 mt-4">

//             {/* SEARCH INPUT */}
//             <div className="relative w-full">
//               <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

//               <input
//                 type="text"
//                 placeholder="Search employees by name"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 className="w-full h-12 pl-12 pr-4 rounded-full border border-gray-300 shadow bg-white"
//               />
//             </div>

//             {/* STATUS FILTER */}
//             <div className="relative">
//               <select
//                 className="h-12 p-3 rounded-full border border-gray-300 shadow bg-white appearance-none pr-8 text-sm"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option>All Status</option>
//                 <option>Active</option>
//                 <option>Inactive</option>
//               </select>

//               <HiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xl pointer-events-none" />
//             </div>
//           </div>
//         </div>

//         {/* SCROLL AREA */}
//         <div className="grow mt-4 overflow-y-auto pr-2 no-scrollbar scroll-smooth">
//           <div className="grid grid-cols-4 gap-6">
//             {filteredEmployees.map((emp, idx) => (
//               <EmployeeCard
//                 key={idx}
//                 name={emp.name}
//                 status={emp.status}
//                 image={emp.image}
//                 onView={() => {
//                   setSelectedEmployee(emp);
//                   setOpenModal(true);
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* EMPLOYEE DETAILS */}
//       <EmployeeModal
//         isOpen={openModal}
//         onClose={() => setOpenModal(false)}
//         employee={selectedEmployee}
//       />

//       {/* ADD EMPLOYEE */}
//       <AddEmployeeModal
//         isOpen={openAddModal}
//         onClose={() => setOpenAddModal(false)}
//         onAdd={handleAddEmployee}
//       />
//     </div>
//   );
// }


// "use client";

// import { useState } from "react";
// import Stats from "../components/Stats";
// import EmployeeCard from "../components/EmployeeCard";
// import Sidebar from "../components/Sidebar";
// import EmployeeModal from "../components/EmployeeModal";
// import AddEmployeeModal from "../components/AddEmployeeModal";

// import { FaSearch } from "react-icons/fa";
// import { HiChevronDown } from "react-icons/hi";

// interface Emp {
//   name: string;
//   status: string;
//   image?: string;
// }

// export default function EmployeesPage() {
//   // EMPLOYEES
//   const [employees, setEmployees] = useState<Emp[]>([
//     { name: "Pawan", status: "Active", image: "https://randomuser.me/api/portraits/men/32.jpg" },
//     { name: "Sohail", status: "Active", image: "https://randomuser.me/api/portraits/men/39.jpg" },
//     { name: "Hema", status: "Inactive", image: "https://randomuser.me/api/portraits/women/45.jpg" },
//   ]);

//   // SEARCH + FILTER STATE
//   const [searchText, setSearchText] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All Status");

//   // MODAL STATES
//   const [selectedEmployee, setSelectedEmployee] = useState<Emp | null>(null);
//   const [openModal, setOpenModal] = useState(false);
//   const [openAddModal, setOpenAddModal] = useState(false);

//   // ➕ ADD EMPLOYEE FUNCTION
//   const handleAddEmployee = (newEmp: Emp) => {
//     setEmployees((prev) => [...prev, newEmp]);
//   };

//   // 🔍 FILTER EMPLOYEES
//   const filteredEmployees = employees.filter((emp) => {
//     const searchMatch = emp.name.toLowerCase().includes(searchText.toLowerCase());
//     const statusMatch =
//       statusFilter === "All Status" ? true : emp.status === statusFilter;

//     return searchMatch && statusMatch;
//   });

//   // 📊 STATS COUNTS
//   const total = employees.length;
//   const active = employees.filter(e => e.status === "Active").length;
//   const inactive = employees.filter(e => e.status === "Inactive").length;

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-100">

//       <Sidebar />

//       <div className="flex-1 ml-64 p-6 overflow-hidden flex flex-col">

//         {/* TOP HEADER */}
//         <div className="pb-4 shrink-0">

//           <div className="flex items-center justify-between mb-4">
//             <h1 className="text-4xl font-bold text-[#8D6BDC]">Employee List</h1>

//             <button
//               className="bg-[#8D6BDC] text-white px-6 py-3 rounded-full shadow active:scale-95 transition"
//               onClick={() => setOpenAddModal(true)}
//             >
//               + Add Employee
//             </button>
//           </div>

//           {/* STATS WITH DYNAMIC VALUES */}
//           <Stats />

//           {/* SEARCH + FILTER */}
//           <div className="flex items-center gap-4 mt-4">

//             {/* SEARCH INPUT */}
//             <div className="relative w-full">
//               <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search employees by name"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 className="w-full h-12 pl-12 pr-4 rounded-full border border-gray-300 shadow bg-white"
//               />
//             </div>

//             {/* STATUS FILTER DROPDOWN */}
//             <div className="relative">
//               <select
//                 className="h-12 p-3 rounded-full border border-gray-300 shadow bg-white appearance-none pr-8 text-sm"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option>All Status</option>
//                 <option>Active</option>
//                 <option>Inactive</option>
//               </select>
//               <HiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
//             </div>

//           </div>
//         </div>

//         {/* CARD GRID */}
//         <div className="grow mt-4 overflow-y-auto pr-2 no-scrollbar scroll-smooth">
//           <div className="grid grid-cols-4 gap-6">
//             {filteredEmployees.map((emp, idx) => (
//               <EmployeeCard
//                 key={idx}
//                 name={emp.name}
//                 status={emp.status}
//                 image={emp.image}
//                 onView={() => {
//                   setSelectedEmployee(emp);
//                   setOpenModal(true);
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* EMPLOYEE VIEW MODAL */}
//       <EmployeeModal
//         isOpen={openModal}
//         onClose={() => setOpenModal(false)}
//         employee={selectedEmployee}
//       />

//       {/* ADD EMPLOYEE MODAL */}
//       <AddEmployeeModal
//         isOpen={openAddModal}
//         onClose={() => setOpenAddModal(false)}
//         onAdd={handleAddEmployee}
//       />
//     </div>
//   );
// }


// "use client";

// import { useState } from "react";
// import Stats from "../components/Stats";
// import EmployeeCard from "../components/EmployeeCard";
// import Sidebar from "../components/Sidebar";
// import EmployeeModal from "../components/EmployeeModal";
// import AddEmployeeModal from "../components/AddEmployeeModal";

// import { FaSearch } from "react-icons/fa";
// import { HiChevronDown } from "react-icons/hi";

// interface Emp {
//   name: string;
//   status: string;
//   image?: string;
// }

// export default function EmployeesPage() {

//   // EMPLOYEES
//   const [employees, setEmployees] = useState<Emp[]>([
//     { name: "Pawan", status: "Active", image: "https://randomuser.me/api/portraits/men/32.jpg" },
//     { name: "Sohail", status: "Active", image: "https://randomuser.me/api/portraits/men/39.jpg" },
//     { name: "Hema", status: "Inactive", image: "https://randomuser.me/api/portraits/women/45.jpg" },
//   ]);

//   // SEARCH + FILTER STATE
//   const [searchText, setSearchText] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All Status");

//   // MODAL STATES
//   const [selectedEmployee, setSelectedEmployee] = useState<Emp | null>(null);
//   const [openModal, setOpenModal] = useState(false);
//   const [openAddModal, setOpenAddModal] = useState(false);

//   // ➕ ADD EMPLOYEE FUNCTION
//   const handleAddEmployee = (newEmp: Emp) => {
//     setEmployees((prev) => [...prev, newEmp]);
//   };

//   // 🔍 FILTER EMPLOYEES
//   const filteredEmployees = employees.filter((emp) => {
//     const searchMatch = emp.name.toLowerCase().includes(searchText.toLowerCase());
//     const statusMatch =
//       statusFilter === "All Status" ? true : emp.status === statusFilter;

//     return searchMatch && statusMatch;
//   });

//   // 📊 STATS COUNTS
//   const total = employees.length;
//   const active = employees.filter(e => e.status === "Active").length;
//   const inactive = employees.filter(e => e.status === "Inactive").length;

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-100">

//       <Sidebar />

//       <div className="flex-1 ml-64 p-6 overflow-hidden flex flex-col">

//         {/* TOP HEADER */}
//         <div className="pb-4 shrink-0">

//           <div className="flex items-center justify-between mb-4">
//             <h1 className="text-4xl font-bold text-[#8D6BDC]">Employee List</h1>

//             <button
//               className="bg-[#8D6BDC] text-white px-6 py-3 rounded-full shadow active:scale-95 transition"
//               onClick={() => setOpenAddModal(true)}
//             >
//               + Add Employee
//             </button>
//           </div>

//           {/* ⭐ STATS WITH DYNAMIC VALUES */}
//           <Stats total={total} active={active} inactive={inactive} />

//           {/* SEARCH + FILTER */}
//           <div className="flex items-center gap-4 mt-4">

//             {/* SEARCH INPUT */}
//             <div className="relative w-full">
//               <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search employees by name"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 className="w-full h-12 pl-12 pr-4 rounded-full border border-gray-300 shadow bg-white"
//               />
//             </div>

//             {/* STATUS FILTER DROPDOWN */}
//             <div className="relative">
//               <select
//                 className="h-12 p-3 rounded-full border border-gray-300 shadow bg-white appearance-none pr-8 text-sm"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option>All Status</option>
//                 <option>Active</option>
//                 <option>Inactive</option>
//               </select>
//               <HiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
//             </div>

//           </div>
//         </div>

//         {/* CARD GRID */}
//         <div className="grow mt-4 overflow-y-auto pr-2 no-scrollbar scroll-smooth">
//           <div className="grid grid-cols-4 gap-6">
//             {filteredEmployees.map((emp, idx) => (
//               <EmployeeCard
//                 key={idx}
//                 name={emp.name}
//                 status={emp.status}
//                 image={emp.image}
//                 onView={() => {
//                   setSelectedEmployee(emp);
//                   setOpenModal(true);
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* EMPLOYEE VIEW MODAL */}
//       <EmployeeModal
//         isOpen={openModal}
//         onClose={() => setOpenModal(false)}
//         employee={selectedEmployee}
//       />

//       {/* ADD EMPLOYEE MODAL */}
//       <AddEmployeeModal
//         isOpen={openAddModal}
//         onClose={() => setOpenAddModal(false)}
//         onAdd={handleAddEmployee}
//       />
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import Stats from "../components/Stats";
import EmployeeCard from "../components/EmployeeCard";
import Sidebar from "../components/Sidebar";
import EmployeeModal from "../components/EmployeeModal";
import AddEmployeeModal from "../components/AddEmployeeModal";

import { FaSearch } from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";

interface Emp {
  name: string;
  status: string;
  image?: string;
}

export default function EmployeesPage() {
  // EMPLOYEES
  const [employees, setEmployees] = useState<Emp[]>([
    { name: "Pawan", status: "Active", image: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Sohail", status: "Active", image: "https://randomuser.me/api/portraits/men/39.jpg" },
    { name: "Hema", status: "Inactive", image: "https://randomuser.me/api/portraits/women/45.jpg" },
  ]);

  // SEARCH + FILTER STATE
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // MODAL STATES
  const [selectedEmployee, setSelectedEmployee] = useState<Emp | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  // ➕ ADD EMPLOYEE FUNCTION
  const handleAddEmployee = (newEmp: Emp) => {
    setEmployees((prev) => [...prev, newEmp]);
  };

  // ❌ DELETE EMPLOYEE FUNCTION (NEW)
  const handleDeleteEmployee = () => {
    if (!selectedEmployee) return;

    setEmployees((prev) =>
      prev.filter((emp) => emp.name !== selectedEmployee.name)
    );

    setOpenModal(false);
  };

  // 🔍 FILTER EMPLOYEES
  const filteredEmployees = employees.filter((emp) => {
    const searchMatch = emp.name.toLowerCase().includes(searchText.toLowerCase());
    const statusMatch =
      statusFilter === "All Status" ? true : emp.status === statusFilter;

    return searchMatch && statusMatch;
  });

  // 📊 STATS COUNTS
  const total = employees.length;
  const active = employees.filter((e) => e.status === "Active").length;
  const inactive = employees.filter((e) => e.status === "Inactive").length;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">

      <Sidebar />

      <div className="flex-1 ml-64 p-6 overflow-hidden flex flex-col">

        {/* TOP HEADER */}
        <div className="pb-4 shrink-0">

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-[#8D6BDC]">Employee List</h1>

            <button
              className="bg-[#8D6BDC] text-white px-6 py-3 rounded-full shadow active:scale-95 transition"
              onClick={() => setOpenAddModal(true)}
            >
              + Add Employee
            </button>
          </div>

          {/* ⭐ STATS WITH DYNAMIC VALUES */}
          <Stats total={total} active={active} inactive={inactive} />

          {/* SEARCH + FILTER */}
          <div className="flex items-center gap-4 mt-4">

            {/* SEARCH INPUT */}
            <div className="relative w-full">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees by name"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-full border border-gray-300 shadow bg-white"
              />
            </div>

            {/* STATUS FILTER DROPDOWN */}
            <div className="relative">
              <select
                className="h-12 p-3 rounded-full border border-gray-300 shadow bg-white appearance-none pr-8 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <HiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
            </div>

          </div>
        </div>

        {/* CARD GRID */}
        <div className="grow mt-4 overflow-y-auto pr-2 no-scrollbar scroll-smooth">
          <div className="grid grid-cols-4 gap-6">
            {filteredEmployees.map((emp, idx) => (
              <EmployeeCard
                key={idx}
                name={emp.name}
                status={emp.status}
                image={emp.image}
                onView={() => {
                  setSelectedEmployee(emp);
                  setOpenModal(true);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* EMPLOYEE VIEW MODAL */}
      <EmployeeModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onDelete={handleDeleteEmployee}       
        employee={selectedEmployee}
      />

      {/* ADD EMPLOYEE MODAL */}
      <AddEmployeeModal
        isOpen={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddEmployee}
      />
    </div>
  );
}
