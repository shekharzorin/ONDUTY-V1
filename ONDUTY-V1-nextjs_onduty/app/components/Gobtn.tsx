import { FaArrowRight } from "react-icons/fa";

interface gobtnProp {
    onClick: () => void;
}

const Gobtn = ({ onClick }: gobtnProp) => {
    return (
        <div className="rounded-full p-3 bg-(--color-primary) cursor-pointer" onClick={onClick}>
            <FaArrowRight size={20} className="text-(--color-sidebar)" />
        </div>
    )
}

export default Gobtn
