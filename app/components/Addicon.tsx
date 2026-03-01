import Image from 'next/image'
import addicon from "@/app/images/add-icon.png"
import { HiPlusSm } from "react-icons/hi";


interface addIconProp {
    onClick: () => void;
}

const Addicon = ({onClick}:addIconProp) => {
  return (
    <div onClick={onClick} className="p-0.6 bg-(--color-primary) rounded-full text-(--color-sidebar) border-5">
      <HiPlusSm size={40} />
    </div>
  )
}

export default Addicon
