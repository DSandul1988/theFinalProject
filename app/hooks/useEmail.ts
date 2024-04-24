import { create } from "zustand";
interface EmailStore {
  isOpen: boolean;
  email: string | null;
  handleOpenWithEmail: (email: string) => void;
  handleClose: () => void;
  setEmail: (email: string) => void;
}

const useEmail = create<EmailStore>((set) => ({
  isOpen: false,
  email: null, // Default to null
  handleOpenWithEmail: (email: string) => set({ isOpen: true, email }),
  handleClose: () => set({ isOpen: false, email: null }),
  setEmail: (email) => set({ email }),
}));

export default useEmail;
