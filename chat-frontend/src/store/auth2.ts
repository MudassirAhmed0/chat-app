import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import jwt, { JwtPayload } from 'jsonwebtoken';

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
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
  username?: string;
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
  hydrated: boolean;
  setAuth: (accessToken: string, refreshToken?: string) => void;
  clear: () => void;
  getAccessToken: () => string | null;
};

type PersistedAuth = Pick<AuthState, 'user' | 'accessToken' | 'refreshToken'>;

function parseUserFromToken(token: string | null): User {
  if (!token) return null;
  const decoded = jwt.decode(token) as MyJwtPayload | null;
  if (!decoded?.sub) return null;
  return {
    id: decoded.sub,
    email: decoded.email ?? '',
    username: decoded.username ?? '',
  };
}

// SSR-safe: storage is undefined on the server, real on the client
const storage =
  typeof window !== 'undefined'
    ? createJSONStorage<PersistedAuth>(() => window.localStorage)
    : undefined;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      const token = readCookie('accessToken');
      const user = parseUserFromToken(token);

      return {
        user,
        accessToken: token,
        refreshToken: null,
        hydrated: false,

        setAuth: (accessToken, refreshToken) => {
          document.cookie = `accessToken=${accessToken}; Path=/; Max-Age=900; SameSite=Lax`;
          const user = parseUserFromToken(accessToken);
          set({
            user,
            accessToken,
            refreshToken: refreshToken ?? null,
          });
        },

        clear: () => {
          document.cookie = `accessToken=; Path=/; Max-Age=0; SameSite=Lax`;
          set({ user: null, accessToken: null, refreshToken: null });
        },

        getAccessToken: () => get().accessToken,
      };
    },
    {
      name: 'auth',
      storage, // type: PersistStorage<PersistedAuth> | undefined  ✅
      partialize: (s): PersistedAuth => ({
        user: s.user,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Auth rehydration failed', error);
        }
        // mark ready
        useAuthStore.setState({ hydrated: true });
        // optional: prefer cookie token if it changed
        const cookieToken = readCookie('accessToken');
        if (cookieToken && cookieToken !== state?.accessToken) {
          useAuthStore.setState({
            accessToken: cookieToken,
            user: parseUserFromToken(cookieToken),
          });
        }
      },
    },
  ),
);
