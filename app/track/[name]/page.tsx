// "use client";

// import { useEffect, useRef } from "react";
// import { useParams } from "next/navigation";
// import Sidebar from "@/app/components/Sidebar";

// declare global {
//   interface Window {
//     google: any;
//   }
// }

// export default function TrackingPage() {
//   const { name } = useParams(); 
//   const nameString = Array.isArray(name) ? name[0] : name;
//   const mapRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const initMap = () => {
//       if (!window.google || !mapRef.current) return;

//       const position = { lat: 12.9716, lng: 77.5946 }; // sample location

//       const map = new window.google.maps.Map(mapRef.current, {
//         center: position,
//         zoom: 14,
//       });
//       new window.google.maps.Marker({
//         position,
//         map,
//         title: `${nameString} Location`,
//       });
//     };

//     const interval = setInterval(() => {
//       if (window.google) {
//         initMap();
//         clearInterval(interval);
//       }
//     }, 300);
//   }, [nameString]);

//   return (
//     <div className="flex h-screen bg-gray-100 overflow-hidden">
//       <Sidebar />

//       <div className="flex-1 ml-64 p-6">
//         <h1 className="text-4xl font-bold text-[#8D6BDC] mb-4">
//           Live Tracking
//         </h1>

//         {/* Employee card preview */}
//         <div className="bg-white rounded-2xl shadow p-4 mb-6 flex items-center">
//           <img
//             src="https://randomuser.me/api/portraits/men/32.jpg"
//             alt={nameString}
//             className="w-16 h-16 rounded-xl object-cover"
//           />

//           <div className="ml-4">
//             <h2 className="text-xl font-semibold">{nameString}</h2>
//             <p className="text-gray-500">clock out at 7:30 PM</p>
//           </div>

//           <span className="ml-auto text-green-600 font-semibold">
//             Active
//           </span>
//         </div>

//         {/* Dropdown bar */}
//         <div className="bg-white rounded-full shadow h-14 flex items-center justify-center text-lg font-semibold text-gray-600 mb-4">
//           Live and History ▼
//         </div>

//         {/* Google Map */}
//         <div className="bg-white rounded-2xl shadow overflow-hidden h-[500px]">
//           <div ref={mapRef} className="w-full h-full" />
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useEffect, useRef } from "react";
// import { useParams } from "next/navigation";
// import Sidebar from "@/app/components/Sidebar";

// declare global {
//   interface Window {
//     google: any;
//   }
// }

// export default function TrackingPage() {
//   const { name } = useParams();
//   const mapRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const initMap = () => {
//       if (!window.google || !mapRef.current) return;

//       const position = { lat: 37.7749, lng: -122.4194 }; // sample map location

//       const map = new window.google.maps.Map(mapRef.current, {
//         center: position,
//         zoom: 13,
//       });

//       new window.google.maps.Marker({
//         position,
//         map,
//         title: `${name} Location`,
//       });
//     };

//     const interval = setInterval(() => {
//       if (window.google) {
//         initMap();
//         clearInterval(interval);
//       }
//     }, 300);
//   }, []);

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-100">
//       <Sidebar />

//       <div className="flex-1 ml-64 p-6 overflow-y-auto">

//         <h1 className="text-4xl font-bold text-[#8D6BDC] mb-6">Live Tracking</h1>

//         {/* EMPLOYEE TOP CARD */}
//         <div className="bg-white rounded-2xl p-4 flex items-center shadow mb-6">
//           <img
//             src="https://randomuser.me/api/portraits/men/32.jpg"
//             alt={name as string}
//             className="w-16 h-16 rounded-xl object-cover"
//           />

//           <div className="ml-4">
//             <h2 className="text-xl font-semibold">{name}</h2>
//             <p className="text-gray-500">clock out at 7:30 PM</p>
//           </div>

//           <span className="ml-auto text-green-600 font-semibold text-lg">
//             Active
//           </span>
//         </div>

