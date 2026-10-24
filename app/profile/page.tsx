"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Save,
  CheckCircle2,
  Sparkles,
  Award,
  GraduationCap,
  ArrowRight,
  Globe,
  DollarSign
} from 'lucide-react';
import AuthGate from '../components/AuthGate';
import { useAuth } from '../lib/auth-context';
import { StudentProfile } from '../types';
import { SAMPLE_SCHOLARSHIPS, SAMPLE_UNIVERSITIES } from '../data/sampleData';
import { calculateMatchScore } from '../lib/opportunities';

const POPULAR_DESTINATIONS = [
  'Germany',
  'United Kingdom',
  'Canada',
  'France',
  'Japan',
  'United States',
  'Switzerland',
  'South Africa'
];

const NATIONALITIES = [
  'International / Any',
  'Nigeria',
  'Ethiopia',
  'Kenya',
  'Ghana',
  'South Africa',
  'Egypt',
  'Rwanda',
  'India',
  'Pakistan',
  'Bangladesh',
  'Indonesia',
  'Brazil',
  'Colombia',
  'Mexico',
  'Germany',
  'France',
  'United Kingdom'
];

export default function ProfilePage() {
  return (
    <AuthGate
      featureName="Profile & Match Preferences"
      description="Save your GPA, intended degree, and preferred countries to unlock real-time personalized college and scholarship fit scores."
      icon="profile"
    >
      <ProfileContent />
    </AuthGate>
  );
}

