import { MdDelete } from 'react-icons/md'

interface deletebtnProps {
    onClick : () => void;
}

const Deletebtn = ({onClick} : deletebtnProps) => {
    return (
        <button className="flex p-3 rounded-full bg-(--color-primary) text-(--color-sidebar) cursor-pointer" onClick={onClick}>
            <MdDelete size={25} />
        </button>
    )
}

export default Deletebtn
