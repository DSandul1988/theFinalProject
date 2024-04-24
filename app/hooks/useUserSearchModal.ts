import { create } from "zustand";
interface UserSearchModalStore {
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}

const useUserSearchModal = create<UserSearchModalStore>((set) => ({
  isOpen: false,
  handleOpen: () => set({ isOpen: true }),
  handleClose: () => set({ isOpen: false }),
}));

export default useUserSearchModal;
