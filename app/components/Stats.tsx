// export default function TopStats() {
//   return (
//       <div className="grid grid-cols-3 gap-6 mb-6">
//       <div className="bg-white p-6 rounded-2xl shadow text-center">
//       <p className="text-gray-500">Total Employees</p>
//       <p className="text-3xl font-bold text-purple-600">04</p>
//       </div>

//       <div className="bg-white p-6 rounded-2xl shadow text-center">
//         <p className="text-gray-500">Present</p>
//         <p className="text-3xl font-bold text-purple-600">02</p>
//       </div>

//       <div className="bg-white p-6 rounded-2xl shadow text-center">
//         <p className="text-gray-500">Absent</p>
//         <p className="text-3xl font-bold text-purple-600">02</p>
//       </div>
//     </div>
//   );
// }


interface StatsProps {
  total: number;
  active: number;
  inactive: number;
}

export default function Stats({ total, active, inactive }: StatsProps) {
  return (
    <div className="grid grid-cols-3 gap-6 mb-6">

      <div className="bg-white p-6 rounded-2xl shadow text-center">
        <p className="text-gray-500">Total Employees</p>
        <p className="text-3xl font-bold text-[#8D6BDC]">{total}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow text-center">
        <p className="text-gray-500">Present</p>
        <p className="text-3xl font-bold text-[#8D6BDC]">{active}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow text-center">
        <p className="text-gray-500">Absent</p>
        <p className="text-3xl font-bold text-[#8D6BDC]">{inactive}</p>
      </div>

    </div>
  );
}
