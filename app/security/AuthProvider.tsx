import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { authProvider, User } from "../lib/auth/authUtils";
import { LoginResponse, LoginRequest } from "../lib/auth/authUtils";
import { saveAuthData, getAuthData, clearAuthData } from "../lib/auth/storage";

interface AuthContextType {
  username: string | null;
  signIn: (user: User) => Promise<LoginResponse>;
  signOut: () => Promise<void>;
  isLoggedIn: () => boolean;
  isLoggedInAs: (role: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);

  // Load stored auth data on app start
  useEffect(() => {
    const loadAuthData = async () => {
      const { username: storedUsername, roles: storedRoles } = await getAuthData();
      if (storedUsername) {
        setUsername(storedUsername);
        setRoles(storedRoles);
      }
    };
    loadAuthData();
  }, []);

  const signIn = async (user_: LoginRequest) => {
    const response = await authProvider.signIn(user_);
    setUsername(response.username);
    setRoles(response.roles);
    await saveAuthData(response.token, response.username, response.roles);
    return response;
  };

  const signOut = async () => {
    setUsername(null);
    setRoles([]);
    await clearAuthData();
  };

  const isLoggedIn = () => {
    return username != null;
  };

  const isLoggedInAs = (requiredRoles: string[]) => {
    return roles?.some((r) => requiredRoles.includes(r)) || false;
  };

  const value = { username, isLoggedIn, isLoggedInAs, signIn, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}