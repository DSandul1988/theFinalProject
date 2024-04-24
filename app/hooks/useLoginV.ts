import { create } from "zustand";

interface LoginVStore {
  isOpen: boolean;
  email: string | null;
  password: string | null;
  handleOpenWithEmail: (email: string, password: string) => void;
  handleClose: () => void;
  setEmail: (email: string) => void;
}

const useLoginV = create<LoginVStore>((set) => ({
  isOpen: false,
  email: null,
  password: null, // Corrected: Added missing comma here
  handleOpenWithEmail: (email: string, password: string) =>
    set({ isOpen: true, email, password }),
  handleClose: () => set({ isOpen: false, email: null, password: null }), // Also clear password on close
  setEmail: (email) => set({ email }),
}));

export default useLoginV;
