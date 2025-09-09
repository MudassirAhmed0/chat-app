import { create } from 'zustand';

function readCookie(name: string): string | null {
  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='))
      ?.split('=')[1] ?? null
  );
}

type User = {
  email: string;
  username: string;
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

export const useAuthStore = create<AuthState>((set, get) => {
  const token = typeof document !== 'undefined' ? readCookie('accessToken') : null;
  return {
    user: null,
    accessToken: token,
    refreshToken: null,
    setAuth: (user, accessToken, refreshToken) => {
      document.cookie = `accessToken=${accessToken}; Path=/; Max-Age=900; SameSite=Lax`;
      set({ user, accessToken, refreshToken });
    },
    clear: () => {
      document.cookie = `accessToken=; Path=/; Max-Age=0`;
    },
    getAccessToken: () => get().accessToken,
  };
});
