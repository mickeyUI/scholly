"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  GraduationCap,
  MapPin,
  Award,
  ExternalLink,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  BookOpen,
  DollarSign,
  ArrowLeft,
  Heart,
  Sparkles,
  Globe,
  Building2,
  Briefcase,
  Languages
} from 'lucide-react';
import { University } from '../../types';
import { getUniversityById } from '../../lib/opportunities';
import { useSaved } from '../../lib/saved-context';
import { getGroupedPolicies, getNormalizedPolicies } from '../../lib/country-policies';
import UniversityLogo from '../../components/UniversityLogo';

export default function UniversityDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center py-28">
          <div className="w-8 h-8 border-3 border-[#1b263b] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <UniversityDetailContent />
    </Suspense>
  );
}

function UniversityDetailContent() {
  const params = useParams();
  const rawId = params?.id as string;
  const id = rawId ? decodeURIComponent(rawId) : '';
  const [university, setUniversity] = useState<University | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { isSaved, toggleSaveOpportunity } = useSaved();

  useEffect(() => {
    if (id) {
      getUniversityById(id).then((data) => {
        setUniversity(data);
        setIsLoading(false);
      });
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-28">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#1b263b] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#415a77]">Loading university profile...</p>
        </div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-[#0d1b2a] mb-2">University Not Found</h2>
        <p className="text-xs text-[#415a77] mb-6">We couldn't find an institutional record matching that identifier.</p>
        <Link
          href="/universities"
          className="px-6 py-2.5 bg-[#1b263b] hover:bg-[#0d1b2a] text-white text-xs font-bold rounded-full shadow-sm"
        >
          Return to All Colleges
        </Link>
      </div>
    );
  }

  const uniId = university.id || university.organization;
  const saved = isSaved(uniId);
  const name = university.organization || university.name || 'University';
  const country = university.country_located || university.country || '';
  const campuses = Array.isArray(university.campus_locations)
    ? university.campus_locations.filter((c) => Boolean(c && c.trim() !== ''))
    : [];
  const locationString = campuses.length > 0
    ? `${campuses.join(', ')}${country ? ` • ${country}` : ''}`
    : country || null;

  const portalUrl = university.application_url || university.admissions_url || university.website_url || null;

  const accolades = Array.isArray(university.notable_accolades)
    ? university.notable_accolades.filter((a) => Boolean(a && a.trim() !== ''))
    : [];

  const fields = Array.isArray(university.fields)
    ? university.fields.filter((f) => Boolean(f && f.trim() !== ''))
    : [];

  const levels = Array.isArray(university.education_levels)
    ? university.education_levels.filter((l) => Boolean(l && l.trim() !== ''))
    : [];

  const englishTests = Array.isArray(university.accepted_english_proficiency_tests)
    ? university.accepted_english_proficiency_tests.filter((t) => Boolean(t && t.trim() !== ''))
    : [];

  const standardizedTests = Array.isArray(university.minimum_standardized_test_scores) && university.minimum_standardized_test_scores.length > 0
    ? university.minimum_standardized_test_scores.filter((t) => Boolean(t && t.trim() !== ''))
    : Array.isArray(university.standardized_tests)
    ? university.standardized_tests.filter((t) => Boolean(t && t.trim() !== ''))
    : [];

  const platforms = Array.isArray(university.accepted_application_platform)
    ? university.accepted_application_platform.filter((p) => Boolean(p && p.trim() !== ''))
    : [];

  const normalizedPolicies = getNormalizedPolicies(university);
  const policyGroups = getGroupedPolicies(university);
  const effectiveNeedBlind = normalizedPolicies.need_blind !== undefined ? normalizedPolicies.need_blind : university.need_blind;
  const effectiveSatRequired = normalizedPolicies.sat_required !== undefined ? normalizedPolicies.sat_required : university.sat_required;

  const deadlines = Array.isArray(university.university_deadlines) && university.university_deadlines.length > 0
    ? university.university_deadlines.map((d) => ({
        type: d.deadline_type || 'Deadline',
        date: d.deadline_date || '',
        notes: ''
      }))
    : Array.isArray(university.deadlines) && university.deadlines.length > 0
    ? university.deadlines.map((d) => ({
        type: d.type || 'Deadline',
        date: d.date || '',
        notes: d.notes || ''
      }))
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs text-[#415a77] font-medium">
        <Link href="/universities" className="hover:text-[#0d1b2a] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Universities</span>
        </Link>
        <span>/</span>
        <span className="text-[#0d1b2a] font-semibold truncate">{name}</span>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white border border-[rgba(119,141,169,0.3)] rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-4px_rgba(13,27,42,0.08),0_2px_6px_-1px_rgba(13,27,42,0.04)] mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0d1b2a] via-[#1b263b] to-[#415a77]" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pt-2">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-3 flex-wrap">
              {/* University Seal or Logo */}
              <UniversityLogo
                name={name}
                logoUrl={university.logo_url}
                size="md"
              />

              {university.university_type && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[rgba(65,90,119,0.08)] border border-[rgba(119,141,169,0.35)] text-[#0d1b2a] capitalize">
                  {university.university_type}
                </span>
              )}

              {university.funding_type && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[rgba(65,90,119,0.12)] border border-[rgba(119,141,169,0.4)] text-[#1b263b]">
                  {university.funding_type}
                </span>
              )}

              {locationString && (
                <span className="inline-flex items-center gap-1.5 text-xs text-[#415a77] font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#415a77]" />
                  <span>{locationString}</span>
                </span>
              )}
            </div>

            {/* University Name with Classical Serif */}
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0d1b2a] tracking-tight">
              {name}
            </h1>

            {/* Accolade review snippet */}
            {accolades.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {accolades.map((acc, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs text-[#0d1b2a] bg-[#f3f4f0] border border-[rgba(119,141,169,0.35)] px-3 py-1 rounded-full font-serif italic"
                  >
                    <Award className="w-3.5 h-3.5 text-[#415a77]" />
                    <span>"{acc}"</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-row md:flex-col gap-2.5 flex-shrink-0">
            <button
              onClick={() => toggleSaveOpportunity(university, 'university')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                saved
                  ? 'bg-[#1b263b] text-white border-[#1b263b] shadow-xs'
                  : 'bg-[#f3f4f0] hover:bg-[#e0e1dd]/40 text-[#0d1b2a] border-[rgba(119,141,169,0.35)]'
              }`}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-current text-white' : 'text-[#415a77]'}`} />
              <span>{saved ? 'Saved to My List' : 'Add to My List'}</span>
            </button>

            {portalUrl && (
              <a
                href={portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#1b263b] hover:bg-[#0d1b2a] text-white text-xs font-bold rounded-full flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <span>Admissions Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Institutional Metrics Grid */}
      <div className="bg-white border border-[rgba(119,141,169,0.3)] rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-4px_rgba(13,27,42,0.08),0_2px_6px_-1px_rgba(13,27,42,0.04)] mb-8">
        <h2 className="text-lg font-serif font-bold text-[#0d1b2a] mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-[#415a77]" />
          <span>Institutional Metrics &amp; Admissions Requirements</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Minimum GPA */}
          {university.minimum_gpa !== null && university.minimum_gpa !== undefined && (
            <div className="bg-[#f3f4f0] p-4 rounded-xl border border-[rgba(119,141,169,0.25)] text-center">
              <span className="text-[11px] font-bold text-[#415a77] uppercase tracking-[0.05em] block mb-1">Academics &amp; GPA</span>
              <span className="text-2xl font-serif font-bold text-[#0d1b2a] block">{university.minimum_gpa}</span>
              <span className="text-[11px] text-[#778da9] mt-1 block">Minimum GPA requirement</span>
            </div>
          )}

          {/* Application Fee */}
          {university.application_fee !== null && university.application_fee !== undefined && (
            <div className="bg-[#f3f4f0] p-4 rounded-xl border border-[rgba(119,141,169,0.25)] text-center">
              <span className="text-[11px] font-bold text-[#415a77] uppercase tracking-[0.05em] block mb-1">Application Fee</span>
              <span className="text-lg sm:text-xl font-bold text-[#0d1b2a] block truncate" title={String(university.application_fee)}>
                {university.application_fee}
              </span>
              <span className="text-[11px] text-[#778da9] mt-1 block">Institutional filing fee</span>
            </div>
          )}

          {/* Annual Tuition Coverage */}
          {university.annual_tuitioin_coveratge_cost !== null && university.annual_tuitioin_coveratge_cost !== undefined && university.annual_tuitioin_coveratge_cost > 0 && (
            <div className="bg-[#f3f4f0] p-4 rounded-xl border border-[rgba(119,141,169,0.25)] text-center">
              <span className="text-[11px] font-bold text-[#415a77] uppercase tracking-[0.05em] block mb-1">Tuition Coverage</span>
              <span className="text-2xl font-serif font-bold text-[#1b263b] block">
                ${university.annual_tuitioin_coveratge_cost.toLocaleString()}
              </span>
              <span className="text-[11px] text-[#778da9] mt-1 block">Estimated institutional aid</span>
            </div>
          )}

          {/* Tuition Waiver Threshold */}
          {university.tuition_waiver_threshold !== null && university.tuition_waiver_threshold !== undefined && university.tuition_waiver_threshold > 0 && (
            <div className="bg-[#f3f4f0] p-4 rounded-xl border border-[rgba(119,141,169,0.25)] text-center">
              <span className="text-[11px] font-bold text-[#415a77] uppercase tracking-[0.05em] block mb-1">Waiver Cap</span>
              <span className="text-2xl font-serif font-bold text-[#1b263b] block">
                ${university.tuition_waiver_threshold.toLocaleString()}
              </span>
              <span className="text-[11px] text-[#778da9] mt-1 block">Threshold for full waiver</span>
            </div>
          )}

          {/* Recommendation letters */}
          {university.number_of_recommendation_letters_required !== null && university.number_of_recommendation_letters_required !== undefined && (
            <div className="bg-[#f3f4f0] p-4 rounded-xl border border-[rgba(119,141,169,0.25)] text-center">
              <span className="text-[11px] font-bold text-[#415a77] uppercase tracking-[0.05em] block mb-1">Letters of Rec</span>
              <span className="text-2xl font-serif font-bold text-[#0d1b2a] block">
                {university.number_of_recommendation_letters_required}
              </span>
              <span className="text-[11px] text-[#778da9] mt-1 block">Letters required</span>
            </div>
          )}

          {/* Delivery Mode */}
          {university.program_delivery_mode && (
            <div className="bg-[#f3f4f0] p-4 rounded-xl border border-[rgba(119,141,169,0.25)] text-center">
              <span className="text-[11px] font-bold text-[#415a77] uppercase tracking-[0.05em] block mb-1">Delivery Mode</span>
              <span className="text-lg font-bold text-[#0d1b2a] block capitalize">
                {university.program_delivery_mode}
              </span>
              <span className="text-[11px] text-[#778da9] mt-1 block">Instructional format</span>
            </div>
          )}
        </div>
      </div>

      {/* Majors & Degree Programs / Study Fields */}
      <div className="bg-white border border-[rgba(119,141,169,0.3)] rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-4px_rgba(13,27,42,0.08),0_2px_6px_-1px_rgba(13,27,42,0.04)] mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#415a77]" />
            <h2 className="text-lg font-serif font-bold text-[#0d1b2a]">
              Academics &amp; Fields of Study
            </h2>
          </div>
          {fields.length > 0 && (
            <span className="text-xs font-semibold text-[#415a77]">
              {fields.length} offerings recorded
            </span>
          )}
        </div>

        {Array.isArray(university.programs) && university.programs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[rgba(119,141,169,0.25)] text-[#415a77] font-bold uppercase tracking-[0.05em] text-[11px]">
                  <th className="py-3 px-3">Program Name</th>
                  <th className="py-3 px-3">Degree Level</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Net Tuition (USD)</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Language</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(119,141,169,0.15)]">
                {university.programs.map((prog, idx) => (
                  <tr key={idx} className="hover:bg-[#f3f4f0]/60 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-[#0d1b2a]">{prog.name}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-full bg-[rgba(65,90,119,0.08)] border border-[rgba(119,141,169,0.35)] text-[#0d1b2a] font-semibold text-xs">
                        {prog.degree_level}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[#415a77]">{prog.faculty}</td>
                    <td className="py-3.5 px-3 font-bold text-[#0d1b2a]">
                      ${prog.tuition_per_year_usd?.toLocaleString()}/yr
                    </td>
                    <td className="py-3.5 px-3 text-[#415a77]">{prog.duration_years} Years</td>
                    <td className="py-3.5 px-3 text-[#415a77]">{prog.language}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : fields.length > 0 ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {fields.map((f, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 bg-[rgba(65,90,119,0.08)] border border-[rgba(119,141,169,0.35)] rounded-full text-xs font-semibold text-[#0d1b2a] capitalize"
                >
                  {f}
                </span>
              ))}
            </div>

            {levels.length > 0 && (
              <div className="pt-3 border-t border-[rgba(119,141,169,0.2)] flex items-center gap-2 text-xs text-[#415a77]">
                <GraduationCap className="w-4 h-4 text-[#415a77]" />
                <span className="font-bold uppercase tracking-[0.05em] text-[11px]">Available Education Levels:</span>
                <span className="font-bold text-[#0d1b2a] capitalize">{levels.join(', ')}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-[#778da9] italic">Consult the official admissions portal for specific departmental offerings.</p>
        )}
      </div>

      {/* Two columns: Admissions Criteria & Financial Aid Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Admissions & Language Criteria */}
        <div className="bg-white border border-[rgba(119,141,169,0.3)] rounded-2xl p-6 sm:p-8 space-y-4 shadow-[0_10px_30px_-4px_rgba(13,27,42,0.08),0_2px_6px_-1px_rgba(13,27,42,0.04)]">
          <h3 className="text-base font-serif font-bold text-[#0d1b2a] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#415a77]" />
            <span>Admissions &amp; Testing Policies</span>
          </h3>

          <div className="space-y-3.5 text-xs">
            {/* Need-Blind Policy */}
            {effectiveNeedBlind !== null && effectiveNeedBlind !== undefined && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#f3f4f0] border border-[rgba(119,141,169,0.25)]">
                <span className="font-bold text-[#0d1b2a]">Financial Need Policy:</span>
                <span className={`font-bold px-3 py-1 rounded-full text-xs ${
                  effectiveNeedBlind ? 'bg-[rgba(65,90,119,0.12)] text-[#1b263b] border border-[rgba(119,141,169,0.4)]' : 'bg-white text-[#415a77] border border-[rgba(119,141,169,0.3)]'
                }`}>
                  {effectiveNeedBlind ? 'Need-Blind Admission' : 'Need-Aware Admission'}
                </span>
              </div>
            )}

            {/* SAT / ACT Testing Policy */}
            {effectiveSatRequired !== null && effectiveSatRequired !== undefined && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#f3f4f0] border border-[rgba(119,141,169,0.25)]">
                <span className="font-bold text-[#0d1b2a]">SAT / ACT Exam Requirement:</span>
                <span className={`font-bold px-3 py-1 rounded-full text-xs ${
                  effectiveSatRequired ? 'bg-[rgba(65,90,119,0.15)] text-[#0d1b2a] border border-[rgba(119,141,169,0.4)]' : 'bg-[rgba(65,90,119,0.08)] text-[#1b263b] border border-[rgba(119,141,169,0.35)]'
                }`}>
                  {effectiveSatRequired ? 'Standardized Tests Required' : 'Test-Optional / Not Required'}
                </span>
              </div>
            )}

            {/* Standardized Test Scores */}
            {standardizedTests.length > 0 && (
              <div className="pt-2">
                <span className="font-bold uppercase tracking-[0.05em] text-[11px] text-[#415a77] block mb-1">Standardized Entrance Exams:</span>
                <ul className="list-disc list-inside space-y-1 text-[#415a77]">
                  {standardizedTests.map((test, idx) => (
                    <li key={idx}>{test}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* English Proficiency */}
            {university.english_proficiency_required !== null && university.english_proficiency_required !== undefined && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#f3f4f0] border border-[rgba(119,141,169,0.25)]">
                <span className="font-bold text-[#0d1b2a]">English Proficiency Requirement:</span>
                <span className="font-bold text-[#0d1b2a]">
                  {university.english_proficiency_required ? 'Proficiency Proof Required' : 'Waived / Not Required'}
                </span>
              </div>
            )}

            {/* Accepted English Tests */}
            {englishTests.length > 0 && (
              <div className="pt-2">
                <span className="font-bold uppercase tracking-[0.05em] text-[11px] text-[#415a77] block mb-1">Accepted English Tests:</span>
                <div className="flex flex-wrap gap-1.5">
                  {englishTests.map((t, idx) => (
                    <span key={idx} className="px-3 py-1 bg-[rgba(65,90,119,0.08)] border border-[rgba(119,141,169,0.35)] rounded-full text-[#0d1b2a] font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Application Platforms */}
            {platforms.length > 0 && (
              <div className="pt-2 border-t border-[rgba(119,141,169,0.2)]">
                <span className="font-bold uppercase tracking-[0.05em] text-[11px] text-[#415a77] block mb-1">Accepted Application Platforms:</span>
                <span className="text-[#0d1b2a] font-medium">{platforms.join(', ')}</span>
              </div>
            )}

            {/* Application Process */}
            {university.application_process && (
              <div className="pt-2 border-t border-[rgba(119,141,169,0.2)]">
                <span className="font-bold uppercase tracking-[0.05em] text-[11px] text-[#415a77] block mb-1">Application Process:</span>
                <p className="text-[#0d1b2a] leading-relaxed bg-[#f3f4f0] p-3 rounded-xl border border-[rgba(119,141,169,0.25)]">
                  {university.application_process}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Financial Aid & Institutional Scholarships */}
        <div className="bg-white border border-[rgba(119,141,169,0.3)] rounded-2xl p-6 sm:p-8 space-y-4 shadow-[0_10px_30px_-4px_rgba(13,27,42,0.08),0_2px_6px_-1px_rgba(13,27,42,0.04)]">
          <h3 className="text-base font-serif font-bold text-[#0d1b2a] flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#415a77]" />
            <span>Financial Aid &amp; Cost Transparency</span>
          </h3>

          {university.financial_aid_policy ? (
            <p className="text-xs text-[#0d1b2a] leading-relaxed bg-[#f3f4f0] p-4 rounded-xl border border-[rgba(119,141,169,0.25)]">
              {university.financial_aid_policy}
            </p>
          ) : (
            <p className="text-xs text-[#778da9] italic">No public financial aid statement provided.</p>
          )}

          <div className="p-4 bg-[rgba(65,90,119,0.05)] border border-[rgba(119,141,169,0.35)] rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#415a77] uppercase tracking-[0.05em] text-[11px]">Verified Opportunity:</span>
              <span className="font-bold text-[#1b263b] text-sm">Direct Institutional Record</span>
            </div>
            <p className="text-xs text-[#415a77]">
              Compare institutional tuition discounts and external foundation grants tenable at {name}.
            </p>
            <div className="pt-1">
              <Link
                href={`/scholarships?q=${encodeURIComponent(name)}`}
                className="text-xs font-bold text-[#1b263b] hover:text-[#0d1b2a] hover:underline inline-flex items-center gap-1"
              >
                <span>Find scholarships matching {name} →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Country-Specific National Policies, Visas & Scholarships */}
      {policyGroups.length > 0 && (
        <div className="bg-white border border-[rgba(119,141,169,0.3)] rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-4px_rgba(13,27,42,0.08),0_2px_6px_-1px_rgba(13,27,42,0.04)] mb-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(119,141,169,0.2)]">
            <div>
              <h3 className="text-base font-serif font-bold text-[#0d1b2a] flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#415a77]" />
                <span>
                  National Policies &amp; International Regulations ({university.country_located || 'Host Country'})
                </span>
              </h3>
              <p className="text-xs text-[#415a77] mt-1">
                Government scholarships, student visa sponsorship, accreditation status, and work-study stay-back rights.
              </p>
            </div>
            <span className="hidden sm:inline-flex px-3 py-1 bg-[rgba(65,90,119,0.08)] border border-[rgba(119,141,169,0.35)] text-[#0d1b2a] text-xs font-bold rounded-full">
              Verified Country Framework
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {policyGroups.map((group) => {
              const IconComponent =
                group.id === 'scholarship'
                  ? Sparkles
                  : group.id === 'visa'
                  ? Briefcase
                  : group.id === 'academics'
                  ? Building2
                  : Languages;

              return (
                <div
                  key={group.id}
                  className="p-5 rounded-xl bg-[#f3f4f0] border border-[rgba(119,141,169,0.25)] space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-white border border-[rgba(119,141,169,0.25)] text-[#1b263b]">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#0d1b2a]">{group.title}</h4>
                        <p className="text-[11px] text-[#415a77]">{group.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      {group.items.map((item) => (
                        <div
                          key={item.key}
                          className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-white border border-[rgba(119,141,169,0.25)] text-xs shadow-2xs"
                          title={item.tooltip}
                        >
                          <span className="font-semibold text-[#0d1b2a]">{item.label}</span>
                          <span
                            className={`font-bold text-right text-[11px] px-2 py-0.5 rounded-md ${
                              item.isPositive
                                ? 'bg-[rgba(65,90,119,0.12)] text-[#0d1b2a] border border-[rgba(119,141,169,0.35)]'
                                : 'bg-[#f3f4f0] text-[#778da9] border border-[rgba(119,141,169,0.2)]'
                            }`}
                          >
                            {item.valueDisplay}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Deadlines Timeline */}
      {deadlines.length > 0 && (
        <div className="bg-white border border-[rgba(119,141,169,0.3)] rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-4px_rgba(13,27,42,0.08),0_2px_6px_-1px_rgba(13,27,42,0.04)] mb-8">
          <h3 className="text-base font-serif font-bold text-[#0d1b2a] flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#415a77]" />
            <span>Application Deadlines</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {deadlines.map((dl, idx) => (
              <div key={idx} className="p-4 bg-[#f3f4f0] border border-[rgba(119,141,169,0.25)] rounded-xl text-xs space-y-1">
                <span className="font-bold uppercase tracking-[0.05em] text-[11px] text-[#415a77] block">{dl.type}</span>
                <span className="font-bold text-[#0d1b2a] text-sm block">{dl.date}</span>
                {dl.notes && <p className="text-[11px] text-[#778da9] mt-1">{dl.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verification / Source Footer */}
      {portalUrl && (
        <div className="p-4 rounded-xl bg-[#f3f4f0] border border-[rgba(119,141,169,0.35)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#415a77]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1b263b]" />
            <span>Official institutional profile for {name}</span>
          </div>
          <a
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1b263b] font-bold hover:text-[#0d1b2a] hover:underline inline-flex items-center gap-1"
          >
            <span>Visit Admissions Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}
