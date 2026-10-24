"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  Sparkles,
  Bookmark,
  User,
  LogOut,
  Menu,
  X,
  Award,
  Heart
} from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { useSaved } from '../lib/saved-context';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, profile, signOut, openAuthModal } = useAuth();
  const { savedCount } = useSaved();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/universities', label: 'Universities', icon: GraduationCap },
    { href: '/scholarships', label: 'Scholarships', icon: Award },
    { href: '/assistant', label: 'AI Advisor', icon: Sparkles, requiresAuth: true },
    { href: '/dashboard', label: 'Saved List', icon: Heart, requiresAuth: true },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#EDE4D3] text-zinc-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Friendly Niche-style Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
              <span className="font-serif text-lg font-black">S</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-zinc-900 group-hover:text-[#D97706] transition-colors">
                  scholly
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                  Global
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium hidden sm:block">
                Find where you belong
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    active
                      ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-[#FAF8F5]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#D97706]' : 'text-zinc-400'}`} />
                  <span>{link.label}</span>
                  {link.href === '/dashboard' && savedCount > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#D97706] text-white">
                      {savedCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action / Auth Button */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#EDE4D3] hover:border-[#D97706] text-xs font-medium text-zinc-800 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-[#FEF3C7] text-[#92400E] flex items-center justify-center text-[10px] font-bold">
                    {(profile?.full_name || 'U').charAt(0)}
                  </div>
                  <span className="max-w-[120px] truncate">
                    {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}
                  </span>
                </Link>

                <button
                  onClick={() => signOut()}
                  title="Sign out"
                  className="p-2 rounded-full text-zinc-400 hover:text-red-500 hover:bg-zinc-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('Log in to save colleges and chat with your advisor')}
                  className="px-3.5 py-2 text-xs font-bold text-zinc-700 hover:text-[#D97706] transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuthModal('Create your free student account')}
                  className="px-4 py-2 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs rounded-full shadow-sm hover:shadow transition-all"
                >
                  Sign Up Free
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && savedCount > 0 && (
              <Link href="/dashboard" className="p-1.5 text-[#D97706]">
                <Bookmark className="w-5 h-5 fill-current" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-600 hover:text-zinc-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#D97706]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EDE4D3] bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  active
                    ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                    : 'text-zinc-700 hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#D97706]" />
                  <span>{link.label}</span>
                </div>
                {link.href === '/dashboard' && savedCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#D97706] text-white">
                    {savedCount}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-[#EDE4D3] flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-[#FAF8F5] rounded-xl"
                >
                  <User className="w-4 h-4 text-[#D97706]" />
                  <span>Profile & Preferences</span>
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    openAuthModal('Log in to continue');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-zinc-700 bg-zinc-100 rounded-full"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    openAuthModal('Create free account');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-white bg-[#D97706] rounded-full shadow-sm"
                >
                  Sign Up Free
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
