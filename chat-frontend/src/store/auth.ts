import { create } from 'zustand';
import jwt, { JwtPayload } from 'jsonwebtoken';
function readCookie(name: string): string | null {
  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='))
      ?.split('=')[1] ?? null
  );
}

interface MyJwtPayload extends JwtPayload {
  sub: string;
  email?: string;
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
  let userId = null;
  let userEmail = null;

  if (token) {
    const decoded = jwt.decode(token) as MyJwtPayload | null;

    if (decoded) {
      userId = decoded.sub;
      userEmail = decoded.email || null;
    }
  }

  return {
    user: userId && userEmail ? { id: userId, email: userEmail, username: '' } : null,
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
