"use client";

import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { CldUploadButton } from "next-cloudinary";
import useConversations from "@/app/hooks/useConversations";
import MessageInput from "./MessageInput";

const Form = () => {
  // Use a custom hook 'useConversations'
  //to access conversation-related data, such as 'conversationId'.
  const { conversationId } = useConversations();

  // Initialize form handling using 'useForm' hook from react-hook-form
  const {
    register, // Function to register an input.
    handleSubmit, // Function to handle form submission.
    setValue, // Function to programmatically set input values.
    formState: { errors }, // Object containing form state and errors.
  } = useForm<FieldValues>({
    defaultValues: {
      message: "", // Initialize 'message' field with an empty string.
    },
  });
  // Define a function 'onSubmit' to handle form submission,
  //conforming to 'SubmitHandler' type from react-hook-form.
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    // Reset the 'message' field to an empty string after form submission.
    setValue("message", "", { shouldValidate: true });
    // Send a POST request to the server with the message and conversation ID.
    axios.post("/api/messages", {
      ...data,
      conversationId: conversationId,
    });
  };

  const handleUpload = (result: any) => {
    // Send a POST request to the server with th
    //e image URL and conversation ID upon file upload.
    axios.post("/api/messages", {
      image: result.info.secure_url,
      conversationId: conversationId,
    });
  };

  return (
    <div
      className="
        py-4 
        px-4 
        bg-white 
        border-t 
        flex 
        items-center 
        gap-2 
        lg:gap-4 
        w-full
      "
    >
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset="tsbkf6vm"
      >
        <HiPhoto size={30} className="text-sky-500" />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Write a message"
        />
        <button
          type="submit"
          className="
            rounded-full 
            p-2 
            bg-sky-500 
            cursor-pointer 
            hover:bg-sky-600 
            transition
          "
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default Form;
