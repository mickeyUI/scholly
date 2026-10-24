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
    // Load local stored profile fallback
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

    const supabase = getSupabase();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Check existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        if (session.user.email) {
          setProfile((prev) => (prev ? { ...prev, email: session.user.email! } : { ...DEFAULT_PROFILE, email: session.user.email! }));
        }
      }
      setIsLoading(false);
    }).catch((err) => {
      console.warn('Error checking Supabase session:', err);
      setIsLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        if (session.user.email) {
          setProfile((prev) => (prev ? { ...prev, email: session.user.email! } : { ...DEFAULT_PROFILE, email: session.user.email! }));
        }
      } else {
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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      setUser(data.user);
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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      setUser(data.user);
      setProfile((prev) => {
        const updated = prev ? { ...prev, full_name: fullName, email } : { ...DEFAULT_PROFILE, full_name: fullName, email };
        localStorage.setItem('scholly_student_profile', JSON.stringify(updated));
        return updated;
      });
      setIsAuthModalOpen(false);
      return { success: true };
    }

    return { success: false, error: 'Check your email to confirm your account' };
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
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