//         {/* DROPDOWN BAR */}
//         <div className="bg-white rounded-full shadow h-14 flex items-center justify-center text-lg font-semibold text-gray-600 mb-6">
//           Live and History ▼
//         </div>

//         {/* ------------------ */}
//         {/* MAP + REPORTS ROW */}
//         {/* ------------------ */}
//         <div className="flex gap-6">

//           {/* MAP LEFT SIDE */}
//           <div className="bg-white rounded-2xl shadow overflow-hidden h-[500px] w-2/3">
//             <div ref={mapRef} className="w-full h-full" />
//           </div>

//           {/* REPORTS RIGHT SIDE */}
//           <div className="w-1/3 flex flex-col gap-4">

//             {/* REPORT CARD 1 */}
//             <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
//               <img
//                 src="/images/report.png"
//                 className="w-16 h-16 rounded-xl object-cover"
//                 alt="report"
//               />

//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold">Report</h3>
//                 <p className="text-sm text-gray-500">Type…….</p>
//                 <p className="text-sm text-gray-500">Note…….</p>
//               </div>

//               <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-semibold rounded-full">
//                 completed
//               </span>
//             </div>

//             {/* REPORT CARD 2 */}
//             <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
//               <img
//                 src="/images/report.png"
//                 className="w-16 h-16 rounded-xl object-cover"
//                 alt="report"
//               />

//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold">Report</h3>
//                 <p className="text-sm text-gray-500">Type…….</p>
//                 <p className="text-sm text-gray-500">Note…….</p>
//               </div>

//               <span className="px-3 py-1 bg-red-100 text-red-500 text-sm font-semibold rounded-full">
//                 pending
//               </span>
//             </div>

//             {/* REPORT CARD 3 */}
//             <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
//               <img
//                 src="/images/report.png"
//                 className="w-16 h-16 rounded-xl object-cover"
//                 alt="report"
//               />

//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold">Report</h3>
//                 <p className="text-sm text-gray-500">Type…….</p>
//                 <p className="text-sm text-gray-500">Note…….</p>
//               </div>

//               <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-sm font-semibold rounded-full">
//                 reschedule
//               </span>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// "use client";

// import { useEffect, useRef } from "react";
// import { useParams } from "next/navigation";
// import Sidebar from "@/app/components/Sidebar";

// // Add global declaration for window.google
// declare global {
//   interface Window {
//     google: any;
//   }
// }

// export default function TrackingPage() {
//   const { name } = useParams();
//   const mapRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const initMap = () => {
//       if (!window.google || !mapRef.current) return;

//       const position = { lat: 12.9716, lng: 77.5946 };

//       const map = new window.google.maps.Map(mapRef.current, {
//         center: position,
//         zoom: 13,
//       });

//       new window.google.maps.Marker({
//         position,
//         map,
//         title: `${name} Location`,
//       });
//     };

//     // Wait until Google Maps script loads
//     const timer = setInterval(() => {
//       if (window.google) {
//         initMap();
//         clearInterval(timer);
//       }
//     }, 300);
//   }, []);

//   return (
//     <div className="flex h-screen bg-gray-100 overflow-hidden">
//       <Sidebar />

//       <div className="flex-1 ml-64 p-6">
//         <h1 className="text-4xl font-bold text-[#8D6BDC] mb-4">Live Tracking</h1>

//         {/* Employee card */}
//         <div className="bg-white rounded-2xl p-4 flex items-center shadow mb-4">
//           <img
//             src="https://randomuser.me/api/portraits/men/32.jpg"
//             alt={Array.isArray(name) ? name[0] : name}
//             className="w-16 h-16 rounded-xl object-cover"
//           />

//           <div className="ml-4">
//             <h2 className="text-xl font-semibold capitalize">{name}</h2>
//             <p className="text-gray-500">clock out at 7:30 PM</p>
//           </div>

//           <span className="ml-auto text-green-600 font-semibold">Active</span>
//         </div>

