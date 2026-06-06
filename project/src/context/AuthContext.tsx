import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Rafay Khan',
    email: 'rafay@example.com',
    role: 'admin',
    loyaltyPoints: 2500,
    joinedAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    name: 'Alex Jordan',
    email: 'user@example.com',
    role: 'user',
    loyaltyPoints: 840,
    joinedAt: new Date('2023-06-15'),
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('rafay_kicks_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (email: string, _password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    const found = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      localStorage.setItem('rafay_kicks_user', JSON.stringify(found));
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, _password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    const newUser: User = {
      id: String(Date.now()),
      name,
      email,
      role: 'user',
      loyaltyPoints: 0,
      joinedAt: new Date(),
    };
    setUser(newUser);
    localStorage.setItem('rafay_kicks_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rafay_kicks_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
