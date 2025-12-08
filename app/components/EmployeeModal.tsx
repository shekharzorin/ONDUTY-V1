// import React from "react";
// import { FaTimes } from "react-icons/fa";

// type Employee = {
//   name: string;
//   status?: string;
//   image?: string;
//   mobile?: string;
//   mail?: string;
//   clockIn?: string;
//   clockOut?: string;
//   workedHours?: string;
//   totalTasks?: string;
//   completedTasks?: string;
// };

// type Props = {
//   isOpen: boolean;
//   onClose: () => void;
//   employee: Employee | null;
// };

// export default function EmployeeModal({ isOpen, onClose, employee }: Props) {
//   if (!isOpen || !employee) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-white w-[680px] rounded-3xl p-8 relative shadow-2xl">
//         <button
//           onClick={onClose}
//           aria-label="Close"
//           className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full"
//         >
//           <FaTimes className="text-gray-700" />
//         </button>

//         <div className="flex items-start gap-6">
//           <img
//             src={employee.image}
//             alt={employee.name}
//             className="w-32 h-32 rounded-2xl object-cover"
//           />
//           <div>
//             <h2 className="text-3xl font-semibold">{employee.name}</h2>
//             <p className="text-green-600 font-medium mt-1">{employee.status}</p>
//           </div>
//         </div>

//         <div className="mt-6 grid grid-cols-2 gap-y-4 text-lg">
//           <p className="font-semibold">Mobile :</p>
//           <p>{employee.mobile ?? "8639112756"}</p>

//           <p className="font-semibold">Mail :</p>
//           <p>{employee.mail ?? "sohail@gmail.com"}</p>

//           <p className="font-semibold">Clock In :</p>
//           <p>{employee.clockIn ?? "Not yet"}</p>

//           <p className="font-semibold">Clock Out :</p>
//           <p>{employee.clockOut ?? "7:03 PM"}</p>

//           <p className="font-semibold">Worked Hours :</p>
//           <p>{employee.workedHours ?? "00h:00m:00s"}</p>

//           <p className="font-semibold">Total Tasks :</p>
//           <p>{employee.totalTasks ?? "03"}</p>

//           <p className="font-semibold">Completed Tasks :</p>
//           <p>{employee.completedTasks ?? "20"}</p>
//         </div>

//         <div className="mt-8">
//           <button
//             className="w-full bg-purple-600 text-white py-4 rounded-full text-xl font-semibold"
//             onClick={() => {
//               /* hook for delete action */
//             }}
//           >
//             Delete Employee
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import React from "react";
// import { FaTimes } from "react-icons/fa";

// type Employee = {
//   name: string;
//   status?: string;
//   image?: string;
//   mobile?: string;
//   mail?: string;
//   clockIn?: string;
//   clockOut?: string;
//   workedHours?: string;
//   totalTasks?: string;
//   completedTasks?: string;
// };

// type Props = {
//   isOpen: boolean;
//   onClose: () => void;
//   employee: Employee | null;
// };

// export default function EmployeeModal({ isOpen, onClose, employee }: Props) {
//   if (!isOpen || !employee) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-white w-[520px] rounded-3xl p-6 relative shadow-2xl">

//         {/* Close */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full"
//         >
//           <FaTimes className="text-gray-700" />
//         </button>

//         <div className="flex items-center gap-4">
//           <img
//             src={employee.image}
//             alt={employee.name}
//             className="w-24 h-24 rounded-2xl object-cover"
//           />

//           <div>
//             <h2 className="text-2xl font-semibold">{employee.name}</h2>
//             <p className="text-green-600 font-medium mt-1">{employee.status}</p>
//           </div>
//         </div>

//         <div className="mt-6 grid grid-cols-2 gap-y-3 text-base">
//           <p className="font-semibold">Mobile:</p>
//           <p>{employee.mobile ?? "8639112756"}</p>

//           <p className="font-semibold">Mail:</p>
//           <p>{employee.mail ?? "sohail@gmail.com"}</p>

//           <p className="font-semibold">Clock In:</p>
//           <p>{employee.clockIn ?? "Not yet"}</p>

//           <p className="font-semibold">Clock Out:</p>
//           <p>{employee.clockOut ?? "7:03 PM"}</p>

//           <p className="font-semibold">Worked Hours:</p>
//           <p>{employee.workedHours ?? "00h:00m:00s"}</p>

