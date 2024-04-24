"use client";
import { IoCloseOutline } from "react-icons/io5";
import { useCallback, useEffect, useState } from "react";
import Button from "../Button";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;

  submit: () => void;
  isEmail?: boolean;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  label: string;
  disabled?: boolean;
  secondAction?: () => void;
  secondLabel?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  isEmail,
  onClose,
  submit,
  title,
  body,
  footer,
  label,
  disabled,
  secondAction,
  secondLabel,
}) => {
  const [showModal, setShowModal] = useState(isOpen);
  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const closeModal = useCallback(() => {
    if (disabled) {
      return;
    }
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [disabled, onClose]);

  const submitForm = useCallback(() => {
    if (disabled) {
      return;
    }
    submit();
  }, [disabled, submit]);

  const handleSecondAction = useCallback(() => {
    if (disabled || !secondAction) {
      return;
    }
    secondAction();
  }, [disabled, secondAction]);

  if (!isOpen) {
    return null;
  }
  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden
       overflow-y-auto fixed inset-0 z-50 outline-none 
      focus:outline-none bg-neutral-800/70"
      >
        <div
          className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 
        mx-auto h-full max-h-full  lg:h-auto md:h-auto"
        >
          {/* content */}
          <div
            className={`translate duration-300 h-full ${
              showModal ? "translate-y-0 bg-slate-200" : "translate-y-full"
            } ${showModal ? "opacity-100 bg-slate-200" : "opacity-0"}`}
          >
            <div className="translate h-full lg:h-auto md:h-auto border-0 rounded shadow-lg relative flex flex-col w-full my-gradient outline-none focus:outline-none">
              <div className="flex items-center p-6 rounded-t justify-between relative border-b-[1px]">
                {/* Placeholder for symmetry */}
                <div className="opacity-0">
                  <IoCloseOutline size={20} />
                </div>

                {/* Title */}
                <div className="text-lg  text-black font-semibold">{title}</div>

                {/* Close Button */}
                {!isEmail && (
                  <button
                    onClick={closeModal}
                    className="p-1  border-2 border-black  hover:opacity-70 transition"
                  >
                    <IoCloseOutline size={20} color="black" />
                  </button>
                )}
              </div>
              <div className="relative p-6 flex-auto">{body}</div>
              <div className="flex flex-col gap-2 p-6">
                <div className="flex flex-col items-center gap-4 w-full">
                  {secondAction && secondLabel && (
                    <Button
                      disabled={disabled}
                      label={secondLabel}
                      onClick={handleSecondAction}
                    />
                  )}

                  <Button
                    disabled={disabled}
                    label={label}
                    onClick={submitForm}
                  />
                </div>
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