function ProfileContent() {
  const { profile, updateProfile, user } = useAuth();

  const [formData, setFormData] = useState<StudentProfile>(
    profile || {
      full_name: '',
      email: user?.email || '',
      nationality: 'International / Any',
      current_education_level: 'Undergraduate',
      target_degree_level: 'Master',
      field_of_study: 'Computer Science & Engineering',
      gpa: 3.6,
      english_proficiency: 'IELTS',
      max_annual_budget_usd: 5000,
      preferred_destinations: ['Germany', 'United Kingdom', 'Canada'],
      needs_full_funding: true
    }
  );

  const [isSavedAlert, setIsSavedAlert] = useState(false);

  const handleDestinationToggle = (country: string) => {
    setFormData((prev) => {
      const exists = prev.preferred_destinations.includes(country);
      const updated = exists
        ? prev.preferred_destinations.filter((c) => c !== country)
        : [...prev.preferred_destinations, country];
      return { ...prev, preferred_destinations: updated };
    });
    setIsSavedAlert(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 4000);
  };

  // Compute live match scores against top opportunities
  const matchedScholarships = SAMPLE_SCHOLARSHIPS.map((s) => ({
    opportunity: s,
    type: 'scholarship' as const,
    match: calculateMatchScore(formData, s)
  })).sort((a, b) => b.match.score - a.match.score).slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      
      {/* Header Banner */}
      <div className="mb-8 pb-6 border-b border-[#EDE4D3]">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#D97706] uppercase tracking-wider mb-1">
          <User className="w-4 h-4" />
          <span>Student Profile</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
          My Profile & Fit Preferences
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-2xl">
          Enter your academic credentials and destination preferences. We use this data to calculate your personalized fit grades and scholarship matches.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#EDE4D3] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
          >
            {isSavedAlert && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-semibold">Your preferences have been saved! Matching scores updated.</span>
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="e.g. Samuel Adeyemi"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-zinc-200 rounded-xl focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  Account Email
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || formData.email}
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-500 font-medium cursor-not-allowed"
                />
              </div>
            </div>

            {/* Nationality & Academic Standing */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  Citizenship / Origin
                </label>
                <select
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-zinc-200 rounded-xl focus:outline-none focus:border-[#D97706]"
                >
                  {NATIONALITIES.map((nat) => (
                    <option key={nat} value={nat}>{nat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  Current Level
                </label>
                <select
                  value={formData.current_education_level}
                  onChange={(e) => setFormData({ ...formData, current_education_level: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-zinc-200 rounded-xl focus:outline-none focus:border-[#D97706]"
                >
                  <option value="High School">High School Senior</option>
                  <option value="Undergraduate">College Student / Graduate</option>
                  <option value="Master">Master’s Holder</option>
                  <option value="PhD">Doctorate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  Cumulative GPA (4.0 scale)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1.0"
                  max="4.0"
                  value={formData.gpa ?? ''}
                  onChange={(e) => setFormData({ ...formData, gpa: e.target.value === '' ? null : Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-zinc-200 rounded-xl font-bold focus:outline-none focus:border-[#D97706]"
                />
              </div>
            </div>

            {/* Target Degree & Field */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  Intended Target Degree
                </label>
                <select
                  value={formData.target_degree_level}
                  onChange={(e) => setFormData({ ...formData, target_degree_level: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-zinc-200 rounded-xl focus:outline-none focus:border-[#D97706]"
                >
                  <option value="Bachelor">Bachelor’s Degree</option>
                  <option value="Master">Master’s Degree</option>
                  <option value="PhD">PhD / Doctorate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  Major or Field of Study
                </label>
                <input
                  type="text"
                  value={formData.field_of_study}
                  onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                  placeholder="e.g. Computer Science, Public Policy..."
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-zinc-200 rounded-xl focus:outline-none focus:border-[#D97706]"
                />
              </div>
            </div>

            {/* Language & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  English Language Proficiency
                </label>
                <select
                  value={formData.english_proficiency}
                  onChange={(e) => setFormData({ ...formData, english_proficiency: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-zinc-200 rounded-xl focus:outline-none focus:border-[#D97706]"
                >
                  <option value="IELTS">IELTS Certificate Available</option>
                  <option value="TOEFL">TOEFL iBT Available</option>
                  <option value="Duolingo">Duolingo English Test</option>
                  <option value="Native/Exempt">Medium of Instruction Waiver / Native</option>
                  <option value="None">No Test Yet (Seeking Waivers)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  Annual Out-of-Pocket Budget (USD)
                </label>
                <input
                  type="number"
                  step="500"
                  value={formData.max_annual_budget_usd}
                  onChange={(e) => setFormData({ ...formData, max_annual_budget_usd: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-zinc-200 rounded-xl font-bold focus:outline-none focus:border-[#D97706]"
                />
              </div>
            </div>

            {/* Preferred Destination Countries */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-2">
                Preferred Study Destinations
              </label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_DESTINATIONS.map((country) => {
                  const selected = formData.preferred_destinations.includes(country);
                  return (
                    <button
                      key={country}
                      type="button"
                      onClick={() => handleDestinationToggle(country)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                        selected
                          ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] shadow-xs'
                          : 'bg-[#FAF8F5] text-zinc-700 border border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {country}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Full-funding switch */}
            <div className="p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-zinc-900 block">Require Full Funding?</span>
                <span className="text-xs text-zinc-600">Prioritize scholarships that cover 100% tuition and living expenses.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.needs_full_funding}
                onChange={(e) => setFormData({ ...formData, needs_full_funding: e.target.checked })}
                className="w-5 h-5 accent-[#D97706]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm rounded-full shadow-sm hover:shadow transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save My Preferences</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Live Match Recommendations */}
        <div className="space-y-6">
          <div className="bg-white border border-[#EDE4D3] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
              <Sparkles className="w-4 h-4 text-[#D97706]" />
              <h3 className="text-base font-bold text-zinc-900">
                Top Tailored Matches
              </h3>
            </div>
            <p className="text-xs text-zinc-500">
              Calculated for {formData.target_degree_level} programs and GPA ({formData.gpa || '3.6'}).
            </p>

            <div className="space-y-3">
              {matchedScholarships.map(({ opportunity, match }) => (
                <Link
                  key={opportunity.id}
                  href={`/scholarships/${opportunity.id}`}
                  className="block p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#FEF3C7]/60 border border-[#EDE4D3] hover:border-[#D97706] transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase">{opportunity.country_located}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                      {match.score}% Match • A+
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 group-hover:text-[#D97706] line-clamp-2">
                    {opportunity.title}
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {match.reasons.slice(0, 2).map((r, idx) => (
                      <li key={idx} className="text-[11px] text-zinc-600 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{r}</span>
                      </li>
                    ))}
                  </ul>
                </Link>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/scholarships"
                className="text-xs font-bold text-[#D97706] hover:underline flex items-center gap-1"
              >
                <span>Browse all matched scholarships →</span>
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
