import React from "react";
import { MdClose } from "react-icons/md";

const Crossicon = ({onClick}: {onClick:() => void}) => {
  return (
    <button
      onClick={onClick}
      className="flex p-1 bg-(--color-secondary) rounded-full border-gray-100 border-4 justify-center items-center"
    >
      <MdClose size={28} className="opacity-10 animate-pulse" />
    </button>
  );
};

export default Crossicon;
