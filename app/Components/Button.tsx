"use client";
import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  outline?: boolean;
  disabled?: boolean;
  small?: boolean;
  Icon?: IconType;
}

// Adds a style rule to the component that will be rendered when the button is clicked
export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  Icon: Icon,
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative disabled:opacity-70 
      disabled:cursor-not-allowed rounded-lg 
      hover:opacity-80 transition-all w-full text-center ${
        outline
          ? "bg-green-300 border-white text-slate-700 text-center"
          : "bg-violet-500 border-white text-white"
      } py-3 text-md font-semibold border-[2px]`}
    >
      {Icon && <Icon className="absolute left-4 top-3" size={24} />}
      {label}
    </button>
  );
};

export default Button;
