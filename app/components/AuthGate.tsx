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
          <div className="w-8 h-8 border-3 border-[#1b263b] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#415a77]">Verifying institutional session...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex-1 max-w-3xl mx-auto px-4 py-16 sm:py-24 w-full">
      <div className="bg-white border border-[rgba(119,141,169,0.3)] rounded-2xl shadow-[0_10px_30px_-4px_rgba(13,27,42,0.08),0_2px_6px_-1px_rgba(13,27,42,0.04)] p-8 sm:p-12 text-center overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0d1b2a] via-[#1b263b] to-[#415a77]" />

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1b263b] text-white border border-[rgba(119,141,169,0.25)] mb-5 shadow-xs">
          {icon === 'assistant' && <Sparkles className="w-8 h-8 text-white" />}
          {icon === 'dashboard' && <Heart className="w-8 h-8 fill-current text-white" />}
          {icon === 'profile' && <UserCheck className="w-8 h-8 text-white" />}
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(65,90,119,0.08)] text-[#0d1b2a] border border-[rgba(119,141,169,0.35)] font-bold text-xs mb-3">
          <Lock className="w-3.5 h-3.5 text-[#1b263b]" />
          <span>Student Account Required</span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0d1b2a] tracking-tight mb-3">
          Unlock your {featureName}
        </h1>

        <p className="text-sm text-[#415a77] max-w-md mx-auto leading-relaxed mb-8">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => openAuthModal(`Log in to access your ${featureName}`)}
            className="w-full sm:w-auto px-8 py-3 bg-[#1b263b] hover:bg-[#0d1b2a] text-white font-bold text-sm rounded-full transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Log In to Access</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => openAuthModal(`Create an account to access ${featureName}`)}
            className="w-full sm:w-auto px-8 py-3 bg-[#f3f4f0] hover:bg-[#e0e1dd]/40 text-[#0d1b2a] font-bold text-sm rounded-full transition-colors border border-[rgba(119,141,169,0.35)] cursor-pointer"
          >
            Sign Up Free
          </button>
        </div>

        <div className="mt-10 pt-6 border-t border-[rgba(119,141,169,0.2)] grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-3.5 bg-[#f3f4f0] rounded-xl border border-[rgba(119,141,169,0.25)]">
            <h4 className="text-xs font-bold text-[#0d1b2a] mb-0.5 font-serif">Free Discovery</h4>
            <p className="text-xs text-[#415a77]">Explore accredited universities and verified scholarships worldwide.</p>
          </div>
          <div className="p-3.5 bg-[#f3f4f0] rounded-xl border border-[rgba(119,141,169,0.25)]">
            <h4 className="text-xs font-bold text-[#0d1b2a] mb-0.5 font-serif">Collegiate AI Advisor</h4>
            <p className="text-xs text-[#415a77]">Inquire with queries grounded in official admission facts.</p>
          </div>
          <div className="p-3.5 bg-[#f3f4f0] rounded-xl border border-[rgba(119,141,169,0.25)]">
            <h4 className="text-xs font-bold text-[#0d1b2a] mb-0.5 font-serif">Deadlines &amp; Portfolio</h4>
            <p className="text-xs text-[#415a77]">Save target opportunities and organize application milestones.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
