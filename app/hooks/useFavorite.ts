import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { SafeUser } from "../types";
import useLogin from "./useLogin";

interface IUseFavorite {
  listingId: string;
  currentUser?: SafeUser | null;
}

const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
  console.log("Toggling favorite for listingId:", listingId);
  const router = useRouter();
  const loginModal = useLogin();
  const hasfavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];

    return list.includes(listingId);
  }, [currentUser, listingId]);
  console.log(
    "Current user fetched:",
    currentUser ? currentUser.email : "No user"
  );
  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (!currentUser) {
        return loginModal.handleOpen();
      }

      try {
        let request;
        console.log(
          "Attempting to toggle favorite. Current state:",
          hasfavorited ? "Favorited" : "Not Favorited"
        );
        if (hasfavorited) {
          request = () => axios.delete(`/api/favorites/${listingId}`);
        } else {
          console.log("Toggling favorite for listingId:", listingId);
          request = () => axios.post(`/api/favorites/${listingId}`);
        }

        await request();
        router.refresh();
        toast.success("succes");
      } catch (error) {
        console.error("Error in POST /api/favorites/[listingId]:", error);
        toast.error("something went wrong");
      }
    },
    [currentUser, hasfavorited, listingId, loginModal, router]
  );

  return { hasfavorited, toggleFavorite };
};

export default useFavorite;
