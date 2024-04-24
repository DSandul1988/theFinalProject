"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useSearchModal from "@/app/hooks/useSearchModal";
import useUserSearchModal from "@/app/hooks/useUserSearchModal";
import { BsSearchHeartFill } from "react-icons/bs";

export const SearchBar = () => {
  // Destructure 'data' as 'session' and 'status' from the 'useSession' hook.
  const { data: session, status } = useSession();
  const loading = status === "loading";
  // Initialize the search modal hook.
  const searchModal = useSearchModal();
  // Initialize the admin-specific search modal hook.
  const adminSearch = useUserSearchModal();
  // Define a state 'isManager' to track if the user is a manager with a default value of false.
  const [isManager, setIsManager] = useState(false);

  // Use the 'useEffect' hook to perform side
  //effects in the component, here, to determine if the user is a manager.
  useEffect(() => {
    console.log("Session object:", session);
    // Check if the session exists to proceed.
    if (session) {
      // Initialize a variable 'managerStatus' to false.
      let managerStatus = false;
      // Check if the user's email matches the admin email,
      //and set 'managerStatus' to true if it does.
      if (session.user?.email === "sanduld724@yahoo.com") {
        managerStatus = true;
      }
      // Update the 'isManager' state based on 'managerStatus'.
      setIsManager(managerStatus);
      console.log("Session data updated.", session);
      console.log(`User isManager status: ${managerStatus}`);
    }
  }, [session]);
  // Render a loading state if 'status' is 'loading'.
  if (loading) {
    return (
      <div
        onClick={searchModal.handleOpen}
        className="border-[1px] w-full md:w-auto py-2 rounded-lg shadow-sm hover:shadow-sm transition cursor-pointer"
      >
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm font-semibold text-slate-300 px-6">Where</div>
          <div className="hidden sm:block text-sm text-white font-semibold px-6 border-x-[1px] flex-1 text-center">
            When
          </div>
          <div className="text-sm pl-6 pr-2 text-slate-300 flex flex-row items-center gap-3">
            <div className="hidden sm:block">Who is coming?</div>
            <div className="p-2 rounded-lg text-white">
              <BsSearchHeartFill />
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Render a default search bar
  //if there is no session or the user is not a manager.
  if (!session || !isManager) {
    return (
      <div
        onClick={searchModal.handleOpen}
        className="border-[1px] w-full md:w-auto py-2 rounded-lg shadow-sm hover:shadow-sm transition cursor-pointer"
      >
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm font-semibold text-slate-700 px-6">Where</div>
          <div className="hidden sm:block text-sm text-slate-700 font-semibold px-6 border-x-[1px] flex-1 text-center">
            When
          </div>
          <div className="text-sm pl-6 pr-2 text-slate-700 flex flex-row items-center gap-3">
            <div className="hidden sm:block">Who is coming?</div>
            <div className="p-2 rounded-lg text-green-400">
              <BsSearchHeartFill />
            </div>
          </div>
        </div>
      </div>
    );
  }
  {
    /* Manager-specific content */
  }
  if (isManager) {
    return (
      <div
        onClick={adminSearch.handleOpen}
        className="border-[1px] w-full md:w-auto py-2 rounded-lg shadow-sm hover:shadow-sm transition cursor-pointer"
      >
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm font-semibold text-slate-700 px-6">
            Search for a user by their email
          </div>
          <div className="p-2 rounded-lg text-green-400">
            <BsSearchHeartFill />
          </div>
        </div>
      </div>
    );
  }
};

export default SearchBar;
