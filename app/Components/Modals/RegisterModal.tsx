"use client";
import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FaLinkedin } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useEffect, useState } from "react";
import Heading from "../Heading";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useRegister from "@/app/hooks/useRegister";
import Modal from "./Modal";
import Input from "../Inputs/Input";
import Button from "../Button";
import useLogin from "@/app/hooks/useLogin";
import { signIn } from "next-auth/react";
import { FaFacebook } from "react-icons/fa";
import useEmail from "@/app/hooks/useEmail";

const RegisterModal = () => {
  const registerM = useRegister();
  const emailVerif = useEmail();
  const [isLoading, setIsLoading] = useState(false);
  const loginM = useLogin();
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });
  const password = watch("password");

  useEffect(() => {
    register("repeatPassword", {
      validate: (value) => value === password || "The passwords do not match",
    });
  }, [password, register]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    const { repeatPassword, ...formData } = data;
    console.log("Setting email in Zustand store:", formData.email);
    axios

      .post("/api/register", formData)
      .then(() => {
        toast.success("Email Sent");

        registerM.handleClose();
        console.log("Setting email in Zustand store:", formData.email);
        emailVerif.handleOpenWithEmail(formData.email);
        console.log("Set email in Zustand store:", formData.email);

        //loginM.handleOpen();
      })
      .catch((error) => {
        // Check if the error is due to an already registered email
        if (error.response && error.response.data === "Email exists") {
          toast.error("Email exists");
        } else {
          // Handle other types of errors
          toast.error("Something went wrong");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const body = (
    <div className="flex text-black flex-col gap-4">
      <Heading
        center
        title="Welcome to GLOBAL STAY"
        subtitle="Create an account"
      />
      <Input
        id="email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        label={"Email" || errors}
        validation={{
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        }}
      />
      <Input
        id="name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        label="Name"
        validation={{
          pattern: {
            value: /^[A-Za-z]{3,}$/,
            message:
              "At least 3 letters and contain no special characters or numbers",
          },
        }}
      />
      <Input
        id="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"
        label="Password"
        validation={{
          pattern: {
            value: /^(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/,
            message:
              "At least 6 characters long, include a digit and a special character",
          },
        }}
      />
      <Input
        id="repeatPassword"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"
        label=" Repeat Password"
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
          registerM.handleClose();
          loginM.handleOpen();
        }}
        className=" text-center text-black font-bald"
      >
        <span className="hover:cursor-pointer">Log In</span>
      </div>
    </div>
  );
  return (
    <Modal
      disabled={isLoading}
      isOpen={registerM.isOpen}
      title="Register"
      label="Continue"
      onClose={registerM.handleClose}
      submit={handleSubmit(onSubmit)}
      body={body}
      footer={footer}
    />
  );
};

export default RegisterModal;
