"use client";
import { CgMenuRound } from "react-icons/cg";
import { ProfilePicture } from "../ProfilePicture";
import { useCallback, useEffect, useState } from "react";
import LoginMenuItem from "./LoginMenuItem";
import useRegister from "@/app/hooks/useRegister";
import useLogin from "@/app/hooks/useLogin";
import { User } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import { SafeUser } from "@/app/types";
import useRent from "@/app/hooks/useRent";
import { useRouter } from "next/navigation";

import useUserSearchModal from "@/app/hooks/useUserSearchModal";
import useEmail from "@/app/hooks/useEmail";
import axios from "axios";
import { Session } from "next-auth";
interface LoginMenuProps {
  currentUser?: SafeUser | null;
}
export const LoginMenue: React.FC<LoginMenuProps> = ({ currentUser }) => {
  // Initialize the registration modal hook.
  const registerM = useRegister();
  // Initialize the rental modal hook.
  const rent = useRent();

  // Utilize the Next.js useRouter hook for navigation.
  const router = useRouter();
  // Destructure 'data' as 'session' and 'status' from the 'useSession' hook.
  const { data: session, status } = useSession();
  console.log(currentUser);
  // Define a state 'isManager' to track if the user is a manager, initially false.
  const [isManager, setIsManager] = useState(false);
  // Define a state 'open' to control the visibility of the menu, initially false.
  const [open, setOpen] = useState(false);
  // Initialize the login modal hook.
  const loginM = useLogin();
  const emailVerif = useEmail();

  const handleCustomSignOut = async (email: any) => {
    try {
      const response = await axios.post("/api/customSignOut", { email });
      if (response.data.success) {
        // Proceed with NextAuth signOut
        signOut({ redirect: true, callbackUrl: "/" });
      }
    } catch (error) {
      console.error("Error during custom sign out:", error);
    }
  };

  // Use the 'useEffect' hook to determine if the user is a manager based on their session.
  useEffect(() => {
    console.log("Session object:", session);
    if (session) {
      let managerStatus = false;
      if (session.user?.email === "admin@gmail.com") {
        managerStatus = true;
      }
      setIsManager(managerStatus);
      console.log("Session data updated.", session);
      console.log(`User isManager status: ${managerStatus}`);
    }
  }, [session]);

  // Define 'handleOpen' to toggle the menu's visibility.
  const handleOpen = useCallback(() => {
    setOpen((value) => !value);
  }, []);

  // Define 'handleRent' to manage rental actions.
  const handleRent = useCallback(() => {
    // If there is no current user, open the login modal.
    if (!currentUser) {
      return loginM.handleOpen();
    }
    // Otherwise, open the rent modal.
    rent.handleOpen();
  }, [currentUser, loginM, rent]);
  return (
    <div className="relative">
      <div
        className="flex flex-row 
      items-center gap-3"
      >
        <div
          className="
        hidden md:block text-sm font-semibold
        py-3 px-4 rounded-full
        bg-slate-200
        hover:bg-green-300
        transition
        cursor-pointer"
          onClick={handleRent}
        >
          {" "}
          Become a host
        </div>
        <div
          onClick={handleOpen}
          className="p-4 
        md:py-1
        md:px-2
        border-[1px]
        bg-slate-200
        text-white
        border-neutral-200
        flex
        flex-row
        items-center
        gap-3
        rounded-lg 
        cursor-pointer
        hover:shadow-md
        transition
        "
        >
          <CgMenuRound size={24} />
          <div className="hidden md:block">
            <ProfilePicture src={currentUser?.image} />
          </div>
        </div>
      </div>
      {open && (
        <div className="absolute rounded-lg shadow-md w-[60vw]    bg-slate-200 md:w-3/4 text-green-400 overflow-hidden right-0 top-20 text-sm">
          <div className="flex flex-col cursor-pointer">
            {/* Menu Items for Managers */}
            {currentUser?.isManager && (
              <>
                <LoginMenuItem onClick={() => router.push("/")} label="Users" />
                <LoginMenuItem
                  onClick={() => router.push("/users")}
                  label="My Chats"
                />
                <LoginMenuItem onClick={() => signOut()} label="Logout" />
              </>
            )}
            {/* Additional Menu Items for all logged in users, excluding Managers */}
            {currentUser && !currentUser.isManager && (
              <>
                <LoginMenuItem
                  onClick={() => router.push("/trips")}
                  label="My trips"
                />
                <LoginMenuItem
                  onClick={() => router.push("/favorites")}
                  label="My Favorites"
                />
                <LoginMenuItem
                  onClick={() => router.push("/properties")}
                  label="My Properties"
                />
                <LoginMenuItem
                  onClick={() => router.push("/users")}
                  label="My Chats"
                />
                <LoginMenuItem
                  onClick={() => rent.handleOpen()}
                  label="Rent my home"
                />
                <LoginMenuItem
                  onClick={() => handleCustomSignOut(currentUser.email)}
                  label="Logout"
                />
              </>
            )}
            {/* Menu Items for users not logged in */}
            {!currentUser && (
              <>
                <LoginMenuItem onClick={loginM.handleOpen} label="Log in" />
                <LoginMenuItem onClick={registerM.handleOpen} label="Sign up" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginMenue;
