// // interface EmployeeCardProps {
// //   name: string;
// //   status: string;
// //   image?: string;
// // }

// // export default function EmployeeCard({ name, status, image }: EmployeeCardProps) {
// //   return (
// //     <div className="  bg-white p-6 rounded-2xl shadow-md flex flex-col items-center relative">

// //       {/* Status (top-right like your reference) */}
// //       <span className="absolute top-1.5 right-2 text-green-600 text-xs font-bold">
// //         {status}
// //       </span>

// //       {/* Centered Employee Image */}
// //       <img
// //         src={image || "https://via.placeholder.com/60"}
// //         alt={name}
// //         className="w-15 h-15 rounded-xl object-cover mb-3"
// //       />

// //       {/* Name */}
// //       <h3 className="text-sm font-bold text-black mb-4">{name}</h3>

// //       {/* Buttons */}
// //       <div className="flex gap-6  h-7 ">
// //         <button className="w-16 flex justify-center items-center
// //                      bg-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow ">
// //           View
// //         </button>

// //         <button className="w-16 flex justify-center items-center
// //                        bg-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow">
// //           Track
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// interface EmployeeCardProps {
//   name: string;
//   status: string;
//   image?: string;
//   onView?: () => void; // 🔥 add callback for modal open
// }

// export default function EmployeeCard({ name, status, image, onView }: EmployeeCardProps) {
//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center relative">

//       {/* Status */}
//       <span className="absolute top-1.5 right-2 text-green-600 text-xs font-bold">
//         {status}
//       </span>

//       {/* Employee Image */}
//       <img
//         src={image || "https://via.placeholder.com/60"}
//         alt={name}
//         className="w-15 h-15 rounded-xl object-cover mb-3"
//       />

//       {/* Name */}
//       <h3 className="text-sm font-bold text-black mb-4">{name}</h3>

//       {/* Buttons */}
//       <div className="flex gap-6 h-7">
//         {/* VIEW BUTTON */}
//         <button
//           onClick={onView}  // 🔥 This triggers modal
//           className="w-16 flex justify-center items-center
//           bg-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow"
//         >
//           View
//         </button>

//         {/* TRACK BUTTON */}
//         <button className="w-16 flex justify-center items-center
//           bg-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow">
//           Track
//         </button>
//       </div>
//     </div>
//   );
// }


// "use client";

// import React from "react";

// interface EmployeeCardProps {
//   name: string;
//   status: string;
//   image?: string;
//   onView?: () => void;
// }

// export default function EmployeeCard({ name, status, image, onView }: EmployeeCardProps) {
//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center relative">

//       {/* Status */}
//       <span className="absolute top-1.5 right-2 text-green-600 text-xs font-bold">{status}</span>

//       {/* Image */}
//       <img
//         src={image ?? "https://via.placeholder.com/60"}
//         alt={name}
//         className="w-15 h-15 rounded-xl object-cover mb-3"
//       />

//       {/* Name */}
//       <h3 className="text-sm font-bold text-black mb-4">{name}</h3>

//       {/* Buttons */}
//       <div className="flex gap-6 h-7">

//         {/* Touchable Opacity Button */}
//         <button
//           onClick={onView}
//           className="
//             w-16 flex justify-center items-center
//             bg-[#8D6BDC]  text-white px-6 py-2 rounded-full
//             text-sm font-semibold shadow
//             active:scale-95 active:opacity-80 transition"
//         >
//           View
//         </button>

//         <button className="
//           w-16 flex justify-center items-center
//           bg-[#8D6BDC] text-white px-6 py-2 rounded-full
//           text-sm font-semibold shadow
//           active:scale-95 transition">
//           Track
//         </button>

//       </div>
//     </div>
//   );
// }


// interface EmployeeCardProps {
//   name: string;
//   status: string;
//   image?: string;
//   onView?: () => void;
// }

// export default function EmployeeCard({ name, status, image, onView }: EmployeeCardProps) {
//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center relative">

//       {/* Status — Active = Green, Inactive = Red */}
//       <span
//         className={`absolute top-1.5 right-2 text-xs font-bold
//           ${status === "Inactive" ? "text-red-600" : "text-green-600"}
//         `}
//       >
//         {status}
//       </span>

//       {/* Image */}
//       <img
//         src={image ?? "https://via.placeholder.com/60"}
//         alt={name}
//         className="w-15 h-15 rounded-xl object-cover mb-3"
//       />

//       {/* Name */}
//       <h3 className="text-sm font-bold text-black mb-4">{name}</h3>

//       {/* Buttons */}
//       <div className="flex gap-6 h-7">

//         {/* Touchable Opacity View Button */}
//         <button
//           onClick={onView}
//           className="
//             w-16 flex justify-center items-center
//             bg-[#8D6BDC] text-white px-6 py-2 rounded-full
//             text-sm font-semibold shadow
//             active:scale-95 active:opacity-80 transition
//           "
//         >
//           View
//         </button>

//         {/* Track Button */}
//         <button
//           className="
//             w-16 flex justify-center items-center
//             bg-[#8D6BDC] text-white px-6 py-2 rounded-full
//             text-sm font-semibold shadow
//             active:scale-95 transition
//           "
//         >
//           Track
//         </button>

//       </div>
//     </div>
//   );
// }


interface EmployeeCardProps {
  name: string;
  status: string;
  image?: string;
  onView?: () => void;
}

export default function EmployeeCard({ name, status, image, onView }: EmployeeCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center relative">

      {/* Status Color */}
      <span
        className={`absolute top-1.5 right-2 text-xs font-bold 
          ${status === "Inactive" ? "text-red-600" : "text-green-600"}
        `}
      >
        {status}
      </span>

      <img
        src={image ?? "https://via.placeholder.com/60"}
        alt={name}
        className="w-15 h-15 rounded-xl object-cover mb-3"
      />

      <h3 className="text-sm font-bold text-black mb-4">{name}</h3>

      <div className="flex gap-6 h-7">
        <button
          onClick={onView}
          className="w-16 flex justify-center items-center bg-[#8D6BDC] text-white px-6 py-2 rounded-full text-sm font-semibold shadow active:scale-95 transition"
        >
          View
        </button>

        <button className="w-16 flex justify-center items-center bg-[#8D6BDC] text-white px-6 py-2 rounded-full text-sm font-semibold shadow active:scale-95 transition">
          Track
        </button>
      </div>
    </div>
  );
}