//         {/* Dropdown */}
//         <div className="bg-white rounded-full shadow h-14 flex items-center justify-center text-lg font-semibold text-gray-600 mb-4">
//           Live and History ▼
//         </div>

//         {/* MAP + REPORTS ROW */}
//         <div className="flex gap-6">

//           {/* LEFT — MAP */}
//           <div className="bg-white rounded-2xl shadow overflow-hidden h-[500px] w-2/3">
//             <div ref={mapRef} className="w-full h-full" />
//           </div>

//           {/* RIGHT — REPORTS */}
//           <div className="w-1/3 flex flex-col gap-4">

//             <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
//               <img src="/images/images 1.png" className="w-16 h-16 rounded-xl" />
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold">Report</h3>
//                 <p className="text-sm text-gray-500">Type….</p>
//                 <p className="text-sm text-gray-500">Note….</p>
//               </div>
//               <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-semibold rounded-full">
//                 completed
//               </span>
//             </div>

//             <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
//               <img src="/images/images 1.png" className="w-16 h-16 rounded-xl" />
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold">Report</h3>
//                 <p className="text-sm text-gray-500">Type….</p>
//                 <p className="text-sm text-gray-500">Note….</p>
//               </div>
//               <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-full">
//                 pending
//               </span>
//             </div>

//             <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
//               <img src="/images/images 1.png" className="w-16 h-16 rounded-xl" />
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold">Report</h3>
//                 <p className="text-sm text-gray-500">Type….</p>
//                 <p className="text-sm text-gray-500">Note….</p>
//               </div>
//               <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-sm font-semibold rounded-full">
//                 reschedule
//               </span>
//             </div>

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }



// "use client";

// import { useEffect, useRef } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Sidebar from "@/app/components/Sidebar";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";



// // Fix default icon paths (use CDN images to avoid bundling issues)
// delete (L.Icon.Default as any).prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// export default function TrackingPage() {
//   const params = useParams();
//   const router = useRouter();
//   const mapRef = useRef<HTMLDivElement | null>(null);

//   // useParams returns possibly string or array; handle both
//   const name = Array.isArray(params?.name) ? params?.name[0] : params?.name ?? "Unknown";

//   useEffect(() => {
//     if (!mapRef.current) return;

//     // center coordinates (sample) — you can change to any lat/lng or compute dynamically
//     const center = [12.9716, 77.5946] as [number, number];

//     // create map (if not already created)
//     const map = L.map(mapRef.current, { center, zoom: 13, scrollWheelZoom: true });

//     // add OpenStreetMap tiles
//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution:
//         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//     }).addTo(map);

//     // add a marker for the employee
//     const marker = L.marker(center).addTo(map).bindPopup(`${name} Location`).openPopup();

//     // === Optional: simulate small movement every 2s (demo) ===
//     // We'll move marker slightly in a circle to demonstrate "live" movement (remove if not needed).
//     let angle = 0;
//     const interval = setInterval(() => {
//       angle += 10;
//       const r = 0.002; // small radius
//       const lat = center[0] + r * Math.cos((angle * Math.PI) / 180);
//       const lng = center[1] + r * Math.sin((angle * Math.PI) / 180);
//       marker.setLatLng([lat, lng]);
//       // optional: pan map slowly to the marker
//       // map.panTo([lat, lng], { animate: true, duration: 0.8 });
//     }, 2000);

//     // cleanup on unmount
//     return () => {
//       clearInterval(interval);
//       map.remove();
//     };
//   }, [name]);

//   return (
//     <div className="flex h-screen bg-gray-100 overflow-hidden">
//       <Sidebar />

//       <div className="flex-1 ml-64 p-6 relative">
//         {/* Close button top-right */}
//         <button
//           onClick={() => router.push("/employees")}
//           className="
//             absolute top-4 right-4 
//             bg-gray-200 w-10 h-10 
//             rounded-full flex items-center justify-center 
//             shadow active:scale-95 transition
//           "
//         >
//           <span className="text-gray-700 text-xl">✕</span>
//         </button>

