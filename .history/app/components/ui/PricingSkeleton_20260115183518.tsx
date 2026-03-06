import React from "react";

const PricingSkeleton = () => {
  return (
    <div className="flex items-center justify-center gap-5 md:gap-10 flex-wrap">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-full rounded-3xl bg-white/30 backdrop-blur-md border border-white p-10 shadow-lg animate-pulse"
        >
          <div className="h-6 w-1/2 bg-gray-300/60 rounded mb-6 mx-auto" />

          <div className="h-10 w-3/4 bg-gray-300/60 rounded mb-4" />
          <div className="h-4 w-1/2 bg-gray-300/50 rounded mb-8" />

          <div className="space-y-3 mb-6">
            {[1, 2, 3, 4].map((f) => (
              <div key={f} className="h-4 bg-gray-300/50 rounded" />
            ))}
          </div>

          <div className="flex gap-3">
            <div className="h-10 w-full bg-gray-300/60 rounded-full" />
            <div className="h-10 w-full bg-gray-300/60 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PricingSkeleton;
