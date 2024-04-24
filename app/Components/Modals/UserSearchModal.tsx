"use client";

import { useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import Modal from "@/app/Components/Modals/Modal";
import useUserSearchModal from "@/app/hooks/useUserSearchModal";
import Heading from "../Heading";

export const UserSearchModal = () => {
  const userSearchModal = useUserSearchModal();
  const router = useRouter();
  const searchParams = useSearchParams();

  const inputEmail = useRef<HTMLInputElement>(null);

  const onSubmit = useCallback(() => {
    if (!searchParams) {
      return;
    }
    const emailValue = inputEmail.current?.value;
    const currentQuery = qs.parse(searchParams.toString());
    const updatedQuery = {
      ...currentQuery,
      emailValue,
    };

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    userSearchModal.handleClose();
    router.push(url);
  }, [router, searchParams, userSearchModal]);

  return (
    <Modal
      isOpen={userSearchModal.isOpen}
      onClose={userSearchModal.handleClose}
      submit={onSubmit}
      title="Search"
      secondLabel="Seach"
      body={
        <div className="flex flex-col gap-8">
          <Heading
            title="Now search for your user"
            subtitle="Search by their unique email"
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
      label="Search"
    />
  );
};

export default UserSearchModal;
