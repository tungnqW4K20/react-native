import { authService } from '@/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: any | null;
  token: string | null;
  loading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (newUser: any) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); 

  // Restore user & token khi app khởi động
  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Lỗi khi restore auth:", err);
      } finally {
        setLoading(false);
      }
    };
    restoreAuth();
  }, []);

  const login = async (emailOrUsername: string, password: string) => {

    try {
      const result = await authService.login({emailOrUsername, password})

      if (!result.success) {
        throw new Error(result.message || "Đăng nhập thất bại");
      }

      setToken(result.data.token);
      setUser(result.data.customer);

      await AsyncStorage.setItem('token', result.data.token);
      await AsyncStorage.setItem('refreshToken', result.data.refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(result.data.customer));

    } catch (err: any) {
      throw new Error(err.message || "Lỗi khi đăng nhập");
    }
  };

  const refreshToken = async () => {
    try {
      const storedRefreshToken =  await AsyncStorage.getItem('refreshToken');
      if(storedRefreshToken) {
        throw new Error("---------------------");
      }

      const response = await fetch("http://localhost:3000/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storedRefreshToken }),
      });
      const result=  await response.json()
      if(!result.success) {
        throw new Error("---------------------");
      }
      await AsyncStorage.setItem('refreshToken', result.data.refreshToken);
      return result.data.accessToken

    } catch (error) {
      await logout()
    }
  }
  const logout = async () => {
    setToken(null);
    setUser(null);
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('user');
    } catch (err) {
      console.error("Lỗi khi logout:", err);
    }
  };

  const updateUser = (newUser: any) => {
    setUser(newUser);
    AsyncStorage.setItem('user', JSON.stringify(newUser)).catch(err => {
      console.error("Lỗi khi update user vào AsyncStorage:", err);
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth phải được dùng trong AuthProvider");
  return context;
};
