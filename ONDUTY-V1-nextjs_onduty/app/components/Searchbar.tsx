import { IoSearch } from "react-icons/io5";

interface searchbarProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

const Searchbar = ({ placeholder = "Search something...", type = "text", value, onChange }: searchbarProps) => {
  return (
    <div className="flex items-center gap-3 p-3 w-full border-2 border-[#b2b2b2] rounded-full bg-(--color-sidebar) text-(--color-gray)">
      
      <IoSearch size={24} className="text-(--color-gray)" />

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent outline-none font-medium text-(--color-gray)"
      />

    </div>
  );
};

export default Searchbar;
