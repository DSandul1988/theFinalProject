import { create } from "zustand";
interface LoginStore {
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}

const useLogin = create<LoginStore>((set) => ({
  isOpen: false,
  handleOpen: () => set({ isOpen: true }),
  handleClose: () => set({ isOpen: false }),
}));

export default useLogin;
