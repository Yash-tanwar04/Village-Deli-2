import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Address } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  loginWithGoogle: (data: {
    email: string;
    full_name?: string;
    google_id?: string;
    avatar_url?: string;
  }) => Promise<UserProfile>;
  register: (
    emailOrData: string | { full_name: string; email: string; password: string; phone?: string },
    password?: string,
    full_name?: string,
    phone?: string
  ) => Promise<any>;
  logout: () => void;
  addresses: Address[];
  refreshAddresses: () => Promise<void>;
  saveAddress: (addr: Address) => Promise<Address>;
  addAddress: (addr: Address) => Promise<Address>;
  deleteAddress: (id: string) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  updateProfile: (data: { full_name?: string; phone?: string }) => Promise<UserProfile>;
  setSessionUser: (user: UserProfile, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('villagedeli_token') || null;
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const savedToken = localStorage.getItem('villagedeli_token');
      const savedUser = localStorage.getItem('villagedeli_user');
      if (!savedToken || !savedUser) {
        localStorage.removeItem('villagedeli_user');
        localStorage.removeItem('villagedeli_token');
        return null;
      }
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem('villagedeli_user');
      localStorage.removeItem('villagedeli_token');
      return null;
    }
  });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshAddresses = async () => {
    if (!user) {
      setAddresses([]);
      return;
    }
    try {
      const list = await api.getAddresses(user.id);
      setAddresses(list);
    } catch (err) {
      console.error('Failed to load user addresses', err);
    }
  };

  // Verify and hydrate session from server on mount
  useEffect(() => {
    let isMounted = true;

    async function verifyCurrentSession() {
      const savedToken = localStorage.getItem('villagedeli_token');
      if (!savedToken) {
        if (isMounted) {
          setUser(null);
          setToken(null);
          setAddresses([]);
          localStorage.removeItem('villagedeli_user');
          localStorage.removeItem('villagedeli_token');
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        const res = await api.getMe();
        if (isMounted) {
          if (res && res.valid && res.user) {
            setUser(res.user);
            localStorage.setItem('villagedeli_user', JSON.stringify(res.user));
          } else {
            setUser(null);
            setToken(null);
            setAddresses([]);
            localStorage.removeItem('villagedeli_user');
            localStorage.removeItem('villagedeli_token');
          }
        }
      } catch (err) {
        console.warn('Session verification rejected or expired:', err);
        if (isMounted) {
          setUser(null);
          setToken(null);
          setAddresses([]);
          localStorage.removeItem('villagedeli_user');
          localStorage.removeItem('villagedeli_token');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    verifyCurrentSession();

    // Auto-logout when API receives 401 Unauthorized
    const handleUnauthorized = () => {
      console.warn('[AuthContext] Received 401 unauthorized signal. Resetting active session.');
      setUser(null);
      setToken(null);
      setAddresses([]);
      localStorage.removeItem('villagedeli_user');
      localStorage.removeItem('villagedeli_token');
    };

    // Cross-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'villagedeli_token') {
        if (!e.newValue) {
          setUser(null);
          setToken(null);
          setAddresses([]);
        } else {
          setToken(e.newValue);
          verifyCurrentSession();
        }
      }
    };

    window.addEventListener('villagedeli:auth-unauthorized', handleUnauthorized);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      isMounted = false;
      window.removeEventListener('villagedeli:auth-unauthorized', handleUnauthorized);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (user) {
      refreshAddresses();
    } else {
      setAddresses([]);
    }
  }, [user?.id]);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, pass);
      if (res.otp_required) {
        return res;
      }
      if (res.user && res.token) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('villagedeli_user', JSON.stringify(res.user));
        localStorage.setItem('villagedeli_token', res.token);
        return res.user;
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (data: {
    email: string;
    full_name?: string;
    google_id?: string;
    avatar_url?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await api.loginWithGoogle(data);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('villagedeli_user', JSON.stringify(res.user));
      localStorage.setItem('villagedeli_token', res.token);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    emailOrData: string | { full_name: string; email: string; password: string; phone?: string },
    password?: string,
    full_name?: string,
    phone?: string
  ) => {
    setIsLoading(true);
    try {
      let payload: { full_name: string; email: string; password: string; phone?: string };
      if (typeof emailOrData === 'object') {
        payload = emailOrData;
      } else {
        payload = {
          email: emailOrData,
          password: password || '',
          full_name: full_name || '',
          phone: phone || ''
        };
      }

      const regRes = await api.register(payload);
      if (regRes.otp_required) {
        return regRes;
      }

      // Automatically log in after registration if no OTP
      const loginRes = await api.login(payload.email, payload.password);
      if (loginRes.otp_required) {
        return loginRes;
      }
      if (loginRes.user && loginRes.token) {
        setUser(loginRes.user);
        setToken(loginRes.token);
        localStorage.setItem('villagedeli_user', JSON.stringify(loginRes.user));
        localStorage.setItem('villagedeli_token', loginRes.token);
        return loginRes.user;
      }
      return loginRes;
    } finally {
      setIsLoading(false);
    }
  };

  const setSessionUser = (user: UserProfile, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('villagedeli_user', JSON.stringify(user));
    localStorage.setItem('villagedeli_token', token);
  };

  const logout = () => {
    api.logoutServer();
    setUser(null);
    setToken(null);
    setAddresses([]);
    localStorage.removeItem('villagedeli_user');
    localStorage.removeItem('villagedeli_token');
  };

  const saveAddress = async (addr: Address) => {
    if (!user) throw new Error('Must be logged in to save address');
    const saved = await api.saveAddress({ ...addr, user_id: user.id });
    await refreshAddresses();
    return saved;
  };

  const deleteAddress = async (id: string) => {
    await api.deleteAddress(id);
    await refreshAddresses();
  };

  const updateProfile = async (data: { full_name?: string; phone?: string }): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const res = await api.updateProfile(data);
      setUser(res.user);
      localStorage.setItem('villagedeli_user', JSON.stringify(res.user));
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isSuperAdmin: user?.role === 'super_admin',
    isLoading,
    login,
    loginWithGoogle,
    register,
    logout,
    addresses,
    refreshAddresses,
    saveAddress,
    addAddress: saveAddress,
    deleteAddress,
    removeAddress: deleteAddress,
    updateProfile,
    setSessionUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
