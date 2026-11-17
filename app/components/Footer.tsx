"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0d1b2a] text-[#e0e1dd] border-t border-[rgba(119,141,169,0.25)] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Column 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#1b263b] border border-[rgba(119,141,169,0.35)] flex items-center justify-center font-bold text-white">
                <span className="font-serif text-base font-bold">S</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-serif">
                scholly
              </span>
            </div>
            <p className="text-[#e0e1dd]/80 text-xs leading-relaxed">
              Find the right college and scholarship for your future. Grounded in source-verified data from admissions offices and official collegiate bodies worldwide.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#778da9] font-medium">
              <Heart className="w-3.5 h-3.5 fill-current text-[#778da9]" />
              <span>Built for students worldwide</span>
            </div>
          </div>

          {/* Column 2: Colleges & Universities */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs tracking-wider uppercase">
              Colleges &amp; Universities
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/universities" className="text-[#778da9] hover:text-[#e0e1dd] transition-colors">
                  Explore All Universities
                </Link>
              </li>
              <li>
                <Link href="/universities?country=Germany" className="text-[#778da9] hover:text-[#e0e1dd] transition-colors">
                  Universities in Germany (Low Tuition)
                </Link>
              </li>
              <li>
                <Link href="/universities?country=United+Kingdom" className="text-[#778da9] hover:text-[#e0e1dd] transition-colors">
                  Top Colleges in the UK
                </Link>
              </li>
              <li>
                <Link href="/universities?country=Canada" className="text-[#778da9] hover:text-[#e0e1dd] transition-colors">
                  Top Colleges in Canada
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Scholarships & Aid */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs tracking-wider uppercase">
              Scholarships &amp; Financial Aid
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/scholarships?funding=Fully+Funded" className="text-[#778da9] hover:text-[#e0e1dd] transition-colors">
                  Full-Ride Scholarships
                </Link>
              </li>
              <li>
                <Link href="/scholarships?fee=0" className="text-[#778da9] hover:text-[#e0e1dd] transition-colors">
                  No Application Fee Opportunities
                </Link>
              </li>
              <li>
                <Link href="/scholarships?degree=Master" className="text-[#778da9] hover:text-[#e0e1dd] transition-colors">
                  Master’s Fellowships
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="text-[#e0e1dd] hover:text-white transition-colors font-semibold">
                  Ask AI Advisor →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Student Tools */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs tracking-wider uppercase">
              Student Workspace
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="text-[#778da9] hover:text-[#e0e1dd] transition-colors">
                  My Saved List &amp; Deadlines
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-[#778da9] hover:text-[#e0e1dd] transition-colors">
                  My Profile &amp; Match Score
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-[rgba(119,141,169,0.25)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#778da9]">
          <p>© 2026 Scholly. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-[#e0e1dd]/70">
            <ShieldCheck className="w-4 h-4 text-[#778da9]" />
            <span>Always verify deadlines directly with host institution admissions.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
