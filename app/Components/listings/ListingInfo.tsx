"use client";

import useCountries from "@/app/hooks/useLocation";
import { SafeUser } from "@/app/types";
import { IconType } from "react-icons";
import { ProfilePicture } from "../ProfilePicture";
import ListingCategory from "./ListingCategory";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import LoginMenuItem from "../NavigationBar/LoginMenuItem";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import useLogin from "@/app/hooks/useLogin";
import Reviews from "../Inputs/Reviews";

interface Review {
  id: string;
  content: string;
  userName: string | null;
  createdAt: Date;
}
interface ListingInfoProps {
  category: { label: string; description: string } | undefined;
  user: SafeUser;
  description: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  location: string;
  content: Review[];
  listingId: string;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  content,
  listingId,
  category,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  location,
}) => {
  const loginModal = useLogin();
  const router = useRouter();
  const [itemOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const { getValue } = useCountries();
  const toggleOpen = () => setIsOpen((value) => !value);
  const coordinates = getValue(location)?.latlng;
  const Map = dynamic(() => import("../Map"), { ssr: false });
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
          <div>Hosted By {user?.name}</div>
          <div className="cursor-pointer" onClick={toggleOpen}>
            <ProfilePicture src={user?.image} />
          </div>
          {itemOpen && user.id !== session?.user?.id && (
            <div className="absolute bottom-[4px] right-6 mb-2 z-10">
              <button
                onClick={() => addContact(user.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-lg hover:bg-yellow-400 cursor-pointer"
              >
                Message User
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
          <div>{guestCount} guests</div>
          <div>{roomCount} rooms</div>
          <div>{bathroomCount} bathrooms</div>
        </div>
      </div>
      <hr />
      {category && (
        <ListingCategory
          label={category.label}
          description={category.description}
        />
      )}

      <div className="text-lg font-light text-neutral-500">{description}</div>
      <hr />
      <Map center={coordinates} />
      <Reviews listingId={listingId} content={content} user={user} />
    </div>
  );
};

export default ListingInfo;