//           <p className="font-semibold">Total Tasks:</p>
//           <p>{employee.totalTasks ?? "03"}</p>

//           <p className="font-semibold">Completed Tasks:</p>
//           <p>{employee.completedTasks ?? "20"}</p>
//         </div>

//         <button
//         className="
//         w-88 h-11 
//        bg-purple-600 
//        text-white 
//        rounded-full 
//        text-lg 
//        font-semibold 
//        mt-6
//        flex justify-center items-center     /* centers text */
//        mx-auto                                /* centers button */
//         ">
//        Delete Employee
//        </button>
//        </div>
//        </div>
//   );
// }


// "use client";

// import React from "react";
// import { FaTimes } from "react-icons/fa";

// type Employee = {
//   name: string;
//   status?: string;
//   image?: string;
//   mobile?: string;
//   mail?: string;
// };

// type Props = {
//   isOpen: boolean;
//   onClose: () => void;
//   employee: Employee | null;
// };

// export default function EmployeeModal({ isOpen, onClose, employee }: Props) {
//   if (!isOpen || !employee) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-white w-[520px] rounded-3xl p-6 relative shadow-2xl">

//         <button onClick={onClose} className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full">
//           <FaTimes className="text-gray-700" />
//         </button>

//         <div className="flex items-center gap-4">
//           <img
//             src={employee.image}
//             alt={employee.name}
//             className="w-24 h-24 rounded-2xl object-cover"
//           />

//           <div>
//             <h2 className="text-2xl font-semibold">{employee.name}</h2>

//             {/* Status Color in modal */}
//             <p className={`font-medium mt-1 ${employee.status === "Inactive" ? "text-red-600" : "text-green-600"}`}>
//               {employee.status}
//             </p>
//           </div>
//         </div>

//         <button className="w-88 h-11 bg-purple-600 text-white rounded-full text-lg font-semibold mt-6 flex justify-center items-center mx-auto">
//           Delete Employee
//         </button>

//       </div>
//     </div>
//   );
// }


// "use client";

// import React from "react";
// import { FaTimes } from "react-icons/fa";

// type Employee = {
//   name: string;
//   status?: string;
//   image?: string;
//   mobile?: string;
//   mail?: string;
//   clockIn?: string;
//   clockOut?: string;
//   workedHours?: string;
//   totalTasks?: string;
//   completedTasks?: string;
// };

// type Props = {
//   isOpen: boolean;
//   onClose: () => void;
//   employee: Employee | null;
// };

// export default function EmployeeModal({ isOpen, onClose, employee }: Props) {
//   if (!isOpen || !employee) return null;

//   // 🔥 Status color
//   const statusColor =
//     employee.status === "Inactive" ? "text-red-600" : "text-green-600";

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-white w-[680px] rounded-3xl p-8 relative shadow-2xl">

//         {/* Close */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full active:scale-90"
//         >
//           <FaTimes className="text-gray-700" />
//         </button>

//         {/* Top Section */}
//         <div className="flex items-start gap-6">
//           <img
//             src={employee.image}
//             alt={employee.name}
//             className="w-32 h-32 rounded-2xl object-cover"
//           />

//           <div>
//             <h2 className="text-3xl font-semibold">{employee.name}</h2>
//             <p className={`${statusColor} font-medium mt-1`}>
//               {employee.status}
//             </p>
//           </div>
//         </div>

//         {/* Details Grid */}
//         <div className="mt-6 grid grid-cols-2 gap-y-4 text-lg">
//           <p className="font-semibold">Mobile :</p>
//           <p>{employee.mobile ?? "8639112756"}</p>

//           <p className="font-semibold">Mail :</p>
//           <p>{employee.mail ?? "sohail@gmail.com"}</p>

//           <p className="font-semibold">Clock In :</p>
//           <p>{employee.clockIn ?? "Not yet"}</p>

//           <p className="font-semibold">Clock Out :</p>
//           <p>{employee.clockOut ?? "7:03 PM"}</p>

//           <p className="font-semibold">Worked Hours :</p>
//           <p>{employee.workedHours ?? "00h:00m:00s"}</p>

//           <p className="font-semibold">Total Tasks :</p>
//           <p>{employee.totalTasks ?? "03"}</p>

//           <p className="font-semibold">Completed Tasks :</p>
//           <p>{employee.completedTasks ?? "20"}</p>
//         </div>

