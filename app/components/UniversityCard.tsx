"use client";

import React from 'react';
import Link from 'next/link';
import {
  Heart,
  ShieldCheck,
  GraduationCap,
  Award,
  DollarSign,
  Sparkles
} from 'lucide-react';
import { University } from '../types';
import { useSaved } from '../lib/saved-context';
import { getFlagshipBadge } from '../lib/country-policies';
import UniversityLogo from './UniversityLogo';

export default function UniversityCard({
  university,
  featured = false
}: {
  university: University;
  featured?: boolean;
}) {
  const { isSaved, toggleSaveOpportunity } = useSaved();

  // Safe identifier and title
  const id = university.id || university.organization;
  const name = university.organization || (university as any).name || 'University';
  const saved = isSaved(id);

  // Notable accolade (first accolade or quote)
  const accolades = Array.isArray(university.notable_accolades)
    ? university.notable_accolades.filter((a) => Boolean(a && a.trim() !== ''))
    : [];
  const topAccolade = accolades.length > 0 ? accolades[0] : null;

  // Educational Levels
  const levels = Array.isArray(university.education_levels)
    ? university.education_levels.filter((l) => Boolean(l && l.trim() !== ''))
    : [];

  // Flagship Policy Badge (Multi-Country Aware)
  const flagshipBadge = getFlagshipBadge(university);

  // Application Fee
  const appFeeRaw = university.application_fee !== null && university.application_fee !== undefined
    ? String(university.application_fee).trim()
    : '';
  const isFree = appFeeRaw === '0' || appFeeRaw.toLowerCase() === 'free' || appFeeRaw === '$0';
  const feeDisplay = appFeeRaw
    ? isFree
      ? 'Free ($0)'
      : appFeeRaw.startsWith('$') || isNaN(Number(appFeeRaw))
      ? appFeeRaw
      : `$${appFeeRaw}`
    : 'Fee Waiver / Free';

  return (
    <div
      className={`group relative bg-white border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 shadow-[0_10px_30px_-4px_rgba(13,27,42,0.08),0_2px_6px_-1px_rgba(13,27,42,0.04)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-6px_rgba(13,27,42,0.12),0_4px_10px_-2px_rgba(13,27,42,0.06)] ${
        featured
          ? 'border-[#1b263b] ring-1 ring-[#1b263b]/30'
          : 'border-[rgba(119,141,169,0.3)] hover:border-[rgba(65,90,119,0.5)]'
      }`}
    >
      {/* Header Band: Country / Policy badge & Bookmark */}
      <div className="relative h-12 w-full bg-gradient-to-r from-[#f3f4f0] via-[#ffffff] to-[rgba(224,225,221,0.4)] border-b border-[rgba(119,141,169,0.25)] px-4 flex items-center justify-between">
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#415a77_1px,transparent_1px)] [background-size:12px_12px]" />

        {/* Dynamic Flagship Country Policy Badge */}
        {flagshipBadge ? (
          <span
            className="relative inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs bg-[rgba(65,90,119,0.08)] border-[rgba(119,141,169,0.4)] text-[#0d1b2a]"
          >
            {flagshipBadge.variant === 'emerald' ? (
              <ShieldCheck className="w-3.5 h-3.5 text-[#415a77] flex-shrink-0" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-[#1b263b] flex-shrink-0" />
            )}
            <span className="truncate max-w-[200px]">{flagshipBadge.label}</span>
          </span>
        ) : university.country_located ? (
          <span className="relative inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs bg-[rgba(65,90,119,0.08)] border-[rgba(119,141,169,0.4)] text-[#0d1b2a]">
            <span>{university.country_located}</span>
          </span>
        ) : (
          <div />
        )}

        {/* Bookmark Button */}
        <button
          onClick={() => toggleSaveOpportunity(university, 'university')}
          title={saved ? 'Remove from saved' : 'Save university'}
          className={`relative p-1.5 rounded-full transition-all border ${
            saved
              ? 'bg-[#1b263b] text-white border-[#1b263b] shadow-xs'
              : 'bg-white/90 hover:bg-white text-[#778da9] hover:text-[#0d1b2a] border-[rgba(119,141,169,0.3)]'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-current text-white' : ''}`} />
        </button>
      </div>

      {/* Main Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3.5">
          {/* University Name & Crest Medallion */}
          <div className="flex items-start gap-3">
            <UniversityLogo
              name={name}
              logoUrl={university.logo_url}
              size="md"
            />

            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-lg font-bold text-[#0d1b2a] group-hover:text-[#1b263b] transition-colors leading-snug line-clamp-2">
                <Link href={`/universities/${encodeURIComponent(id)}`}>
                  {name}
                </Link>
              </h3>
            </div>
          </div>

          {/* Notable Accolade - Low-contrast slate wash container with italic text */}
          {topAccolade && (
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#f3f4f0] border border-[rgba(119,141,169,0.25)] text-xs text-[#0d1b2a] italic">
              <Award className="w-3.5 h-3.5 text-[#415a77] flex-shrink-0 mt-0.5" />
              <p className="line-clamp-2">"{topAccolade}"</p>
            </div>
          )}

          {/* Educational Levels */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#415a77] flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#415a77]" />
              <span>EDUCATIONAL LEVELS</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {levels.length > 0 ? (
                levels.map((lvl, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full border border-[rgba(119,141,169,0.35)] bg-[rgba(65,90,119,0.08)] text-xs font-bold text-[#0d1b2a] capitalize"
                  >
                    {lvl}
                  </span>
                ))
              ) : (
                <span className="px-3 py-1 rounded-full border border-[rgba(119,141,169,0.35)] bg-[rgba(65,90,119,0.08)] text-xs font-semibold text-[#0d1b2a]">
                  Undergraduate &amp; Graduate
                </span>
              )}
            </div>
          </div>

          {/* Application Fee */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f3f4f0] border border-[rgba(119,141,169,0.3)] text-xs">
            <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#415a77] flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#415a77]" />
              <span>APPLICATION FEE</span>
            </span>
            <span className="font-bold text-[#0d1b2a]" title={feeDisplay}>
              {feeDisplay}
            </span>
          </div>
        </div>

        {/* Action Link: See Programs & Admissions */}
        <div className="pt-3 border-t border-[rgba(119,141,169,0.2)] flex items-center justify-between">
          <Link
            href={`/universities/${encodeURIComponent(id)}`}
            className="text-xs font-bold text-[#1b263b] hover:text-[#0d1b2a] transition-colors inline-flex items-center gap-1"
          >
            <span>See Programs &amp; Admissions</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
