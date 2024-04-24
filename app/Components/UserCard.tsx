"use client";

import { SafeUser } from "../types";
import { useRouter } from "next/navigation";

import Image from "next/image";
import { User } from "next-auth";
import { ProfilePicture } from "./ProfilePicture";
import profilePic from "@/public/images/profile.jpg";
interface UserCardProps {
  data: User;
}

const UserCard: React.FC<UserCardProps> = ({ data }) => {
  const router = useRouter();
  const defaultImageUrl = "/images/profile.jpg";
  return (
    <div
      onClick={() => router.push(`/adminUsers/${data.id}`)}
      className="col-span-1 cursor-pointer-group"
    >
      <div className="flex flex-col gap-2 ">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          {data.image ? (
            <img
              src={data.image}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={defaultImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="font-semibold text-lg">
          {data.email},{data.name}
        </div>
        <div className="font-light text-neutral-500">{data.id}</div>
      </div>
    </div>
  );
};

export default UserCard;
