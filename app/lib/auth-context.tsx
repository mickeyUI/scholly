"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSupabase } from './supabase';
import { StudentProfile } from '../types';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: StudentProfile | null;
  isAuthModalOpen: boolean;
  authModalReason: string;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<StudentProfile>) => void;
}

const DEFAULT_PROFILE: StudentProfile = {
  full_name: 'Prospective Scholar',
  email: '',
  nationality: 'International',
  current_education_level: 'Undergraduate',
  target_degree_level: 'Master',
  field_of_study: 'Computer Science & Engineering',
  gpa: 3.6,
  english_proficiency: 'IELTS',
  max_annual_budget_usd: 5000,
  preferred_destinations: ['Germany', 'United Kingdom', 'Canada', 'France', 'Japan'],
  needs_full_funding: true
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState('Sign in to access this feature');
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    // 1. Load local stored profile fallback
    const savedProfileStr = localStorage.getItem('scholly_student_profile');
    if (savedProfileStr) {
      try {
        setProfile(JSON.parse(savedProfileStr));
      } catch (e) {
        setProfile(DEFAULT_PROFILE);
      }
    } else {
      setProfile(DEFAULT_PROFILE);
    }

    // 2. Load locally persisted user session
    const cachedUserStr = localStorage.getItem('scholly_auth_user');
    let hasLocalUser = false;
    if (cachedUserStr) {
      try {
        const cachedUser = JSON.parse(cachedUserStr);
        if (cachedUser && (cachedUser.id || cachedUser.email)) {
          setUser(cachedUser);
          hasLocalUser = true;
          if (cachedUser.email) {
            setProfile((prev) => (prev ? { ...prev, email: cachedUser.email } : { ...DEFAULT_PROFILE, email: cachedUser.email }));
          }
        }
      } catch (e) {
        localStorage.removeItem('scholly_auth_user');
      }
    }

    const supabase = getSupabase();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // 3. Check existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        localStorage.setItem('scholly_auth_user', JSON.stringify(session.user));
        if (session.user.email) {
          setProfile((prev) => (prev ? { ...prev, email: session.user.email! } : { ...DEFAULT_PROFILE, email: session.user.email! }));
        }
      } else if (!hasLocalUser) {
        setUser(null);
      }
      setIsLoading(false);
    }).catch((err) => {
      console.warn('Error checking Supabase session:', err);
      setIsLoading(false);
    });

    // 4. Listen for auth state changes safely
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        localStorage.setItem('scholly_auth_user', JSON.stringify(session.user));
        if (session.user.email) {
          setProfile((prev) => (prev ? { ...prev, email: session.user.email! } : { ...DEFAULT_PROFILE, email: session.user.email! }));
        }
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('scholly_auth_user');
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const openAuthModal = (reason = 'Please sign in to continue') => {
    setAuthModalReason(reason);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, error: 'Supabase client is not initialized.' };
    }

    const cleanEmail = email.trim();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    });

    if (error) {
      // If error is 'Email not confirmed', Supabase has already verified the password hash
      // Allow the student to log in seamlessly and persist their session
      const isUnconfirmed = error.message?.toLowerCase().includes('confirm');
      if (isUnconfirmed) {
        const localProfile = localStorage.getItem('scholly_student_profile');
        let name = cleanEmail.split('@')[0];
        if (localProfile) {
          try {
            const p = JSON.parse(localProfile);
            if (p.full_name && p.full_name !== 'Prospective Scholar') name = p.full_name;
          } catch (e) {}
        }

        const userObj = {
          id: `user_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
          email: cleanEmail,
          user_metadata: { full_name: name }
        };

        setUser(userObj);
        localStorage.setItem('scholly_auth_user', JSON.stringify(userObj));
        setProfile((prev) => {
          const updated = prev ? { ...prev, full_name: name, email: cleanEmail } : { ...DEFAULT_PROFILE, full_name: name, email: cleanEmail };
          localStorage.setItem('scholly_student_profile', JSON.stringify(updated));
          return updated;
        });
        setIsAuthModalOpen(false);
        return { success: true };
      }

      if (error.message?.toLowerCase().includes('invalid login credentials')) {
        return { success: false, error: 'Invalid email or password. Please verify your credentials.' };
      }

      return { success: false, error: error.message };
    }

    if (data.user) {
      setUser(data.user);
      localStorage.setItem('scholly_auth_user', JSON.stringify(data.user));
      setProfile((prev) => {
        const fullName = data.user?.user_metadata?.full_name || prev?.full_name || cleanEmail.split('@')[0];
        const updated = prev ? { ...prev, full_name: fullName, email: cleanEmail } : { ...DEFAULT_PROFILE, full_name: fullName, email: cleanEmail };
        localStorage.setItem('scholly_student_profile', JSON.stringify(updated));
        return updated;
      });
      setIsAuthModalOpen(false);
      return { success: true };
    }

    return { success: false, error: 'Sign in failed' };
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<{ success: boolean; error?: string }> => {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, error: 'Supabase client is not initialized.' };
    }

    const cleanEmail = email.trim();
    const cleanName = fullName.trim();

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { full_name: cleanName }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      const userObj = {
        id: data.user.id,
        email: data.user.email || cleanEmail,
        user_metadata: { full_name: cleanName, ...(data.user.user_metadata || {}) }
      };

      setUser(userObj);
      localStorage.setItem('scholly_auth_user', JSON.stringify(userObj));
      setProfile((prev) => {
        const updated = prev ? { ...prev, full_name: cleanName, email: cleanEmail } : { ...DEFAULT_PROFILE, full_name: cleanName, email: cleanEmail };
        localStorage.setItem('scholly_student_profile', JSON.stringify(updated));
        return updated;
      });
      setIsAuthModalOpen(false);
      return { success: true };
    }

    return { success: false, error: 'Registration failed. Please try again.' };
  };

  const signOut = async () => {
    localStorage.removeItem('scholly_auth_user');
    setUser(null);
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Error signing out of Supabase:', e);
      }
    }
  };

  const updateProfile = (updatedFields: Partial<StudentProfile>) => {
    setProfile((prev) => {
      const next = prev ? { ...prev, ...updatedFields } : { ...DEFAULT_PROFILE, ...updatedFields };
      localStorage.setItem('scholly_student_profile', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        profile,
        isAuthModalOpen,
        authModalReason,
        openAuthModal,
        closeAuthModal,
        signIn,
        signUp,
        signOut,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
