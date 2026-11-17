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
          setEmail('');
          setPassword('');
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
          setEmail('');
          setPassword('');
          setFullName('');
          closeAuthModal();
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white border border-[rgba(119,141,169,0.3)] rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top institutional bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0d1b2a] via-[#1b263b] to-[#415a77]" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-[#778da9] hover:text-[#0d1b2a] rounded-full hover:bg-[#f3f4f0] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 pt-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1b263b] text-white mb-3 border border-[rgba(119,141,169,0.25)] shadow-xs">
            <Heart className="w-6 h-6 fill-current text-white" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#0d1b2a] tracking-tight">
            {mode === 'signin' ? 'Welcome Back' : 'Create Student Account'}
          </h2>
          <p className="text-xs text-[#415a77] mt-1 max-w-xs mx-auto">
            {authModalReason}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[rgba(119,141,169,0.2)] mb-6">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); }}
            className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 cursor-pointer ${
              mode === 'signin'
                ? 'border-[#1b263b] text-[#1b263b]'
                : 'border-transparent text-[#778da9] hover:text-[#0d1b2a]'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 cursor-pointer ${
              mode === 'signup'
                ? 'border-[#1b263b] text-[#1b263b]'
                : 'border-transparent text-[#778da9] hover:text-[#0d1b2a]'
            }`}
          >
            Sign Up Free
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.05em] text-[#415a77] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-[#778da9]" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Taylor"
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-[#f3f4f0] border border-[rgba(119,141,169,0.35)] rounded-xl text-[#0d1b2a] focus:outline-none focus:border-[#1b263b] focus:ring-1 focus:ring-[#1b263b]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.05em] text-[#415a77] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#778da9]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-[#f3f4f0] border border-[rgba(119,141,169,0.35)] rounded-xl text-[#0d1b2a] focus:outline-none focus:border-[#1b263b] focus:ring-1 focus:ring-[#1b263b]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.05em] text-[#415a77] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#778da9]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-[#f3f4f0] border border-[rgba(119,141,169,0.35)] rounded-xl text-[#0d1b2a] focus:outline-none focus:border-[#1b263b] focus:ring-1 focus:ring-[#1b263b]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 bg-[#1b263b] hover:bg-[#0d1b2a] text-white font-bold text-sm rounded-full transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <span>{mode === 'signin' ? 'Log In to My Account' : 'Create Free Account'}</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[rgba(119,141,169,0.2)] flex items-center justify-center gap-1.5 text-xs text-[#778da9]">
          <ShieldCheck className="w-4 h-4 text-[#1b263b]" />
          <span>Protected with verified student authentication</span>
        </div>
      </div>
    </div>
  );
}
