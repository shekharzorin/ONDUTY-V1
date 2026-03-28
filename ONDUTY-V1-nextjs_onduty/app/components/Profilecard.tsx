import React from "react";

type Props = {
  title: string;
  placeholder: string;
  value: string;
  setValue: (text: string) => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: React.HTMLInputTypeAttribute;
} & React.InputHTMLAttributes<HTMLInputElement>;

const ProfileCard = ({
  title,
  placeholder,
  value,
  setValue,
  autoCapitalize = "none",
  keyboardType = "text",
  ...props
}: Props) => {
  return (
    <div className="flex flex-col bg-(--color-sidebar) rounded-2xl px-7 py-3 w-full h-[90px] gap-3">
      {/* Title */}
      <label className="text-(--color-gray) font-medium">
        {title}
      </label>

      {/* Input */}
      <input
        type={keyboardType}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="font-semibold outline-0"
        {...props}
      />
    </div>
  );
};

export default ProfileCard;
