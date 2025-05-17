import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, AuthState, LoginCredentials, RegisterCredentials, User } from '../types/auth.types';
import { authService } from '../services/auth.service';
import axios from 'axios';

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          authService.setToken(token);
          // Fetch user data using the token
          const response = await axios.get('http://localhost:3001/users/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setState(prev => ({ 
            ...prev, 
            token, 
            user: response.data,
            loading: false 
          }));
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          authService.removeToken();
          setState(prev => ({ ...prev, loading: false }));
        }
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { access_token, user } = await authService.login(credentials);
      authService.setToken(access_token);
      setState(prev => ({ ...prev, user, token: access_token, loading: false }));
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      setState(prev => ({
        ...prev,
        error: error.response?.data?.message || "Помилка при вході",
        loading: false,
      }));
      return false;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { access_token, user } = await authService.register(credentials);
      authService.setToken(access_token);
      setState(prev => ({ ...prev, user, token: access_token, loading: false }));
      return true;
    } catch (error: any) {
      console.error('Register error:', error);
      let errorMessage = "Помилка при реєстрації";
      
      if (error.response?.status === 409) {
        errorMessage = "Цей email вже зареєстрований";
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      return false;
    }
  };

  const logout = () => {
    authService.removeToken();
    setState({ ...initialState, loading: false });
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 