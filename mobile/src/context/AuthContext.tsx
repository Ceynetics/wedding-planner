import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '@/api/endpoints';
import { getAccessToken, setAccessToken, setRefreshToken, clearTokens, getRefreshToken } from '@/api/tokenStorage';
import { extractErrorMessage } from '@/utils/errors';
import type { UserResponse, RegisterRequest, ProfileUpdateRequest, Gender } from '@/types/api';

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: ProfileUpdateRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = user !== null;

  // Check for existing token on mount
  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          setIsLoading(false);
          return;
        }
        const { data } = await authApi.me();
        setUser(data);
      } catch {
        // Token invalid or expired -- try refresh
        try {
          const refreshToken = await getRefreshToken();
          if (refreshToken) {
            const { data } = await authApi.refresh(refreshToken);
            await setAccessToken(data.accessToken);
            await setRefreshToken(data.refreshToken);
            setUser(data.user);
          }
        } catch {
          await clearTokens();
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await authApi.login({ email, password });
    await setAccessToken(data.accessToken);
    await setRefreshToken(data.refreshToken);
    setUser(data.user);
  }, []);

  const register = useCallback(async (reqData: RegisterRequest) => {
    const { data } = await authApi.register(reqData);
    await setAccessToken(data.accessToken);
    await setRefreshToken(data.refreshToken);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    await clearTokens();
    setUser(null);
  }, []);

  const updateUser = useCallback(async (reqData: ProfileUpdateRequest) => {
    const { data } = await authApi.updateProfile(reqData);
    setUser(data);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