//         <h1 className="text-4xl font-bold text-[#8D6BDC] mb-4">Live Tracking</h1>

//         {/* Employee card */}
//         <div className="bg-white rounded-2xl p-4 flex items-center shadow mb-4">
//           <img
//             src="https://randomuser.me/api/portraits/men/32.jpg"
//             alt={name}
//             className="w-16 h-16 rounded-xl object-cover"
//           />

//           <div className="ml-4">
//             <h2 className="text-xl font-semibold capitalize">{name}</h2>
//             <p className="text-gray-500">clock out at 7:30 PM</p>
//           </div>

//           <span className="ml-auto text-green-600 font-semibold">Active</span>
//         </div>

//         {/* Dropdown */}
//         <div className="bg-white rounded-full shadow h-14 flex items-center justify-center text-lg font-semibold text-gray-600 mb-4">
//           Live and History ▼
//         </div>

//         {/* MAP + REPORTS ROW */}
//         <div className="flex gap-6">
//           {/* LEFT — MAP */}
//           <div className="bg-white rounded-2xl shadow overflow-hidden h-[500px] w-2/3">
//             {/* map container */}
//             <div ref={mapRef} className="w-full h-full" />
//           </div>

//           {/* RIGHT — REPORTS */}
//           <div className="w-1/3 flex flex-col gap-4">
//             <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
//               <img src="/images/images 1.png" className="w-16 h-16 rounded-xl" />
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold">Report</h3>
//                 <p className="text-sm text-gray-500">Type….</p>
//                 <p className="text-sm text-gray-500">Note….</p>
//               </div>
//               <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-semibold rounded-full">
//                 completed
//               </span>
//             </div>

//             <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
//               <img src="/images/images 1.png" className="w-16 h-16 rounded-xl" />
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold">Report</h3>
//                 <p className="text-sm text-gray-500">Type….</p>
//                 <p className="text-sm text-gray-500">Note….</p>
//               </div>
//               <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-full">
//                 pending
//               </span>
//             </div>

//             <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
//               <img src="/images/images 1.png" className="w-16 h-16 rounded-xl" />
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold">Report</h3>
//                 <p className="text-sm text-gray-500">Type….</p>
//                 <p className="text-sm text-gray-500">Note….</p>
//               </div>
//               <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-sm font-semibold rounded-full">
//                 reschedule
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useEffect, useRef } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Sidebar from "@/app/components/Sidebar";
// import * as L from "leaflet";
// import "leaflet/dist/leaflet.css";

// // Fix Leaflet marker icon paths
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// export default function TrackingPage() {
//   const params = useParams();
//   const router = useRouter();
//   const mapRef = useRef<HTMLDivElement | null>(null);

//   const name = Array.isArray(params?.name)
//     ? params.name[0]
//     : params?.name ?? "Unknown";

//   useEffect(() => {
//     if (!mapRef.current) return;

//     const center: [number, number] = [12.9716, 77.5946];

//     const map = L.map(mapRef.current, {
//       center,
//       zoom: 13,
//       scrollWheelZoom: true,
//     });

//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution:
//         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//     }).addTo(map);

//     const marker = L.marker(center)
//       .addTo(map)
//       .bindPopup(`${name} Location`)
//       .openPopup();

//     // Optional movement effect
//     let angle = 0;
//     const interval = setInterval(() => {
//       angle += 10;
//       const r = 0.002;
//       const lat = center[0] + r * Math.cos((angle * Math.PI) / 180);
//       const lng = center[1] + r * Math.sin((angle * Math.PI) / 180);
//       marker.setLatLng([lat, lng]);
//     }, 2000);

//     return () => {
//       clearInterval(interval);
//       map.remove();
//     };
//   }, [name]);

//   return (
//     <div className="flex h-screen bg-gray-100 overflow-hidden">
//       <Sidebar />

//       <div className="flex-1 ml-64 p-6 relative">

