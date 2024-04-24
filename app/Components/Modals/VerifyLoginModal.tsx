"use client";

import { useCallback, useRef, useState } from "react";
import { Modal } from "./Modal";
import Heading from "../Heading";
import axios from "axios";
import toast from "react-hot-toast";
import useLoginV from "@/app/hooks/useLoginV";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
const VerifyLoginModal = () => {
  const { handleClose, email, password, isOpen } = useLoginV();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const inputCode = useRef<HTMLInputElement>(null);
  console.log("Email from Zustand store in VerificationModal:", email);

  const onVerifySubmit = useCallback(async () => {
    console.log("onVerifySubmit started");

    if (!email || !inputCode.current?.value) {
      console.log("Email or verification code missing");
      toast.error("Please provide the verification code.");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Sending request to /api/loginCheck with payload:", {
        email: email,
        code: inputCode.current.value,
      });
      console.log("Sending verification code");
      const verificationResponse = await axios.post("/api/loginCheck", {
        email: email,
        code: inputCode.current.value,
      });

      if (verificationResponse.data.success) {
        console.log(
          "Verification code accepted, proceeding with token verification"
        );
        const tokenVerificationResponse = await axios.post(
          "/api/authWithToken",
          {
            email: email,
            token: verificationResponse.data.token,
          }
        );

        if (tokenVerificationResponse.data.success) {
          console.log("Token verified, attempting to sign in");
          const credentialsResult = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
          });

          if (credentialsResult && !credentialsResult.error) {
            console.log("Login successful");
            toast.success("Logged in successfully.");
            handleClose();
            router.push("/");
            router.refresh();
          } else {
            console.log("Login failed: ", credentialsResult?.error);
            toast.error(credentialsResult?.error || "Login failed.");
          }
        } else {
          console.log(
            "Token verification failed: ",
            tokenVerificationResponse.data.message
          );
          toast.error(
            tokenVerificationResponse.data.message ||
              "Token verification failed."
          );
        }
      } else {
        console.log(
          "Verification code incorrect: ",
          verificationResponse.data.message
        );
        toast.error(
          verificationResponse.data.message || "Incorrect verification code."
        );
      }
    } catch (error) {
      console.error("Verification submission error:", error);
      if (error instanceof Error) {
        // Type-check to safely assert the error type
        console.log("Error message:", error.message);
        if (axios.isAxiosError(error)) {
          // Further check if it's an AxiosError for axios specifics
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
        }
        toast.error(error.message || "Failed to verify code.");
      } else {
        // Handle cases where the error is not an instance of Error
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
      console.log("onVerifySubmit finished");
    }
  }, [email, password, setIsLoading, inputCode, handleClose, router, signIn]);

  return (
    <Modal
      isEmail={true}
      isOpen={isOpen}
      onClose={handleClose}
      submit={onVerifySubmit}
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
            ref={inputCode} // Using useRef for the email input
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      }
      label="Confirm"
    />
  );
};

export default VerifyLoginModal;
