import { create } from "zustand";
import { User } from "../types/user";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCheckedAuth: boolean;
  setLoading: (loading: boolean)=> void;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setHasCheckedAuth: (checked: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  hasCheckedAuth: false,
  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setAccessToken: (token) =>
    set({
      accessToken: token,
    }),

  setHasCheckedAuth: (checked) =>
    set({
      hasCheckedAuth: checked,
    }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      hasCheckedAuth: true,
    }),
}));