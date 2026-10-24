"use client";

import React, { useState } from 'react';
import { X, Lock, Mail, User, AlertCircle, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../lib/auth-context';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalReason, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (mode === 'signin') {
        const res = await signIn(email, password);
        if (!res.success) {
          setError(res.error || 'Failed to sign in. Please verify your email and password.');
        } else {
          closeAuthModal();
        }
      } else {
        if (!fullName.trim()) {
          setError('Please provide your full name');
          setIsLoading(false);
          return;
        }
        const res = await signUp(email, password, fullName);
        if (!res.success) {
          setError(res.error || 'Registration failed');
        } else {
          setSuccessMessage('Account created! Please sign in or check your email to confirm.');
          setMode('signin');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white border border-[#EDE4D3] rounded-3xl shadow-xl p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top golden bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309]" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-[#FAF8F5] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 pt-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] mb-3 border border-[#FDE68A] shadow-xs">
            <Heart className="w-6 h-6 fill-current text-[#D97706]" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            {mode === 'signin' ? 'Welcome Back!' : 'Join Scholly Free'}
          </h2>
          <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
            {authModalReason}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-zinc-100 mb-6">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); }}
            className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 ${
              mode === 'signin'
                ? 'border-[#D97706] text-[#D97706]'
                : 'border-transparent text-zinc-400 hover:text-zinc-600'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 ${
              mode === 'signup'
                ? 'border-[#D97706] text-[#D97706]'
                : 'border-transparent text-zinc-400 hover:text-zinc-600'
            }`}
          >
            Sign Up Free
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Taylor"
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-[#FAF8F5] border border-zinc-200 rounded-xl focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-[#FAF8F5] border border-zinc-200 rounded-xl focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-[#FAF8F5] border border-zinc-200 rounded-xl focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm rounded-full transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <span>{mode === 'signin' ? 'Log In to My Account' : 'Create Free Account'}</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-center gap-1.5 text-xs text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-[#D97706]" />
          <span>Protected with official Supabase student authentication</span>
        </div>
      </div>
    </div>
  );
}
