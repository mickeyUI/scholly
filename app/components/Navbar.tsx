"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Sparkles,
  Bookmark,
  User,
  LogOut,
  Menu,
  X,
  Award,
  Heart,
} from "lucide-react";
import { useAuth } from "../lib/auth-context";
import { useSaved } from "../lib/saved-context";

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, profile, signOut, openAuthModal } = useAuth();
  const { savedCount } = useSaved();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const navLinks = [
    { href: "/universities", label: "Universities", icon: GraduationCap },
    { href: "/scholarships", label: "Scholarships", icon: Award },
    {
      href: "/assistant",
      label: "AI Advisor",
      icon: Sparkles,
      requiresAuth: true,
    },
    {
      href: "/dashboard",
      label: "Saved List",
      icon: Heart,
      requiresAuth: true,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#e0e1dd] text-[#0d1b2a] shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Academic Crest Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-[#1b263b] text-white border border-[rgba(119,141,169,0.25)] flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
              <span className="font-serif text-lg font-bold">S</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-[#0d1b2a] font-serif group-hover:text-[#1b263b] transition-colors">
                  scholly
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[rgba(65,90,119,0.08)] text-[#1b263b] border border-[rgba(119,141,169,0.35)]">
                  Global
                </span>
              </div>
              <p className="text-[10px] text-[#415a77] font-medium hidden sm:block">
                Collegiate Discovery &amp; Scholarships
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
                      ? "bg-[#1b263b] text-white shadow-2xs"
                      : "text-[#415a77] hover:text-[#0d1b2a] hover:bg-[#e0e1dd]/40"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${active ? "text-white" : "text-[#778da9]"}`}
                  />
                  <span>{link.label}</span>
                  {link.href === "/dashboard" &&
                    hasMounted &&
                    savedCount > 0 && (
                      <span
                        className={`ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                          active ? "bg-white text-[#1b263b]" : "bg-[#1b263b] text-white"
                        }`}
                      >
                        {savedCount}
                      </span>
                    )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action / Auth Button */}
          <div className="hidden md:flex items-center gap-3">
            {hasMounted && isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f3f4f0] border border-[rgba(119,141,169,0.35)] hover:border-[#1b263b] text-xs font-medium text-[#0d1b2a] transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-[#1b263b] text-white flex items-center justify-center text-[10px] font-serif font-bold">
                    {(profile?.full_name || user?.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">
                    {profile?.full_name?.split(" ")[0] ||
                      user?.email?.split("@")[0]}
                  </span>
                </Link>

                <button
                  onClick={() => signOut()}
                  title="Sign out"
                  className="p-2 rounded-full text-[#778da9] hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    openAuthModal(
                      "Log in to save colleges and chat with your advisor",
                    )
                  }
                  className="px-3.5 py-2 text-xs font-bold text-[#415a77] hover:text-[#0d1b2a] transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() =>
                    openAuthModal("Create your free student account")
                  }
                  className="px-4 py-2 bg-[#1b263b] hover:bg-[#0d1b2a] text-white font-bold text-xs rounded-full shadow-sm hover:shadow transition-all"
                >
                  Sign Up Free
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center gap-2">
            {hasMounted && isAuthenticated && savedCount > 0 && (
              <Link href="/dashboard" className="p-1.5 text-[#1b263b]">
                <Bookmark className="w-5 h-5 fill-current" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#415a77] hover:text-[#0d1b2a] focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6 text-[#1b263b]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e0e1dd] bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
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
                    ? "bg-[#1b263b] text-white"
                    : "text-[#415a77] hover:bg-[#e0e1dd]/40 hover:text-[#0d1b2a]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? "text-white" : "text-[#778da9]"}`} />
                  <span>{link.label}</span>
                </div>
                {link.href === "/dashboard" && hasMounted && savedCount > 0 && (
                  <span
                    className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      active ? "bg-white text-[#1b263b]" : "bg-[#1b263b] text-white"
                    }`}
                  >
                    {savedCount}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-[#e0e1dd] flex flex-col gap-2">
            {hasMounted && isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#0d1b2a] hover:bg-[#e0e1dd]/40 rounded-xl"
                >
                  <User className="w-4 h-4 text-[#415a77]" />
                  <span>Profile &amp; Preferences</span>
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
                    openAuthModal("Log in to continue");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-[#415a77] bg-[#f3f4f0] rounded-full hover:text-[#0d1b2a]"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    openAuthModal("Create free account");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-white bg-[#1b263b] hover:bg-[#0d1b2a] rounded-full shadow-sm"
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
