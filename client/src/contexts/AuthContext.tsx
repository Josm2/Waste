import { createContext, useContext, useState, ReactNode } from "react";
import type { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  switchAccount: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Default to admin user for demonstration
  const [user, setUser] = useState<User | null>({
    id: 1,
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "MENRO Administrator",
    email: "admin@city.gov.ph",
    barangay: null,
    notificationPreferences: '["email"]'
  });

  const login = (user: User) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  const switchAccount = (newUser: User) => {
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchAccount }}>
      {children}
    </AuthContext.Provider>
  );
}