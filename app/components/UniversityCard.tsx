"use client";

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Heart,
  ExternalLink,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  GraduationCap,
  Sparkles,
  FileText
} from 'lucide-react';
import { University, SupabaseUniversity } from '../types';
import { useSaved } from '../lib/saved-context';

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

  // Location logic - only show if country or campus location is present
  const hasCountry = Boolean(university.country_located && university.country_located.trim() !== '');
  const campusList = Array.isArray(university.campus_locations)
    ? university.campus_locations.filter((c) => Boolean(c && c.trim() !== ''))
    : [];
  const hasCampus = campusList.length > 0;
  const locationString = hasCampus
    ? `${campusList[0]}${hasCountry ? `, ${university.country_located}` : ''}`
    : hasCountry
    ? university.country_located
    : null;

  // University type
  const hasType = Boolean(university.university_type && university.university_type.trim() !== '');

  // Accolade snippet
  const accolades = Array.isArray(university.notable_accolades)
    ? university.notable_accolades.filter((a) => Boolean(a && a.trim() !== ''))
    : [];
  const topAccolade = accolades.length > 0 ? accolades[0] : null;

  // Key metrics check
  const hasCoverage =
    university.annual_tuitioin_coveratge_cost !== null &&
    university.annual_tuitioin_coveratge_cost !== undefined &&
    university.annual_tuitioin_coveratge_cost > 0;

  const hasWaiverThreshold =
    university.tuition_waiver_threshold !== null &&
    university.tuition_waiver_threshold !== undefined &&
    university.tuition_waiver_threshold > 0;

  const hasGpa =
    university.minimum_gpa !== null &&
    university.minimum_gpa !== undefined;

  const hasAppFee = Boolean(
    university.application_fee !== null &&
    university.application_fee !== undefined &&
    String(university.application_fee).trim() !== ''
  );

  const hasRecLetters = Boolean(
    university.number_of_recommendation_letters_required !== null &&
    university.number_of_recommendation_letters_required !== undefined &&
    String(university.number_of_recommendation_letters_required).trim() !== ''
  );

  const hasMetric = hasCoverage || hasWaiverThreshold || hasGpa || hasAppFee || hasRecLetters;

  // Policy & Testing Badges
  const hasNeedBlind = university.need_blind !== null && university.need_blind !== undefined;
  const hasSat = university.sat_required !== null && university.sat_required !== undefined;
  const hasEnglishProf = university.english_proficiency_required !== null && university.english_proficiency_required !== undefined;
  const englishTests = Array.isArray(university.accepted_english_proficiency_tests)
    ? university.accepted_english_proficiency_tests.filter((t) => Boolean(t && t.trim() !== ''))
    : [];
  const hasEnglishTests = englishTests.length > 0;

  const hasPolicyBadges = hasNeedBlind || hasSat || hasEnglishProf || hasEnglishTests;

  // Study Fields & Majors
  const fields = Array.isArray(university.fields)
    ? university.fields.filter((f) => Boolean(f && f.trim() !== ''))
    : [];
  const hasFields = fields.length > 0;

  // Education Levels
  const levels = Array.isArray(university.education_levels)
    ? university.education_levels.filter((l) => Boolean(l && l.trim() !== ''))
    : [];
  const hasLevels = levels.length > 0;

  // Platforms
  const platforms = Array.isArray(university.accepted_application_platform)
    ? university.accepted_application_platform.filter((p) => Boolean(p && p.trim() !== ''))
    : [];
  const hasPlatforms = platforms.length > 0;

  // Financial Aid Policy
  const hasAidPolicy = Boolean(
    university.financial_aid_policy &&
    university.financial_aid_policy.trim() !== ''
  );

  // Deadlines
  const deadlines = Array.isArray(university.university_deadlines) && university.university_deadlines.length > 0
    ? university.university_deadlines
    : (university as any).deadlines && (university as any).deadlines.length > 0
    ? (university as any).deadlines.map((d: any) => ({
        deadline_type: d.type || 'Deadline',
        deadline_date: d.date || ''
      }))
    : [];
  const upcomingDeadline = deadlines.length > 0 ? deadlines[0] : null;

  // Application URL
  const appUrl = university.application_url || (university as any).website_url || null;

  // Niche grade representation
  const sealLetter = name.charAt(0).toUpperCase() || 'A';

  return (
    <div
      className={`group relative bg-white border rounded-3xl overflow-hidden warm-card-lift flex flex-col justify-between ${
        featured
          ? 'border-[#D97706] shadow-sm ring-1 ring-[#D97706]/20'
          : 'border-[#EDE4D3]'
      }`}
    >
      {/* Visual Header Thumbnail Band */}
      <div className="relative h-14 w-full bg-gradient-to-r from-[#FEF3C7] via-[#FFFBEB] to-[#FDE68A]/40 border-b border-[#EDE4D3]/70 px-5 flex items-center justify-between">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#92400e_1px,transparent_1px)] [background-size:10px_10px]" />

        {/* Location Badge - ONLY shown if location is non-null */}
        {locationString ? (
          <div className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-[#EDE4D3] text-zinc-700 text-xs font-semibold shadow-2xs max-w-[80%] truncate">
            <MapPin className="w-3.5 h-3.5 text-[#D97706] flex-shrink-0" />
            <span className="truncate">{locationString}</span>
          </div>
        ) : (
          <div />
        )}

        {/* Bookmark Button */}
        <button
          onClick={() => toggleSaveOpportunity(university, 'university')}
          title={saved ? 'Remove from saved' : 'Save university'}
          className={`relative p-2 rounded-full transition-all border ${
            saved
              ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A] shadow-xs'
              : 'bg-white/90 hover:bg-white text-zinc-400 hover:text-zinc-700 border-[#EDE4D3]/60'
          }`}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-current text-[#D97706]' : ''}`} />
        </button>

        {featured && (
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#D97706] text-white text-[10px] font-extrabold uppercase rounded-b-md shadow-xs tracking-wider">
            Featured College
          </div>
        )}
      </div>

      <div className="p-6 pt-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3.5">
          {/* Header Metadata & Seal */}
          <div className="flex items-start gap-3">
            {/* Authentic Circular Niche Seal */}
            <div className="niche-seal" title={`${name} Seal`}>
              {sealLetter}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* University Type - ONLY if not null */}
                {hasType && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#F7F3EA] border border-[#E8DEC9] text-[#78350F] capitalize">
                    {university.university_type}
                  </span>
                )}

                {/* Funding Type Badge - ONLY if not null */}
                {university.funding_type && university.funding_type.trim() !== '' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E]">
                    {university.funding_type}
                  </span>
                )}

                {/* Delivery Mode - ONLY if not null */}
                {university.program_delivery_mode && university.program_delivery_mode.trim() !== '' && (
                  <span className="text-[10px] font-medium text-zinc-400">
                    {university.program_delivery_mode}
                  </span>
                )}
              </div>

              {/* University Title with Editorial Serif */}
              <h3 className="font-serif text-lg font-bold text-zinc-900 group-hover:text-[#D97706] transition-colors mt-1 leading-snug">
                <Link href={`/universities/${encodeURIComponent(id)}`}>
                  {name}
                </Link>
              </h3>
            </div>
          </div>

          {/* Accolade Quote - ONLY if not null */}
          {topAccolade && (
            <p className="text-xs text-zinc-600 bg-[#FAF8F5] p-2.5 rounded-xl border border-zinc-100 italic line-clamp-2">
              "{topAccolade}"
            </p>
          )}

          {/* Key Metrics Grid - ONLY if at least one metric is not null */}
          {hasMetric && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A]/70 text-xs">
              {/* Coverage Cost */}
              {hasCoverage && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-zinc-500 block">Est. Aid / Cost</span>
                  <span className="font-extrabold text-zinc-900 block mt-0.5">
                    ${university.annual_tuitioin_coveratge_cost?.toLocaleString()}/yr
                  </span>
                </div>
              )}

              {/* Tuition Waiver Threshold */}
              {hasWaiverThreshold && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-zinc-500 block">Waiver Cap</span>
                  <span className="font-extrabold text-zinc-900 block mt-0.5">
                    ${university.tuition_waiver_threshold?.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Minimum GPA */}
              {hasGpa && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-zinc-500 block">Min GPA</span>
                  <span className="font-extrabold text-zinc-900 block mt-0.5">
                    {university.minimum_gpa}
                  </span>
                </div>
              )}

              {/* Application Fee */}
              {hasAppFee && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-zinc-500 block">App Fee</span>
                  <span className="font-extrabold text-zinc-900 block mt-0.5 truncate" title={String(university.application_fee)}>
                    {university.application_fee}
                  </span>
                </div>
              )}

              {/* Letters of Recommendation */}
              {hasRecLetters && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-zinc-500 block">Rec Letters</span>
                  <span className="font-extrabold text-zinc-900 block mt-0.5">
                    {university.number_of_recommendation_letters_required} Letters
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Admissions Criteria & Test Policies - ONLY if not null */}
          {hasPolicyBadges && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {/* Need-Blind Policy */}
              {hasNeedBlind && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    university.need_blind
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-600'
                  }`}
                >
                  <ShieldCheck className={`w-3 h-3 ${university.need_blind ? 'text-emerald-600' : 'text-zinc-400'}`} />
                  <span>{university.need_blind ? 'Need-Blind Admission' : 'Need-Aware'}</span>
                </span>
              )}

              {/* SAT / ACT Policy */}
              {hasSat && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    university.sat_required
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  }`}
                >
                  <CheckCircle2 className={`w-3 h-3 ${university.sat_required ? 'text-amber-600' : 'text-emerald-600'}`} />
                  <span>{university.sat_required ? 'SAT / ACT Required' : 'Test-Optional'}</span>
                </span>
              )}

              {/* English Proficiency Policy */}
              {hasEnglishProf && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    university.english_proficiency_required
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  }`}
                >
                  <span>
                    {university.english_proficiency_required
                      ? hasEnglishTests
                        ? `English Test: ${englishTests.slice(0, 2).join(', ')}`
                        : 'English Test Required'
                      : 'English Test Waived / Optional'}
                  </span>
                </span>
              )}

              {/* Accepted English Tests if english_proficiency_required was null but tests listed */}
              {!hasEnglishProf && hasEnglishTests && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FAF8F5] border border-zinc-200 text-zinc-700">
                  <span>Tests: {englishTests.slice(0, 3).join(', ')}</span>
                </span>
              )}
            </div>
          )}

          {/* Majors & Study Fields - ONLY if non-empty */}
          {hasFields && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-zinc-600 block">
                Fields of Study:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {fields.slice(0, 3).map((field, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-[#F7F3EA] border border-[#E8DEC9] rounded-lg text-xs font-medium text-[#78350F] capitalize"
                  >
                    {field}
                  </span>
                ))}
                {fields.length > 3 && (
                  <span className="px-2 py-1 text-xs text-zinc-400 font-medium">
                    +{fields.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Education Levels & Platforms - ONLY if non-empty */}
          {(hasLevels || hasPlatforms) && (
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs pt-1 border-t border-zinc-100">
              {hasLevels && (
                <div className="flex items-center gap-1 text-zinc-600">
                  <GraduationCap className="w-3.5 h-3.5 text-[#D97706]" />
                  <span className="capitalize">{levels.join(', ')}</span>
                </div>
              )}

              {hasPlatforms && (
                <div className="text-[11px] text-zinc-400 font-medium ml-auto">
                  Platform: <span className="text-zinc-700 font-semibold">{platforms.join(', ')}</span>
                </div>
              )}
            </div>
          )}

          {/* Upcoming Deadline - ONLY if not null */}
          {upcomingDeadline && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-600 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-zinc-100">
              <Calendar className="w-3.5 h-3.5 text-[#D97706] flex-shrink-0" />
              <span>
                Deadline:{' '}
                <strong className="text-zinc-900">
                  {upcomingDeadline.deadline_type ? `${upcomingDeadline.deadline_type} • ` : ''}
                  {upcomingDeadline.deadline_date}
                </strong>
              </span>
            </div>
          )}

          {/* Financial Aid Policy Summary - ONLY if not null */}
          {hasAidPolicy && (
            <div className="p-2.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A]/70 text-xs text-zinc-700 flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706] flex-shrink-0 mt-0.5" />
              <p className="line-clamp-2 text-[11px] leading-relaxed">
                {university.financial_aid_policy}
              </p>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
          <Link
            href={`/universities/${encodeURIComponent(id)}`}
            className="text-xs font-bold text-[#D97706] hover:text-[#B45309] transition-colors"
          >
            See Programs &amp; Admissions →
          </Link>

          {/* External Application URL - ONLY if not null */}
          {appUrl && (
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-zinc-400 hover:text-[#D97706] transition-colors"
              title="Visit official admissions portal"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
