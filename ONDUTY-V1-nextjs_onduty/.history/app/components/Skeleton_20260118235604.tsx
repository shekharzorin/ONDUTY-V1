import React from "react";

const Skeleton = () => {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-(--color-bg)">
      <div className="flex flex-col gap-6 max-w-md w-full animate-pulse">
        {/* Logo placeholder */}
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-gray-300" />
        </div>

        {/* Title */}
        <div className="h-6 w-2/3 bg-gray-300 rounded mx-auto" />

        {/* Text lines */}
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded mx-auto" />

        {/* Button */}
        <div className="h-12 w-full bg-gray-300 rounded-full mt-4" />
      </div>
    </main>
  );
};

export default Skeleton;
