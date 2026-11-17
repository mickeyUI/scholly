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
    <div className="flex flex-col min-h-screen bg-transparent">
      {/* ── Hero ── */}
      <section className="relative pt-14 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[rgba(65,90,119,0.08)] text-[#1b263b] text-xs font-bold mb-5 border border-[rgba(119,141,169,0.35)] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#1b263b]" />
            <span>Source-backed collegiate intelligence from 150 countries</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0d1b2a] leading-[1.12]">
            Find the right college and scholarship for you
          </h1>

          <p className="mt-4 text-sm sm:text-base text-[#415a77] max-w-2xl mx-auto leading-relaxed">
            Search thousands of verified degree programs, compare true net
            tuition costs, and find funding you actually qualify for.
          </p>

          {/* Degree Tabs */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            {DEGREE_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedDegree(tab.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  selectedDegree === tab.value
                    ? "bg-[#1b263b] text-white border-[#1b263b] shadow-sm"
                    : "bg-white/90 text-[#415a77] border-[rgba(119,141,169,0.35)] hover:border-[#1b263b] hover:text-[#0d1b2a]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Elevated Floating Dock Hero Search Bar */}
          <div className="relative mt-5 max-w-3xl mx-auto">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[rgba(65,90,119,0.15)] via-[rgba(27,38,59,0.1)] to-[rgba(65,90,119,0.15)] rounded-full blur-md opacity-80 pointer-events-none" />
            <form
              onSubmit={handleSearchSubmit}
              className="relative bg-white rounded-full border border-[rgba(119,141,169,0.35)] shadow-[0_10px_30px_-4px_rgba(13,27,42,0.08),0_2px_6px_-1px_rgba(13,27,42,0.04)] hover:border-[#1b263b] focus-within:ring-4 focus-within:ring-[rgba(65,90,119,0.15)] focus-within:border-[#1b263b] transition-all flex items-center gap-2 px-3 py-2"
            >
              <Search className="w-5 h-5 text-[#778da9] ml-2.5 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by school, scholarship, field, or country…"
                className="flex-1 min-w-0 px-2 py-2 bg-transparent text-sm text-[#0d1b2a] placeholder:text-[#778da9] focus:outline-none font-medium"
              />
              <button
                type="submit"
                className="px-7 py-3 bg-[#1b263b] hover:bg-[#0d1b2a] text-white font-bold text-sm rounded-full shadow-sm hover:shadow transition-all whitespace-nowrap flex-shrink-0 cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Popular tags */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="text-[#415a77] font-medium">Popular:</span>
            {popularSearches.map((p) => (
              <Link
                key={p.label}
                href={p.href}
                className="px-3 py-1 rounded-full bg-white/90 hover:bg-[#1b263b] text-[#415a77] hover:text-white border border-[rgba(119,141,169,0.35)] transition-colors font-medium shadow-2xs"
              >
                {p.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Category Cards */}
        <div className="max-w-6xl mx-auto mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categoryPillList.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                href={cat.href}
                className="bg-white hover:bg-[#f3f4f0] p-5 rounded-2xl border border-[rgba(119,141,169,0.3)] hover:border-[#1b263b] shadow-[0_10px_30px_-4px_rgba(13,27,42,0.08),0_2px_6px_-1px_rgba(13,27,42,0.04)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-6px_rgba(13,27,42,0.12),0_4px_10px_-2px_rgba(13,27,42,0.06)] text-center flex flex-col items-center justify-center group transition-all duration-200"
              >
                <div className="w-14 h-14 rounded-2xl bg-[rgba(65,90,119,0.08)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-2xs">
                  <Icon className="w-7 h-7 text-[#1b263b]" />
                </div>
                <h3 className="text-xs font-bold text-[#0d1b2a] group-hover:text-[#1b263b] transition-colors leading-tight">
                  {cat.label}
                </h3>
                <span className="text-[11px] text-[#778da9] font-medium mt-1">
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="max-w-6xl mx-auto mt-16 scholastic-divider" />
      </section>

      {/* ── Featured Scholarships ── */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#415a77] uppercase tracking-[0.05em] mb-1">
              <Award className="w-4 h-4 text-[#415a77]" />
              <span>Full &amp; Partial Funding</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0d1b2a] tracking-tight">
              Top Scholarships for International Students
            </h2>
            <p className="text-xs sm:text-sm text-[#415a77] mt-1">
              Vetted funding awards covering tuition, living expenses, and airfare.
            </p>
          </div>
          <Link
            href="/scholarships"
            className="text-xs font-bold text-[#1b263b] hover:text-[#0d1b2a] transition-colors whitespace-nowrap"
          >
            Browse all scholarships →
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

        <div className="mt-14 scholastic-divider" />
      </section>

      {/* ── AI Advisor Callout ── */}
      <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-[#1b263b] text-white border border-[rgba(119,141,169,0.35)] rounded-2xl p-6 sm:p-10 shadow-[0_10px_30px_-4px_rgba(13,27,42,0.12)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#e0e1dd] text-xs font-bold border border-white/20 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Meet Your 24/7 Collegiate Advisor</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Need personalized advice for your GPA &amp; budget?
            </h3>
            <p className="text-xs sm:text-sm text-[#e0e1dd]/80 leading-relaxed">
              Ask our AI advisor about English test waivers, eligibility
              matching for your nationality, and step-by-step document
              checklists backed by real admissions databases.
            </p>
          </div>
          <Link
            href="/assistant"
            className="px-7 py-3.5 bg-white text-[#1b263b] hover:bg-[#e0e1dd] font-bold text-sm rounded-full transition-all shadow-sm hover:shadow whitespace-nowrap flex-shrink-0"
          >
            Chat with AI Advisor
          </Link>
        </div>

        <div className="mt-14 scholastic-divider" />
      </section>

      {/* ── Featured Universities ── */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#415a77] uppercase tracking-[0.05em] mb-1">
              <GraduationCap className="w-4 h-4 text-[#415a77]" />
              <span>Higher Education</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0d1b2a] tracking-tight">
              Featured Global Colleges &amp; Universities
            </h2>
            <p className="text-xs sm:text-sm text-[#415a77] mt-1">
              Explore colleges by international student acceptance quotas and
              verified tuition waivers.
            </p>
          </div>
          <Link
            href="/universities"
            className="text-xs font-bold text-[#1b263b] hover:text-[#0d1b2a] transition-colors whitespace-nowrap"
          >
            Browse all universities →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_UNIVERSITIES.slice(0, 3).map((uni, i) => (
            <UniversityCard key={uni.id} university={uni} featured={i === 0} />
          ))}
        </div>
      </section>

      {/* ── Trust Stats ── */}
      <section className="bg-white border-t border-[rgba(119,141,169,0.25)] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0d1b2a] tracking-tight">
              The Real Data You Need to Decide
            </h2>
            <p className="text-xs sm:text-sm text-[#415a77] mt-2">
              Applying abroad is a huge milestone. We cut out marketing fluff
              with verified requirements and transparent funding facts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustStats.map(({ stat, icon: Icon, label, description }) => (
              <div
                key={label}
                className="bg-[#f3f4f0] p-6 rounded-2xl border border-[rgba(119,141,169,0.25)] space-y-3 shadow-xs hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-[rgba(65,90,119,0.08)] border border-[rgba(119,141,169,0.35)] flex items-center justify-center shadow-2xs">
                  <Icon className="w-5 h-5 text-[#1b263b]" />
                </div>
                <div>
                  <span className="font-serif block text-4xl font-bold text-[#0d1b2a] tracking-tight">
                    {stat}
                  </span>
                  <span className="block text-xs font-bold uppercase tracking-[0.05em] text-[#415a77] mt-1">
                    {label}
                  </span>
                </div>
                <p className="text-xs text-[#415a77] leading-relaxed">
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
