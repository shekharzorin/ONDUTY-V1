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