//         {/* Close Button */}
//         <button
//           onClick={() => router.push("/employees")}
//           className="absolute top-4 right-4 bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center shadow active:scale-95"
//         >
//           <span className="text-gray-700 text-xl">✕</span>
//         </button>

//         <h1 className="text-4xl font-bold text-[#8D6BDC] mb-4">
//           Live Tracking
//         </h1>

//         {/* Employee Card */}
//         <div className="bg-white rounded-2xl p-4 flex items-center shadow mb-4">
//           <img
//             src="https://randomuser.me/api/portraits/men/32.jpg"
//             alt={name}
//             className="w-16 h-16 rounded-xl object-cover"
//           />
//           <div className="ml-4">
//             <h2 className="text-xl font-semibold capitalize">{name}</h2>
//             <p className="text-gray-500">clock out at 7:30 PM</p>
//           </div>
//           <span className="ml-auto text-green-600 font-semibold">Active</span>
//         </div>

//         {/* Dropdown */}
//         <div className="bg-white rounded-full shadow h-14 flex items-center justify-center text-lg font-semibold text-gray-600 mb-4">
//           Live and History ▼
//         </div>

//         {/* MAP + REPORTS */}
//         <div className="flex gap-6">

//           {/* Map */}
//           <div className="bg-white rounded-2xl shadow overflow-hidden h-[500px] w-2/3">
//             <div ref={mapRef} className="w-full h-full" />
//           </div>

//           {/* Reports */}
//           <div className="w-1/3 flex flex-col gap-4">

//             {/* Completed */}
//             <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
//               <img src="/images/images 1.png" className="w-16 h-16 rounded-xl" />
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold">Report</h3>
//                 <p className="text-sm text-gray-500">Type….</p>
//                 <p className="text-sm text-gray-500">Note….</p>
//               </div>
//               <span className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full">
//                 completed
//               </span>
//             </div>

//             {/* Pending */}
//             <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
//               <img src="/images/images 1.png" className="w-16 h-16 rounded-xl" />
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold">Report</h3>
//                 <p className="text-sm text-gray-500">Type….</p>
//                 <p className="text-sm text-gray-500">Note….</p>
//               </div>
//               <span className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-full">
//                 pending
//               </span>
//             </div>

//             {/* Reschedule */}
//             <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
//               <img src="/images/images 1.png" className="w-16 h-16 rounded-xl" />
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold">Report</h3>
//                 <p className="text-sm text-gray-500">Type….</p>
//                 <p className="text-sm text-gray-500">Note….</p>
//               </div>
//               <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-sm rounded-full">
//                 reschedule
//               </span>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement | null>(null);

  const name = Array.isArray(params?.name)
    ? params.name[0]
    : params?.name ?? "Unknown";

  // useEffect(() => {
  //   if (!mapRef.current) return;

  //   const center: [number, number] = [12.9716, 77.5946];

  //   const map = L.map(mapRef.current, {
  //     center,
  //     zoom: 13,
  //     scrollWheelZoom: true,
  //   });

  //   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  //     attribution:
  //       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  //   }).addTo(map);

  //   // Initial marker
  //   const marker = L.marker(center)
  //     .addTo(map)
  //     .bindPopup(`${name} Location`)
  //     .openPopup();

  //   // ⭐⭐⭐ REAL LIVE GPS TRACKING ⭐⭐⭐
  //   if (navigator.geolocation) {
  //     navigator.geolocation.watchPosition(
  //       (pos) => {
  //         const { latitude, longitude } = pos.coords;

  //         const livePos: [number, number] = [latitude, longitude];

  //         // Move marker to live position
  //         marker.setLatLng(livePos);

  //         // Recenter map
  //         map.setView(livePos);
  //       },
  //       (err) => {
  //         console.log("Location Error:", err.message);
  //       },
  //       {
  //         enableHighAccuracy: true,
  //         maximumAge: 0,
  //         timeout: 5000,
  //       }
  //     );
  //   } else {
  //     console.log("Geolocation NOT supported");
  //   }

  //   return () => {
  //     map.remove();
  //   };
  // }, [name]);


