import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as authApi from '../api/auth';
import { getAllBookings, getMyBookings } from '../api/bookings';
import { ApiError } from '../api/client';

const STORAGE_KEY = 'stayease_user';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistUser(user) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [initializing, setInitializing] = useState(true);

  const validateSession = useCallback(async (storedUser) => {
    if (!storedUser) return null;
    try {
      if (storedUser.role === 'STAFF') {
        await getAllBookings();
      } else {
        await getMyBookings();
      }
      return storedUser;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        persistUser(null);
        return null;
      }
      return storedUser;
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const stored = readStoredUser();
      const validated = await validateSession(stored);
      if (active) {
        setUser(validated);
        setInitializing(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [validateSession]);

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    setUser(data.user);
    persistUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    await authApi.register(payload);
    return login({ email: payload.email, password: payload.password });
  }, [login]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      /* cookie may already be cleared */
    }
    setUser(null);
    persistUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      isAuthenticated: Boolean(user),
      isStaff: user?.role === 'STAFF',
      isGuest: user?.role === 'GUEST',
      login,
      register,
      logout,
    }),
    [user, initializing, login, register, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
