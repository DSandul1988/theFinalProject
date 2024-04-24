import { create } from "zustand";
interface RentStore {
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}

const useRent = create<RentStore>((set) => ({
  isOpen: false,
  handleOpen: () => set({ isOpen: true }),
  handleClose: () => set({ isOpen: false }),
}));

export default useRent;
