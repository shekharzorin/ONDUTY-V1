interface ButtonProps {
  title: string;
  onClick: () => void;
  type?: "button" | "submit";
  disabled?: boolean; // <-- added
}

const Button = ({
  title,
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined} // prevents trigger
      disabled={disabled}
      className={`flex w-full items-center justify-center px-4 py-2 rounded-2xl font-semibold transition cursor-pointer
        ${
          disabled
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-(--color-primary) text-(--color-sidebar) hover:bg-[#ba9dff]"
        }
      `}
    >
      {title}
    </button>
  );
};

export default Button;
