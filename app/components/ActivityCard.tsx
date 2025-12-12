"use client";

import { FaArrowRight } from "react-icons/fa";

interface ActivityCardProps {
    name: string;
    type: string;
    img: string;
    onClick: () => void;
}

export default function ActivityCard({ name, type, img, onClick }: ActivityCardProps) {
    return (
        <div className="bg-white rounded-2xl p-4 shadow hover:shadow-md transition flex items-center justify-between">
            <div className="flex items-center gap-4">
                <img
                    src={img}
                    alt={name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-100"
                />
                <div>
                    <h3 className="font-bold text-gray-800">{name}</h3>
                    <p className="text-sm text-gray-500">{type}</p>
                </div>
            </div>

            <button
                onClick={onClick}
                className="text-gray-300 hover:text-[#8D6BDC] p-2 transition rounded-full hover:bg-purple-50"
            >
                <FaArrowRight />
            </button>
        </div>
    );
}
