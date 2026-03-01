import { HiChevronLeft } from "react-icons/hi";

const Header = ({ title, onClick }: { title: string; onClick: () => void }) => {
    return (
        <div className="relative w-full flex items-center p-8">
            <p className="mx-auto font-bold text-2xl text-(--color-primary)">{title}</p>
            <button onClick={onClick} className="absolute right-9 p-0.5 rounded-full bg-(--color-primary) hover:cursor-pointer hover:shadow-lg text-(--color-sidebar)">
                <HiChevronLeft size={50} className="pr-1"/>
            </button>
        </div>
    );
};

export default Header;
