import React from "react";
import { MdClose } from "react-icons/md";

const Crossicon = ({onClick}: {onClick:() => void}) => {
  return (
    <button
      onClick={onClick}
      className="p-1 bg-(--color-secondary) rounded-full border-gray-100 border-2 justify-center items-center cursor-pointer"
    >
      <MdClose size={28} className="opacity-10 animate-pulse" />
    </button>
  );
};

export default Crossicon;
