"use client";
import { BiPound } from "react-icons/bi";
import {
  Field,
  FieldErrors,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  validation?: {};
}
const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  disabled,
  formatPrice,
  required,
  register,
  errors,
  validation,
}) => {
  const errorMessage = errors[id]?.message as string | undefined;
  const effectiveLabel = errorMessage || label;
  return (
    <div className="w-full relative">
      {formatPrice && (
        <BiPound size={24} className="text-neutral-700 absolute top-5 left-2" />
      )}

      <input
        id={id}
        disabled={disabled}
        {...register(id, { required, ...validation })}
        placeholder=" "
        type={type}
        className={`peer
            w-full
            p-4
            pt-6
            font-light
            bg-white
            border-2
            rounded-md
            outline-none
            transition
            disabled:opacity-70
            disabled:cursor-not-allowed
            ${formatPrice ? "pl-9" : "pl-4"}
            ${errors[id] ? "border-rose-500" : "border-neutral-300"}
            ${
              errors[id] ? "focus:border-rose-500" : "focus:border-neutral-300"
            }`}
      />
      <label
        htmlFor={id} // Ensure the label is correctly associated with the input
        className={`absolute
      text-md duration-150 transform -translate-y-3
      top-5 z-10 origin-[0]
      ${formatPrice ? "left-9" : "left-4"}
      peer-placeholder-shown:scale-100
      peer-placeholder-shown:translate-y-0
      peer-focus:scale-75
      peer-focus:-translate-y-4
${errors[id] ? "text-rose-800" : "text-zinc-800"}
      `}
      >
        {effectiveLabel}
      </label>
    </div>
  );
};

export default Input;
