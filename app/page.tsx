"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Award,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Globe,
  FileCheck,
  DollarSign,
  BookOpen,
  Calendar,
} from "lucide-react";
import { SAMPLE_SCHOLARSHIPS, SAMPLE_UNIVERSITIES } from "./data/sampleData";
import ScholarshipCard from "./components/ScholarshipCard";
import UniversityCard from "./components/UniversityCard";

const DEGREE_TABS = [
  { label: "All Levels", value: "" },
  { label: "Bachelor's", value: "Bachelor" },
  { label: "Master's", value: "Master" },
  { label: "Doctorate", value: "PhD" },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDegree, setSelectedDegree] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedDegree) params.set("degree", selectedDegree);
    router.push(
      `/scholarships${params.toString() ? `?${params.toString()}` : ""}`,
    );
  };

  const categoryPillList = [
    {
      label: "Colleges & Universities",
      href: "/universities",
      icon: GraduationCap,
      count: "100+ Schools",
    },
    {
      label: "Full-Ride Scholarships",
      href: "/scholarships?funding=Fully+Funded",
      icon: Award,
      count: "100% Free",
    },
    {
      label: "Graduate Programs",
      href: "/scholarships?degree=Master",
      icon: BookOpen,
      count: "Master's & PhD",
    },
    {
      label: "No Application Fee",
      href: "/scholarships?fee=0",
      icon: DollarSign,
      count: "$0 Fee",
    },
    {
      label: "AI Study Advisor",
      href: "/assistant",
      icon: Sparkles,
      count: "24/7 Help",
    },
  ];

  const popularSearches = [
    { label: "Full Ride", href: "/scholarships?funding=Fully+Funded" },
    { label: "Germany", href: "/universities?country=Germany" },
    { label: "United Kingdom", href: "/universities?country=United+Kingdom" },
    { label: "No App Fee", href: "/scholarships?fee=0" },
    { label: "Undergraduate", href: "/scholarships?degree=Bachelor" },
    { label: "Master's", href: "/scholarships?degree=Master" },
  ];

  const trustStats = [
    {
      stat: "8,400+",
      icon: FileCheck,
      label: "Verified Scholarships",
      description:
        "Every sensitive metric—TOEFL waivers, GPA floors, stipend amounts—links directly to the university or government portal.",
    },
    {
      stat: "150",
      icon: Globe,
      label: "Countries Covered",
      description:
        "Whether applying from Africa, Asia, Europe, or the Americas, discover scholarships tailored to your citizenship.",
    },
    {
      stat: "$0",
      icon: ShieldCheck,
      label: "Hidden Fees",
      description:
        "Track priority vs. regular deadlines, required recommendation letters, and standardized tests — all in one free tool.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FBF9F5]">
      {/* ── Hero ── */}
      <section className="relative pt-14 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#FBF9F5]">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-bold mb-5 border border-[#FDE68A] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Source-backed student intelligence from 150 countries</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.12]">
            Find the right college and scholarship for you
          </h1>

          <p className="mt-4 text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Search thousands of verified degree programs, compare true net
            tuition costs, and find funding you actually qualify for.
          </p>

          {/* Degree Tabs */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            {DEGREE_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedDegree(tab.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  selectedDegree === tab.value
                    ? "bg-[#D97706] text-white border-[#D97706] shadow-sm"
                    : "bg-white/80 text-zinc-600 border-[#EDE4D3] hover:border-[#D97706] hover:text-[#D97706]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Elevated Floating Dock Hero Search Bar */}
          <div className="relative mt-5 max-w-3xl mx-auto">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-200/40 via-amber-100/50 to-amber-200/40 rounded-full blur-md opacity-80 pointer-events-none" />
            <form
              onSubmit={handleSearchSubmit}
              className="relative bg-white/95 backdrop-blur-md rounded-full border border-[#EDE4D3] shadow-xl shadow-amber-950/5 hover:border-[#D97706] focus-within:ring-4 focus-within:ring-[#FEF3C7] focus-within:border-[#D97706] transition-all flex items-center gap-2 px-3 py-2"
            >
              <Search className="w-5 h-5 text-zinc-400 ml-2.5 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by school, scholarship, field, or country…"
                className="flex-1 min-w-0 px-2 py-2 bg-transparent text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none font-medium"
              />
              <button
                type="submit"
                className="px-7 py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm rounded-full shadow-sm hover:shadow-md transition-all whitespace-nowrap flex-shrink-0"
              >
                Search
              </button>
            </form>
          </div>

          {/* Popular tags */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="text-zinc-400 font-medium">Popular:</span>
            {popularSearches.map((p) => (
              <Link
                key={p.label}
                href={p.href}
                className="px-2.5 py-1 rounded-full bg-white/90 hover:bg-[#FEF3C7] text-zinc-600 hover:text-[#92400E] border border-[#EDE4D3] transition-colors font-medium shadow-2xs"
              >
                {p.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Category Cards — elevated with warm-card-lift */}
        <div className="max-w-6xl mx-auto mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categoryPillList.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                href={cat.href}
                className="bg-white hover:bg-[#FFFBEB] p-5 rounded-3xl border border-[#EDE4D3] hover:border-[#D97706] shadow-xs warm-card-lift text-center flex flex-col items-center justify-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-2xs">
                  <Icon className="w-7 h-7 text-[#D97706]" />
                </div>
                <h3 className="text-xs font-bold text-zinc-900 group-hover:text-[#D97706] transition-colors leading-tight">
                  {cat.label}
                </h3>
                <span className="text-[11px] text-zinc-500 font-medium mt-1">
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Gradient-fade section divider */}
        <div className="max-w-6xl mx-auto mt-16 warm-divider" />
      </section>

      {/* ── Featured Scholarships ── */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#D97706] uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              <span>Full &amp; Partial Funding</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Top Scholarships for International Students
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Vetted funding awards covering tuition, living expenses, and
              airfare.
            </p>
          </div>
          <Link
            href="/scholarships"
            className="text-xs font-bold text-[#D97706] hover:text-[#B45309] transition-colors whitespace-nowrap"
          >
            Browse all scholarships
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_SCHOLARSHIPS.slice(0, 3).map((scholarship, i) => (
            <ScholarshipCard
              key={scholarship.id}
              scholarship={scholarship}
              featured={i === 0}
            />
          ))}
        </div>

        <div className="mt-14 warm-divider" />
      </section>

      {/* ── AI Advisor Callout ── */}
      <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-[#FEF3C7] via-[#FFFBEB] to-[#FEF3C7] border border-[#FDE68A] rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#92400E] text-xs font-bold border border-[#FDE68A] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Meet Your 24/7 College Advisor</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Need personalized advice for your GPA &amp; budget?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
              Ask our AI advisor about English test waivers, eligibility
              matching for your nationality, and step-by-step document
              checklists backed by real admissions databases.
            </p>
          </div>
          <Link
            href="/assistant"
            className="px-7 py-3.5 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm rounded-full transition-all shadow-sm hover:shadow whitespace-nowrap flex-shrink-0"
          >
            Chat with AI Advisor
          </Link>
        </div>

        <div className="mt-14 warm-divider" />
      </section>

      {/* ── Featured Universities ── */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#D97706] uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Higher Education</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Featured Global Colleges &amp; Universities
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Explore colleges by international student acceptance quotas and
              verified tuition waivers.
            </p>
          </div>
          <Link
            href="/universities"
            className="text-xs font-bold text-[#D97706] hover:text-[#B45309] transition-colors whitespace-nowrap"
          >
            Browse all universities
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_UNIVERSITIES.slice(0, 3).map((uni, i) => (
            <UniversityCard key={uni.id} university={uni} featured={i === 0} />
          ))}
        </div>
      </section>

      {/* ── Trust Stats ── */}
      <section className="bg-white border-t border-[#EDE4D3]/70 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              The Real Data You Need to Decide
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-2">
              Applying abroad is a huge milestone. We cut out marketing fluff
              with verified requirements and transparent funding facts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustStats.map(({ stat, icon: Icon, label, description }) => (
              <div
                key={label}
                className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#EDE4D3] space-y-3 warm-card-lift"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#FEF3C7] flex items-center justify-center shadow-2xs">
                  <Icon className="w-5 h-5 text-[#D97706]" />
                </div>
                <div>
                  <span className="font-serif block text-4xl font-extrabold text-zinc-900 tracking-tight">
                    {stat}
                  </span>
                  <span className="block text-sm font-bold text-[#D97706] mt-0.5">
                    {label}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
