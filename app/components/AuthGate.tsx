"use client";

import React from 'react';
import { Lock, ArrowRight, Heart, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../lib/auth-context';

interface AuthGateProps {
  featureName: string;
  description: string;
  icon?: 'assistant' | 'dashboard' | 'profile';
  children: React.ReactNode;
}

export default function AuthGate({ featureName, description, icon = 'assistant', children }: AuthGateProps) {
  const { isAuthenticated, isLoading, openAuthModal } = useAuth();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#D97706] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-zinc-500">Checking your student account...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex-1 max-w-3xl mx-auto px-4 py-16 sm:py-24 w-full">
      <div className="bg-white border border-[#EDE4D3] rounded-3xl shadow-sm p-8 sm:p-12 text-center overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309]" />

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] mb-5 shadow-xs">
          {icon === 'assistant' && <Sparkles className="w-8 h-8 text-[#D97706]" />}
          {icon === 'dashboard' && <Heart className="w-8 h-8 fill-current text-[#D97706]" />}
          {icon === 'profile' && <UserCheck className="w-8 h-8 text-[#D97706]" />}
        </div>

        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] font-bold text-xs mb-3">
          <Lock className="w-3.5 h-3.5" />
          <span>Free Student Account Required</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mb-3">
          Unlock your {featureName}
        </h1>

        <p className="text-sm text-zinc-600 max-w-md mx-auto leading-relaxed mb-8">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => openAuthModal(`Log in to access your ${featureName}`)}
            className="w-full sm:w-auto px-8 py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm rounded-full transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
          >
            <span>Log In to Access</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => openAuthModal(`Create an account to access ${featureName}`)}
            className="w-full sm:w-auto px-8 py-3 bg-[#FAF8F5] hover:bg-zinc-100 text-zinc-800 font-bold text-sm rounded-full transition-colors border border-zinc-200"
          >
            Sign Up Free
          </button>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-zinc-100">
            <h4 className="text-xs font-bold text-zinc-900 mb-0.5">Free to Browse</h4>
            <p className="text-xs text-zinc-500">Explore colleges and scholarships worldwide without an account.</p>
          </div>
          <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-zinc-100">
            <h4 className="text-xs font-bold text-zinc-900 mb-0.5">Personal AI Advisor</h4>
            <p className="text-xs text-zinc-500">Ask tailored questions with verified admission facts.</p>
          </div>
          <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-zinc-100">
            <h4 className="text-xs font-bold text-zinc-900 mb-0.5">Deadline Tracker</h4>
            <p className="text-xs text-zinc-500">Save opportunities and never miss an application deadline.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
