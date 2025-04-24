import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, AuthState, LoginCredentials, RegisterCredentials, User } from '../types/auth.types';
import { authService } from '../services/auth.service';
import { AUTH_TOKEN_KEY } from '../config/constants';

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
          // You might want to add an endpoint to validate the token and get user data
          setState(prev => ({ ...prev, token, loading: false }));
        } catch (error) {
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
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Invalid credentials',
        loading: false,
      }));
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { token, user } = await authService.register(credentials);
      authService.setToken(token);
      setState(prev => ({ ...prev, user, token, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Registration failed',
        loading: false,
      }));
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