//   useEffect(() => {
//   if (!mapRef.current) return;

//   navigator.geolocation.getCurrentPosition(
//     (pos) => {
//       const { latitude, longitude } = pos.coords;
//       const userPos: [number, number] = [latitude, longitude];

//       const map = L.map(mapRef.current!, {
//         center: userPos,
//         zoom: 15,
//       });

//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution:
//           '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//       }).addTo(map);

//       const marker = L.marker(userPos).addTo(map);

//       navigator.geolocation.watchPosition(
//         (livePos) => {
//           const { latitude, longitude } = livePos.coords;
//           const newPos: [number, number] = [latitude, longitude];

//           marker.setLatLng(newPos);
//           map.setView(newPos);
//         },
//         (err) => console.log("Live location error:", err),
//         { enableHighAccuracy: true }
//       );

//       return () => map.remove();
//     },
//     (err) => {
//       console.log("Location Permission Denied:", err);
//       alert("Please enable GPS / Location permission.");
//     },
//     { enableHighAccuracy: true }
//   );
// }, [name]);


useEffect(() => {
  if (!mapRef.current) return;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      const userPos: [number, number] = [latitude, longitude];

      const map = L.map(mapRef.current!, {
        center: userPos,
        zoom: 15
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const marker = L.marker(userPos).addTo(map);

      navigator.geolocation.watchPosition(
        (livePos) => {
          const { latitude, longitude } = livePos.coords;
          const newPos: [number, number] = [latitude, longitude];

          marker.setLatLng(newPos); 
          map.setView(newPos);
        },
        (err) => console.log("Live location error:", err),
        { enableHighAccuracy: true }
      );
    },
    (err) => {
      alert("Please enable Location Permission in your browser.");
      console.log(err);
    },
    { enableHighAccuracy: true }
  );
}, []);



  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex-1 ml-64 p-6 relative">

        {/* Close Button */}
        <button
          onClick={() => router.push("/employees")}
          className="absolute top-4 right-4 bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center shadow active:scale-95"
        >
          <span className="text-gray-700 text-xl">✕</span>
        </button>

        <h1 className="text-4xl font-bold text-[#8D6BDC] mb-4">
          Live Tracking
        </h1>

        {/* Employee Card */}
        <div className="bg-white rounded-2xl p-4 flex items-center shadow mb-4">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt={name}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div className="ml-4">
            <h2 className="text-xl font-semibold capitalize">{name}</h2>
            <p className="text-gray-500">clock out at 7:30 PM</p>
          </div>
          <span className="ml-auto text-green-600 font-semibold">Active</span>
        </div>

        {/* Dropdown */}
        <div className="bg-white rounded-full shadow h-14 flex items-center justify-center text-lg font-semibold text-gray-600 mb-4">
          Live and History ▼
        </div>

        {/* MAP + REPORTS */}
        <div className="flex gap-6">

          {/* Map */}
          <div className="bg-white rounded-2xl shadow overflow-hidden h-[500px] w-2/3">
            <div ref={mapRef} className="w-full h-full" />
          </div>

          {/* Reports */}
          <div className="w-1/3 flex flex-col gap-4">
            
            <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
              <img src="/images/images 1.png" className="w-16 h-16 rounded-xl" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Report</h3>
                <p className="text-sm text-gray-500">Type….</p>
                <p className="text-sm text-gray-500">Note….</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full">
                completed
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
              <img src="/images/images 1.png" className="w-16 h-16 rounded-xl" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Report</h3>
                <p className="text-sm text-gray-500">Type….</p>
                <p className="text-sm text-gray-500">Note….</p>
              </div>
              <span className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-full">
                pending
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
              <img src="/images/images 1.png" className="w-16 h-16 rounded-xl" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Report</h3>
                <p className="text-sm text-gray-500">Type….</p>
                <p className="text-sm text-gray-500">Note….</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-sm rounded-full">
                reschedule
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
