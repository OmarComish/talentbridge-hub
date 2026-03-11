import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useConfig} from "@/hooks/use-config";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Shape returned by the sign-in / sign-up endpoint */
export interface AuthApiResponse {
  _Guid: string;
  status: string;
  message: string;
  token: string;
  userName: string;
  userId: number;
  userGroupId: number;
  userGroupName: string | null;
  serviceCentreId: number;
  roleId: number;
}

/** Subset we keep in React state / localStorage */
export interface User {
  id: number;
  name: string;
  userName: string;
  userGroupId: number;
  userGroupName: string | null;
  serviceCentreId: number;
  roleId: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  /** Calls the real login endpoint and stores the returned token */
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  /** Calls the real signup endpoint and stores the returned token */
  signup: (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  /**
   * Convenience wrapper around `fetch` that automatically attaches the
   * Authorization header.  Drop-in replacement for `fetch`.
   *
   * @example
   * const res = await authFetch("/api/jobs");
   * const data = await res.json();
   */
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

// ─── Storage keys ─────────────────────────────────────────────────────────────

const SESSION_KEY = "tb_session"; // { user, token }

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Read persisted session from localStorage (safe). */
const loadSession = (): { user: User; token: string } | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
};

/** Map the raw API response to our slim User shape. */
const mapResponseToUser = (res: AuthApiResponse): User => ({
  id: res.userId,
  name: res.userName,
  userName: res.userName,
  userGroupId: res.userGroupId,
  userGroupName: res.userGroupName,
  serviceCentreId: res.serviceCentreId,
  roleId: res.roleId,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { config, loadingConfigs} = useConfig();

  // Rehydrate from localStorage on first mount
  useEffect(() => {
    const session = loadSession();
    if (session) {
      setUser(session.user);
      setToken(session.token);
    }
  }, []);

  /** Persist user + token and update state in one shot. */
  const saveSession = useCallback((newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ user: newUser, token: newToken }));
  }, []);

  // ── login ──────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch(`${config.apiAuth}/api/auth/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        })

        const data: AuthApiResponse = await res.json();

        if (!res.ok || data.status !== "success") {
          return { success: false, error: data.message || "Login failed" };
        }

        saveSession(mapResponseToUser(data), data.token);
        return { success: true };
      } catch (err) {
        return { success: false, error: "Network error. Please try again." };
      }
    },
    [saveSession]
  );

  // ── signup ─────────────────────────────────────────────────────────────────
  const signup = useCallback(
    async (
      firstName: string,
      email: string,
      password: string,
      lastName: string,
      username: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch(`${config.apiAuth}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, email, password, lastName, username }),
        });

        const data: AuthApiResponse = await res.json();

        if (!res.ok || data.status !== "success") {
          return { success: false, error: data.message || "Sign-up failed" };
        }

        saveSession(mapResponseToUser(data), data.token);

        return { success: true };
      } catch (err) {
        return { success: false, error: "Network error. Please try again." };
      }
    },
    [saveSession]
  );

  // ── logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  // ── authFetch ──────────────────────────────────────────────────────────────
  /**
   * Wraps the native `fetch` API and injects `Authorization: Bearer <token>`.
   * Use this anywhere you would normally call `fetch` for protected endpoints.
   */
  const authFetch = useCallback(
    (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
      const headers = new Headers(init.headers);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return fetch(input, { ...init, headers });
    },
    [token]
  );

  // ── context value ──────────────────────────────────────────────────────────
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        signup,
        logout,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
