"use client";

import { SafeUser } from "@/app/types";

import { ProfilePicture } from "../ProfilePicture";

import { useSession } from "next-auth/react";

import axios from "axios";
import { useRouter } from "next/navigation";
import useLogin from "@/app/hooks/useLogin";
import Button from "../Button";

interface UserInfoProps {
  user: SafeUser;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const loginModal = useLogin();
  const router = useRouter();

  const { data: session } = useSession();

  const addContact = async (userIdToAdd: any) => {
    if (!session || !session.user) {
      loginModal.handleOpen();
      console.log("User must be logged in to add contacts");
      return;
    }

    try {
      const response = await axios.post("/api/contacts", {
        currentUserId: session.user.email, // Assuming the session object has a user with an id
        userIdToAdd: userIdToAdd,
      });
      console.log(response.data);
      router.push("/users"); // Handle the response appropriately
    } catch (error) {
      console.error("Failed to add contact", error);
    }
  };

  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="relative text-xl font-semibold flex flex-row items-center gap-2">
          <div>User {user?.name}</div>
          <div className="cursor-pointer">
            <ProfilePicture src={user?.image} />
          </div>

          <div className="">
            <button
              onClick={() => addContact(user.id)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-lg hover:bg-yellow-400 cursor-pointer"
            >
              Message User
            </button>
          </div>
        </div>
        <div className="flex flex-col items-start gap-6 font-light  text-neutral-500">
          <div>
            {" "}
            See users:
            <Button
              outline
              label={"Favorites    "}
              onClick={() => router.push(`/adminFavorites/${user.id}`)}
            />
            <div className="mb-2"></div>
            <Button
              outline
              label={"Reservations    "}
              onClick={() => router.push(`/adminReservations/${user.id}`)}
            />
            <div className="mb-2"></div>
            <Button
              outline
              label={"Properties    "}
              onClick={() => router.push(`/adminProperties/${user.id}`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
