"use client";

import { useCallback, useRef, useState } from "react";
import { Modal } from "./Modal";
import Heading from "../Heading";
import useEmail from "@/app/hooks/useEmail";
import axios from "axios";
import toast from "react-hot-toast";

const VerificationModal = () => {
  const { handleClose, email, isOpen } = useEmail();
  const [isLoading, setIsLoading] = useState(false);
  const inputEmail = useRef<HTMLInputElement>(null);
  console.log("Email from Zustand store in VerificationModal:", email);

  const onSubmit = () => {
    setIsLoading(true);
    const code = inputEmail.current?.value;
    console.log("Email:", email); // Log the email
    console.log("Code:", code); // Log the verification code
    if (email && code) {
      axios
        .post("/api/emailCheck", { email, code })
        .then(() => {
          toast.success("Code accepted");
          handleClose();
        })
        .catch(() => {
          toast.error("Wrong code");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      toast.error("Code or email missing");
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isEmail={true}
      isOpen={isOpen}
      onClose={handleClose}
      submit={onSubmit}
      title="Confim your email"
      secondLabel=""
      body={
        <div className="flex flex-col gap-8">
          <Heading
            title="Confirm your email adress"
            subtitle="Enter your unique confirmation code"
          />
          <input
            id="email"
            name="email"
            type="email"
            ref={inputEmail} // Using useRef for the email input
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      }
      label="Confirm"
    />
  );
};

export default VerificationModal;
