"use client";

import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, Globe, Bot, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#FAF8F5] text-zinc-600 border-t border-[#EDE4D3] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Column 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center font-bold text-[#D97706]">
                <span className="font-serif text-base font-black">S</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900">
                scholly
              </span>
            </div>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Find the right college and scholarship for your future. Grounded in source-verified data from admissions offices and official funding bodies worldwide.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#92400E] font-medium">
              <Heart className="w-3.5 h-3.5 fill-current text-[#D97706]" />
              <span>Built for students worldwide</span>
            </div>
          </div>

          {/* Column 2: Colleges & Universities */}
          <div className="space-y-2">
            <h4 className="font-bold text-zinc-900 text-xs tracking-wider uppercase">
              Colleges & Universities
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/universities" className="hover:text-[#D97706] transition-colors">
                  Explore All Universities
                </Link>
              </li>
              <li>
                <Link href="/universities?country=Germany" className="hover:text-[#D97706] transition-colors">
                  Universities in Germany (Low Tuition)
                </Link>
              </li>
              <li>
                <Link href="/universities?country=United+Kingdom" className="hover:text-[#D97706] transition-colors">
                  Top Colleges in the UK
                </Link>
              </li>
              <li>
                <Link href="/universities?country=Canada" className="hover:text-[#D97706] transition-colors">
                  Top Colleges in Canada
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Scholarships & Aid */}
          <div className="space-y-2">
            <h4 className="font-bold text-zinc-900 text-xs tracking-wider uppercase">
              Scholarships & Financial Aid
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/scholarships?funding=Fully+Funded" className="hover:text-[#D97706] transition-colors">
                  Full-Ride Scholarships
                </Link>
              </li>
              <li>
                <Link href="/scholarships?fee=0" className="hover:text-[#D97706] transition-colors">
                  No Application Fee Opportunities
                </Link>
              </li>
              <li>
                <Link href="/scholarships?degree=Master" className="hover:text-[#D97706] transition-colors">
                  Master’s Fellowships
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="hover:text-[#D97706] transition-colors font-semibold text-[#D97706]">
                  Ask AI Advisor
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Student Tools */}
          <div className="space-y-2">
            <h4 className="font-bold text-zinc-900 text-xs tracking-wider uppercase">
              Student Workspace
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-[#D97706] transition-colors">
                  My Saved List &amp; Deadlines
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[#D97706] transition-colors">
                  My Profile &amp; Match Score
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-[#EDE4D3] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© 2026 Scholly. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-[#D97706]" />
            <span>Always verify deadlines directly with host institution admissions.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
