import { create } from 'zustand';

type User = {
  email: string;
  name: string;
  id: string;
} | null;

type AuthState = {
  user: User;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (u: User, at: string, rt: string) => void;
  clear: () => void;
  getAccessToken: () => string | null;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  setAuth: (user, accessToken, refreshToken) => {
    document.cookie = `accessToken=${accessToken}; Path=/; Max-Age=900; SameSite=Lax`;
    set({ user, accessToken, refreshToken });
  },
  clear: () => {
    document.cookie = `accessToken=; Path=/; Max-Age=0`;
  },
  getAccessToken: () => get().accessToken,
}));
