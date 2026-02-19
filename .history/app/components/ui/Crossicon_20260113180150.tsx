import React from "react";

const Crossicon = () => {
  return (
    <button
      onClick={() => void 0}
      className="absolute top-7.25 right-4 md:right-8 lg:hidden z-20 flex p-1 bg-(--color-secondary) rounded-full border-gray-100 border-4 justify-center items-center"
    >
      <MdClose size={28} className="opacity-10 animate-pulse" />
    </button>
  );
};

export default Crossicon;
