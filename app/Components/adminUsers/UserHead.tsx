"use client";

import { SafeUser } from "@/app/types";
import Heading from "../Heading";
import Image from "next/image";

interface UserHeadProps {
  user: SafeUser | null;
}

const UserHead: React.FC<UserHeadProps> = ({ user }) => {
  const defaultImageUrl = "/images/profile.jpg";

  return (
    <>
      <Heading
        title={`This is the page of ${user?.name}`}
        createdAt={user?.createdAt}
        email={user?.email}
      />
      <div
        className="w-28 h-[20vh] overflow-hidden rounded-full
       relative"
      >
        <Image
          alt="Image"
          src={user?.image || defaultImageUrl}
          fill
          className="object-cover w-full"
        />
        <div>Created at :{user?.createdAt}</div>
        <div>Created at :{user?.name}</div>
      </div>
    </>
  );
};

export default UserHead;
