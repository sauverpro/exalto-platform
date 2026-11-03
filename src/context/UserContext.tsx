import { createContext, useContext, useState, type ReactNode } from "react";
import type { UserResponse } from "../api/auth";

interface UserContextValue {
  user: UserResponse | null;
  token: string | null;
  login: (user: UserResponse, token: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

/** Read a value that was stored with JSON.stringify. */
function safeGetJson<T>(key: string): T | null {
  try {
    const val = localStorage.getItem(key);
    if (!val || val === "undefined" || val === "null") return null;
    return JSON.parse(val) as T;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

/** Read a raw string that was stored as-is (e.g. a JWT). */
function safeGetRaw(key: string): string | null {
  try {
    const val = localStorage.getItem(key);
    if (!val || val === "undefined" || val === "null") return null;
    return val;
  } catch {
    return null;
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(() =>
    safeGetJson<UserResponse>("user"),
  );
  const [token, setToken] = useState<string | null>(() => safeGetRaw("token"));

  const login = (userData: UserResponse, authToken: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <UserContext.Provider
      value={{ user, token, login, logout, isLoggedIn: !!user && !!token }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
