import type { AuthUser } from "@app-fitness/firebase";
import { create } from "zustand";

interface SessionState {
  user: AuthUser | null;
  activeGroupId: string;
  toast: string | null;
  setUser: (user: AuthUser | null) => void;
  setActiveGroupId: (id: string) => void;
  showToast: (message: string) => void;
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;

/** Global session/UI state that doesn't belong to server data: current user, active group, toasts. */
export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  activeGroupId: "suor",
  toast: null,
  setUser: (user) => set({ user }),
  setActiveGroupId: (activeGroupId) => set({ activeGroupId }),
  showToast: (message) => {
    set({ toast: message });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set({ toast: null }), 1900);
  },
}));
