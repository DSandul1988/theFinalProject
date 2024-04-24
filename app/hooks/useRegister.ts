import { create } from "zustand";
interface RegisterStore {
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}

const useRegister = create<RegisterStore>((set) => ({
  isOpen: false,
  handleOpen: () => set({ isOpen: true }),
  handleClose: () => set({ isOpen: false }),
}));

export default useRegister;
