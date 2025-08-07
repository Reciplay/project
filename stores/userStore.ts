import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  isExtraFilled: boolean | null;
  hasHydrated: boolean;
  setIsExtraFilled: (value: boolean) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      isExtraFilled: null,
      hasHydrated: false,
      setIsExtraFilled: (value) => set({ isExtraFilled: value }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "user-extra",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
