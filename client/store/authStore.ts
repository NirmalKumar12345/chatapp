import { create } from "zustand";
import { User } from "../types/user";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggedOut: boolean;
  hasCheckedAuth: boolean;
  onlineUsers: string[];
  setLoading: (loading: boolean)=> void;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setHasCheckedAuth: (checked: boolean) => void;
  setOnlineUsers: (users: string[]) => void;
  setIsLoggedOut: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  isLoggedOut: false,
  hasCheckedAuth: false,
  onlineUsers: [],
  setOnlineUsers: (users) =>
    set({
      onlineUsers: users,
    }),
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
  setIsLoggedOut: (value) =>
    set({
      isLoggedOut: value,
    }),
  logout: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      hasCheckedAuth: true,
      isLoggedOut: true,
      onlineUsers: [],
    }),
}));