//         {/* Delete Button */}
//         <button
//           className="
//             w-88 h-11 
//             bg-[#8D6BDC] 
//             text-white 
//             rounded-full 
//             text-lg 
//             font-semibold 
//             mt-8
//             flex justify-center items-center
//             mx-auto
//             active:scale-95
//           "
//         >
//           Delete Employee
//         </button>
//       </div>
//     </div>
//   );
// }


// "use client";

// import React from "react";
// import { FaTimes } from "react-icons/fa";

// type Employee = {
//   name: string;
//   status?: string;
//   image?: string;
//   mobile?: string;
//   mail?: string;
//   clockIn?: string;
//   clockOut?: string;
//   workedHours?: string;
//   totalTasks?: string;
//   completedTasks?: string;
// };

// type Props = {
//   isOpen: boolean;
//   onClose: () => void;
//   employee: Employee | null;
// };

// export default function EmployeeModal({ isOpen, onClose, employee }: Props) {
//   if (!isOpen || !employee) return null;

//   // Status color
//   const statusColor =
//     employee.status === "Inactive" ? "text-red-600" : "text-green-600";

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

//       {/* SMALLER CARD */}
//       <div className="bg-white w-[420px] rounded-2xl p-6 relative shadow-xl">

//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 bg-gray-200 p-2 rounded-full active:scale-90"
//         >
//           <FaTimes className="text-gray-700 text-sm" />
//         </button>

//         {/* TOP SECTION */}
//         <div className="flex items-start gap-4">
//           <img
//             src={employee.image}
//             alt={employee.name}
//             className="w-20 h-20 rounded-xl object-cover"
//           />

//           <div>
//             <h2 className="text-xl font-semibold">{employee.name}</h2>
//             <p className={`${statusColor} text-sm mt-1`}>
//               {employee.status}
//             </p>
//           </div>
//         </div>

//         {/* DETAILS GRID (SMALL VERSION) */}
//         <div className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
//           <p className="font-semibold">Mobile :</p>
//           <p>{employee.mobile ?? "8639112756"}</p>

//           <p className="font-semibold">Mail :</p>
//           <p>{employee.mail ?? "sohail@gmail.com"}</p>

//           <p className="font-semibold">Clock In :</p>
//           <p>{employee.clockIn ?? "Not yet"}</p>

//           <p className="font-semibold">Clock Out :</p>
//           <p>{employee.clockOut ?? "7:03 PM"}</p>

//           <p className="font-semibold">Worked Hours :</p>
//           <p>{employee.workedHours ?? "00h:00m:00s"}</p>

//           <p className="font-semibold">Total Tasks :</p>
//           <p>{employee.totalTasks ?? "03"}</p>

//           <p className="font-semibold">Completed Tasks :</p>
//           <p>{employee.completedTasks ?? "20"}</p>
//         </div>

//         {/* SMALL DELETE BUTTON */}
//         <button
//           className="
//             w-64 h-10 
//             bg-[#8D6BDC] 
//             text-white 
//             rounded-full 
//             text-base 
//             font-semibold 
//             mt-6
//             flex justify-center items-center
//             mx-auto
//             active:scale-95
//           "
//         >
//           Delete Employee
//         </button>
//       </div>
//     </div>
//   );
// }


// "use client";

// import React from "react";
// import { FaTimes } from "react-icons/fa";

// type Employee = {
//   name: string;
//   status?: string;
//   image?: string;
//   mobile?: string;
//   mail?: string;
//   clockIn?: string;
//   clockOut?: string;
//   workedHours?: string;
//   totalTasks?: string;
//   completedTasks?: string;
// };

// type Props = {
//   isOpen: boolean;
//   onClose: () => void;
//   employee: Employee | null;
// };

// export default function EmployeeModal({ isOpen, onClose, employee }: Props) {
//   if (!isOpen || !employee) return null;

//   // Status Color
//   const statusColor =
//     employee.status === "Inactive" ? "text-red-600" : "text-green-600";

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

//       {/* MEDIUM SIZE CARD */}
//       <div className="bg-white w-[520px] rounded-3xl p-7 relative shadow-2xl">

//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full active:scale-90"
//         >
//           <FaTimes className="text-gray-700 text-base" />
//         </button>

