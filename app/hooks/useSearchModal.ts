import { create } from "zustand";
interface SearchModalStore {
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}

const useSearchModal = create<SearchModalStore>((set) => ({
  isOpen: false,
  handleOpen: () => set({ isOpen: true }),
  handleClose: () => set({ isOpen: false }),
}));

export default useSearchModal;
