"use client";

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
        src={image ?? "/images/emp 1.png"}
        alt={name}
        className="w-16 h-16 rounded-xl object-cover mb-3"
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
