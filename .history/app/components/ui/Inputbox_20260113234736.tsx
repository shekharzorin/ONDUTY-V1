import { Eye } from "lucide-react";
import React, { useState } from "react";
import { FiEyeOff } from "react-icons/fi";
import {IoMdEye, IoMdEyeOff } from "react-icons/io";

interface InputBoxProps {
  icon?: React.ReactNode;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;

  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: "on" | "off";
  maxLength?: number;
  pattern?: string;
}


const Inputbox = ({
  icon,
  placeholder = "",
  type = "text",
  value,
  onChange,
  disabled = false,
  className = "",
}: InputBoxProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className={ `flex flex-col gap-1 w-full bg-(--color-sidebar) ${className}`}>
      <div className="relative flex items-center">
        
        {icon && (
          <span className="absolute left-4 text-(--color-gray) justify-center items-center">
            {icon}
          </span>
        )}

        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-5 py-3  pl-12 pr-12 outline-none transition-all font-medium text-(--color-gray) ${
            disabled ? "bg-gray-100" : ""
          } ${className}`}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-(--color-gray)"
          >
            {showPassword ? <Eye size={28} /> : <FiEyeOff size={28} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Inputbox;
