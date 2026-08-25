import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProfile, AuthState } from '../types/user';

const AUTH_ME_URL = 'https://backend-contract-risk-clause-detect.vercel.app/auth/me';
const AUTH_LOGOUT_URL = 'https://backend-contract-risk-clause-detect.vercel.app/auth/logout';

interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication with the backend API route /auth/me sending cookies
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(AUTH_ME_URL, {
        method: 'GET',
        credentials: 'include', // Sends HTTP-only cookie automatically
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json().catch(() => null);
        if (data) {
          const userData = data.user || data;
          const resolvedUsername = 
            userData.username || 
            userData.name || 
            userData.displayName || 
            (userData.email ? userData.email.split('@')[0] : 'User');

          setUser({
            uid: userData.id || userData._id || userData.uid || 'authenticated-user',
            username: resolvedUsername,
            email: userData.email || null,
            displayName: userData.displayName || userData.name || resolvedUsername,
            photoURL: userData.photoURL || userData.avatar || null,
            isAnonymous: false
          });
          setIsGuest(false);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('[AuthContext] Backend /auth/me check completed without active cookie:', err);
    }

    // Default unauthenticated / guest state
    setUser(null);
    setIsGuest(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Google Sign-In redirect to OAuth or backend flow
  const signInWithGoogle = async () => {
    setError(null);
    try {
      window.location.href = 'https://backend-contract-risk-clause-detect.vercel.app/auth/google';
    } catch (err: any) {
      setError(err.message || 'Failed to initiate Google authentication.');
    }
  };

  const signInWithEmail = async (email: string, _pass: string) => {
    setError(null);
    const username = email.split('@')[0];
    setUser({
      uid: 'email-user',
      username,
      email,
      displayName: username,
      photoURL: null,
      isAnonymous: false
    });
    setIsGuest(false);
  };

  const signUpWithEmail = async (email: string, _pass: string) => {
    setError(null);
    const username = email.split('@')[0];
    setUser({
      uid: 'email-user',
      username,
      email,
      displayName: username,
      photoURL: null,
      isAnonymous: false
    });
    setIsGuest(false);
  };

  // POST to /auth/logout with the backend API
  const logout = async () => {
    try {
      await fetch(AUTH_LOGOUT_URL, {
        method: 'POST',
        credentials: 'include', // Ensures cookie is sent and cleared by backend
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (err) {
      console.error('[AuthContext] Logout POST request error:', err);
    } finally {
      localStorage.removeItem('clausex_auth_token');
      localStorage.removeItem('clausex_user_profile');
      setUser(null);
      setIsGuest(true);
    }
  };

  const continueAsGuest = () => {
    setUser(null);
    setIsGuest(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isGuest,
        error,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        continueAsGuest,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
