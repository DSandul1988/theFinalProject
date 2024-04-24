"use client";

import { HiChevronLeft } from "react-icons/hi";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Conversation, User } from "@prisma/client";
import useOtherUser from "@/app/hooks/useOtherUser";
import { ProfilePicture } from "@/app/Components/ProfilePicture";
import ProfileDrawer from "./ProfileDrawer";
import useActiveList from "@/app/hooks/useActiveList";

interface HeadProps {
  conversation: Conversation & {
    users: User[];
  };
}

const Head: React.FC<HeadProps> = ({ conversation }) => {
  // Use a custom hook 'useOtherUser'
  // to obtain data about the other user in the conversation.
  const otherUser = useOtherUser(conversation);
  // Initialize state for managing the drawer's open state.
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Use a custom hook 'useActiveList' to access the list of active members.
  const { members } = useActiveList();

  // Determine if the other user is currently active based on their email.
  //if -1 means that is the part of the array
  const isActive = members.indexOf(otherUser?.email!) !== -1;
  // Compute the status text ('Active' or 'Offline')
  //for the other user using 'useMemo' for optimization.
  const statusText = useMemo(() => {
    return isActive ? "Active" : "Offline";
  }, [isActive]);

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div
        className="
        bg-white 
        w-full 
        flex 
        border-b-[1px] 
        sm:px-4 
        py-3 
        px-4 
        lg:px-6 
        justify-between 
        items-center 
        shadow-sm
      "
      >
        <div className="flex gap-3 items-center">
          <Link
            href="/conversations"
            className="
            lg:hidden 
            block 
            text-sky-500 
            hover:text-sky-600 
            transition 
            cursor-pointer
          "
          >
            <HiChevronLeft size={32} />
          </Link>

          <ProfilePicture src={otherUser.image} />

          <div className="flex flex-col">
            <div>{otherUser.name}</div>
            <div className="text-sm font-light text-neutral-500">
              {statusText}
            </div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => setDrawerOpen(true)}
          className="
          text-sky-500
          cursor-pointer
          hover:text-sky-600
          transition
        "
        />
      </div>
    </>
  );
};

export default Head;