//         {/* HEADER SECTION */}
//         <div className="flex items-start gap-5">
//           <img
//             src={employee.image}
//             alt={employee.name}
//             className="w-24 h-24 rounded-2xl object-cover"
//           />

//           <div>
//             <h2 className="text-2xl font-semibold">{employee.name}</h2>
//             <p className={`${statusColor} text-base mt-1`}>
//               {employee.status}
//             </p>
//           </div>
//         </div>

//         {/* DETAILS GRID */}
//         <div className="mt-6 grid grid-cols-2 gap-y-3 text-base">
//           <p className="font-semibold">Mobile :</p>
//           <p>{employee.mobile ?? "8639112756"}</p>

//           <p className="font-semibold">Mail :</p>
//           <p>{employee.mail ?? "sohail@gmail.com"}</p>

//           <p className="font-semibold">Clock In :</p>
//           <p>{employee.clockIn ?? "Not yet"}</p>

//           <p className="font-semibold">Clock Out :</p>
//           <p>{employee.clockOut ?? "7:03 PM"}</p>

//           <p className="font-semibold">Worked Hours :</p>
//           <p>{employee.workedHours ?? "00h:00m:00s"}</p>

//           <p className="font-semibold">Total Tasks :</p>
//           <p>{employee.totalTasks ?? "03"}</p>

//           <p className="font-semibold">Completed Tasks :</p>
//           <p>{employee.completedTasks ?? "20"}</p>
//         </div>

//         {/* DELETE BUTTON */}
//         <button
//           className="
//             w-72 h-11 
//             bg-[#8D6BDC] 
//             text-white 
//             rounded-full 
//             text-lg 
//             font-semibold 
//             mt-7
//             flex justify-center items-center
//             mx-auto
//             ac
//             tive:scale-95
//           "
//         >   
//           Delete Employee
//         </button>
//       </div>
//     </div>
//   );
// } 

"use client";

import React from "react";
import { FaTimes } from "react-icons/fa";

type Employee = {
  name: string;
  status?: string;
  image?: string;
  mobile?: string;
  mail?: string;
  clockIn?: string;
  clockOut?: string;
  workedHours?: string;
  totalTasks?: string;
  completedTasks?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;      // <-- NEW FUNCTION PROP
  employee: Employee | null;
};

export default function EmployeeModal({ isOpen, onClose, onDelete, employee }: Props) {
  if (!isOpen || !employee) return null;

  // Status Color
  const statusColor =
    employee.status === "Inactive" ? "text-red-600" : "text-green-600";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white w-[520px] rounded-3xl p-7 relative shadow-2xl">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full active:scale-90"
        >
          <FaTimes className="text-gray-700 text-base" />
        </button>

        {/* HEADER SECTION */}
        <div className="flex items-start gap-5">
          <img
            src={employee.image}
            alt={employee.name}
            className="w-24 h-24 rounded-2xl object-cover"
          />

          <div>
            <h2 className="text-2xl font-semibold">{employee.name}</h2>
            <p className={`${statusColor} text-base mt-1`}>
              {employee.status}
            </p>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="mt-6 grid grid-cols-2 gap-y-3 text-base">
          <p className="font-semibold">Mobile :</p>
          <p>{employee.mobile ?? "8639112756"}</p>

          <p className="font-semibold">Mail :</p>
          <p>{employee.mail ?? "sohail@gmail.com"}</p>

          <p className="font-semibold">Clock In :</p>
          <p>{employee.clockIn ?? "Not yet"}</p>

          <p className="font-semibold">Clock Out :</p>
          <p>{employee.clockOut ?? "7:03 PM"}</p>

          <p className="font-semibold">Worked Hours :</p>
          <p>{employee.workedHours ?? "00h:00m:00s"}</p>

          <p className="font-semibold">Total Tasks :</p>
          <p>{employee.totalTasks ?? "03"}</p>

          <p className="font-semibold">Completed Tasks :</p>
          <p>{employee.completedTasks ?? "20"}</p>
        </div>

        {/* DELETE BUTTON */}
        <button
          onClick={onDelete}      // <-- DELETE WORKS HERE
          className="
            w-72 h-11 
            bg-[#8D6BDC] 
            text-white 
            rounded-full 
            text-lg 
            font-semibold 
            mt-7
            flex justify-center items-center
            mx-auto
            active:scale-95
          "
        >
          Delete Employee
        </button>

      </div>
    </div>
  );
}
