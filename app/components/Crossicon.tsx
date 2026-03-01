import { FaTimes } from 'react-icons/fa'

interface crossIconProps {
    onClick : () => void;
}

const Crossicon = ({onClick} : crossIconProps) => {
  return (
    <button className='p-2 bg-(--color-gray) rounded-full cursor-pointer' onClick={onClick}>
      <FaTimes size={20} className="text-(--color-sidebar)" />
    </button>
  )
}

export default Crossicon
