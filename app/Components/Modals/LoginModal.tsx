"use client";
import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import Heading from "../Heading";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useLogin from "@/app/hooks/useLogin";
import Modal from "./Modal";
import Input from "../Inputs/Input";
import Button from "../Button";
import { signIn } from "next-auth/react";
import useRegister from "@/app/hooks/useRegister";
import { useRouter } from "next/navigation";
import { FaFacebook } from "react-icons/fa";
import useLoginV from "@/app/hooks/useLoginV";
const LoginModal = () => {
  const verify = useLoginV();
  const LoginM = useLogin();
  const registerM = useRegister();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      const verificationResponse = await axios.post("/api/checkLogin", {
        email: data.email,
        password: data.password,
      });

      // Assuming success is determined by a specific property in the response data
      if (verificationResponse.data.success) {
        toast.success("Email with a verification code sent");
        LoginM.handleClose(); // Make sure to call this function
        verify.handleOpenWithEmail(data.email, data.password);
      } else {
        // Handle case where success is false or not present
        toast.error(verificationResponse.data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Verification submission error:", error);
      toast.error("Failed to verify code.");
    } finally {
      setIsLoading(false);
    }
  };

  // signIn("credentials", { ...data, redirect: false }).then((callback) => {
  //   if (callback?.ok) {
  //     LoginM.handleClose();
  //     toast.success("Logged in");

  //     router.refresh();
  //   } else if (callback?.error) {
  //     // Check if the error message indicates a pending verification
  //     if (
  //       callback.error ===
  //       "Verification pending. Please enter the code sent to your email."
  //     ) {
  //       // Assuming useEmail provides a method to open the verification modal
  //       verify.handleOpenWithEmail(data.email, data.password); // This method should be adjusted according to your Zustand store or context implementation
  //       toast.success("Please verify the code sent to your email.");
  //     } else {
  //       // Handle other errors
  //       toast.error(callback.error);
  //     }
  //   }

  // });

  const body = (
    <div className="flex flex-col gap-4">
      <Heading center title="Welcome back" subtitle="Login to your  account" />
      <Input
        id="email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        label="Email"
      />

      <Input
        id="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"
        label="Password"
      />
    </div>
  );
  const footer = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Google Login"
        Icon={FcGoogle}
        onClick={() => {
          signIn("google");
        }}
      />
      <Button
        outline
        label="FacebookLogin"
        Icon={FaFacebook}
        onClick={() => {
          signIn("facebook");
        }}
      />

      <div
        onClick={() => {
          LoginM.handleClose();
          registerM.handleOpen();
        }}
        className=" text-center text-black font-bald"
      >
        Already have an account?
        <span className="hover:cursor-pointer"> Register</span>
      </div>
    </div>
  );
  return (
    <Modal
      disabled={isLoading}
      isOpen={LoginM.isOpen}
      title="Login"
      label="Continue"
      onClose={LoginM.handleClose}
      submit={handleSubmit(onSubmit)}
      body={body}
      footer={footer}
    />
  );
};

export default LoginModal;
