// // "use client";

// // import { FaTimes, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
// // import Image from "next/image";

// // type Props = {
// //   isOpen: boolean;
// //   onClose: () => void;
// // };

// // export default function AddEmployeeModal({ isOpen, onClose }: Props) {
// //   if (!isOpen) return null;

// //   return (
// //     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
// //       <div className="bg-white w-[650px] rounded-3xl p-8 relative shadow-2xl">

// //         {/* Close Button */}
// //         <button
// //           onClick={onClose}
// //           className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full active:scale-90 transition"
// //         >
// //           <FaTimes className="text-gray-700 text-lg" />
// //         </button>

// //         {/* Title */}
// //         <h2 className="text-3xl font-bold text-purple-600 text-center">
// //           Add Employee
// //         </h2>

// //         {/* Illustration Image */}
// //         <div className="flex justify-center my-6">
// //           <Image
// //             src="/images/add-employee.png" 
// //             alt="Add Employee Illustration"
// //             width={230}
// //             height={180}
// //             className="object-contain"
// //           />
// //         </div>

// //         {/* Input: Name */}
// //         <div className="bg-gray-100 flex items-center gap-4 w-full h-14 px-4 rounded-xl mb-4 text-gray-700">
// //           <FaUser className="text-xl" />
// //           <input
// //             type="text"
// //             placeholder="Enter employee name"
// //             className="bg-transparent w-full outline-none text-lg"
// //           />
// //         </div>

// //         {/* Input: Email */}
// //         <div className="bg-gray-100 flex items-center gap-4 w-full h-14 px-4 rounded-xl mb-4 text-gray-700">
// //           <FaEnvelope className="text-xl" />
// //           <input
// //             type="email"
// //             placeholder="Enter employee email"
// //             className="bg-transparent w-full outline-none text-lg"
// //           />
// //         </div>

// //         {/* Input: Password */}
// //         <div className="bg-gray-100 flex items-center gap-4 w-full h-14 px-4 rounded-xl mb-4 text-gray-700">
// //           <FaLock className="text-xl" />
// //           <input
// //             type="password"
// //             placeholder="Create Password"
// //             className="bg-transparent w-full outline-none text-lg"
// //           />
// //         </div>

// //         {/* Submit Button */}
// //         <button
// //           className="
// //             w-full h-12 bg-[#8D6BDC] text-white
// //             rounded-full text-lg font-semibold mt-4
// //             flex justify-center items-center
// //             active:scale-95 transition
// //           "
// //         >
// //           Add Employee
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }


// "use client";

// import { FaTimes, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
// import Image from "next/image";

// type Props = {
//   isOpen: boolean;
//   onClose: () => void;
// };

// export default function AddEmployeeModal({ isOpen, onClose }: Props) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      
//       {/* Smaller Card */}
//       <div className="bg-white w-[520px] rounded-3xl p-6 relative shadow-xl">

//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 bg-gray-200 p-2 rounded-full active:scale-90 transition"
//         >
//           <FaTimes className="text-gray-700 text-lg" />
//         </button>

//         {/* Title */}
//         <h2 className="text-2xl font-bold text-[#8D6BDC] text-center">
//           Add Employee
//         </h2>

//         {/* Illustration Image */}
//         <div className="flex justify-center my-4">
//           <Image
//             src="/images/add-employee.png"
//             alt="Add Employee Illustration"
//             width={180}
//             height={130}
//             className="object-contain"
//           />
//         </div>

//         {/* Input: Name */}
//         <div className="bg-gray-100 flex items-center gap-3 w-full h-12 px-4 rounded-xl mb-3 text-gray-700">
//           <FaUser className="text-lg" />
//           <input
//             type="text"
//             placeholder="Enter employee name"
//             className="bg-transparent w-full outline-none text-base"
//           />
//         </div>

//         {/* Input: Email */}
//         <div className="bg-gray-100 flex items-center gap-3 w-full h-12 px-4 rounded-xl mb-3 text-gray-700">
//           <FaEnvelope className="text-lg" />
//           <input
//             type="email"
//             placeholder="Enter employee email"
//             className="bg-transparent w-full outline-none text-base"
//           />
//         </div>

//         {/* Input: Password */}
//         <div className="bg-gray-100 flex items-center gap-3 w-full h-12 px-4 rounded-xl mb-3 text-gray-700">
//           <FaLock className="text-lg" />
//           <input
//             type="password"
//             placeholder="Create Password"
//             className="bg-transparent w-full outline-none text-base"
//           />
//         </div>

//         {/* Smaller Button */}
//         <button
//           className="
//             w-full h-11 bg-[#8D6BDC] text-white
//             rounded-full text-base font-semibold mt-3
//             flex justify-center items-center
//             active:scale-95 transition
//           "
//         >
//           Add Employee
//         </button>

//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { FaTimes, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import Image from "next/image";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (employee: { name: string; status: string; image: string }) => void;
};

export default function AddEmployeeModal({ isOpen, onClose, onAdd }: Props) {
  if (!isOpen) return null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdd = () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    // Add a new employee
    onAdd({
      name,
      status: "Active",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    });

    // Clear form
    setName("");
    setEmail("");
    setPassword("");

    // Close modal
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[520px] rounded-3xl p-6 relative shadow-xl">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-200 p-2 rounded-full active:scale-90 transition"
        >
          <FaTimes className="text-gray-700 text-lg" />
        </button>

        <h2 className="text-2xl font-bold text-[#8D6BDC] text-center">Add Employee</h2>

        <div className="flex justify-center my-4">
          <Image
            src="/images/emp 1.png"
            alt="Add Employee Illustration"
            width={180}
            height={130}
            className="object-contain"
          />
        </div>

        {/* Name */}
        <div className="bg-gray-100 flex items-center gap-3 w-full h-12 px-4 rounded-xl mb-3 text-gray-700">
          <FaUser className="text-lg" />
          <input
            type="text"
            placeholder="Enter employee name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent w-full outline-none text-base"
          />
        </div>

        {/* Email */}
        <div className="bg-gray-100 flex items-center gap-3 w-full h-12 px-4 rounded-xl mb-3 text-gray-700">
          <FaEnvelope className="text-lg" />
          <input
            type="email"
            placeholder="Enter employee email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent w-full outline-none text-base"
          />
        </div>

        {/* Password */}
        <div className="bg-gray-100 flex items-center gap-3 w-full h-12 px-4 rounded-xl mb-3 text-gray-700">
          <FaLock className="text-lg" />
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent w-full outline-none text-base"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleAdd}
          className="w-full h-11 bg-[#8D6BDC] text-white rounded-full text-base font-semibold mt-3 flex justify-center items-center active:scale-95 transition"
        >
          Add Employee
        </button>
      </div>
    </div>
  );
}
