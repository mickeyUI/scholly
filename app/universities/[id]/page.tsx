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
  FileText
} from 'lucide-react';
import { University } from '../../types';
import { getUniversityById } from '../../lib/opportunities';
import InlineCitation from '../../components/InlineCitation';
import { useSaved } from '../../lib/saved-context';

export default function UniversityDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center py-28">
          <div className="w-8 h-8 border-3 border-[#D97706] border-t-transparent rounded-full animate-spin" />
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
          <div className="w-8 h-8 border-3 border-[#D97706] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-zinc-500">Loading university profile...</p>
        </div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">University Not Found</h2>
        <p className="text-xs text-zinc-500 mb-6">We couldn't find an institutional record matching that identifier.</p>
        <Link
          href="/universities"
          className="px-6 py-2.5 bg-[#D97706] text-white text-xs font-bold rounded-full shadow-sm"
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

  const sealLetter = name.charAt(0).toUpperCase() || 'A';
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
      {/* Friendly breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs text-zinc-500 font-medium">
        <Link href="/universities" className="hover:text-[#D97706] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Universities</span>
        </Link>
        <span>/</span>
        <span className="text-zinc-800 font-semibold truncate">{name}</span>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white border border-[#EDE4D3] rounded-3xl p-6 sm:p-8 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309]" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pt-2">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Niche Circular Seal */}
              <div className="niche-seal" title={`${name} Seal`}>
                {sealLetter}
              </div>

              {university.university_type && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F7F3EA] border border-[#E8DEC9] text-[#78350F] capitalize">
                  {university.university_type}
                </span>
              )}

              {university.funding_type && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E]">
                  {university.funding_type}
                </span>
              )}

              {locationString && (
                <span className="inline-flex items-center gap-1 text-xs text-zinc-600 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>{locationString}</span>
                </span>
              )}
            </div>

            {/* University Name with Editorial Serif */}
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-zinc-900 tracking-tight">
              {name}
            </h1>

            {/* Accolade review snippet */}
            {accolades.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {accolades.map((acc, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs text-[#92400E] bg-[#FEF3C7] border border-[#FDE68A] px-3 py-1 rounded-full font-medium"
                  >
                    <Award className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>{acc}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-row md:flex-col gap-2.5 flex-shrink-0">
            <button
              onClick={() => toggleSaveOpportunity(university, 'university')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                saved
                  ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A] shadow-xs'
                  : 'bg-[#FAF8F5] hover:bg-zinc-100 text-zinc-800 border-zinc-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-current text-[#D97706]' : ''}`} />
              <span>{saved ? 'Saved to My List' : 'Add to My List'}</span>
            </button>

            {portalUrl && (
              <a
                href={portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold rounded-full flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <span>Admissions Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Report Card & Admissions Metrics Grid */}
      <div className="bg-white border border-[#EDE4D3] rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-[#D97706]" />
          <span>Institutional Metrics &amp; Admissions Requirements</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Minimum GPA - ONLY if not null */}
          {university.minimum_gpa !== null && university.minimum_gpa !== undefined && (
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-zinc-100 text-center">
              <span className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">Academics &amp; GPA</span>
              <span className="text-2xl font-extrabold text-zinc-900 block">{university.minimum_gpa}</span>
              <span className="text-[11px] text-zinc-400 mt-1 block">Minimum GPA requirement</span>
            </div>
          )}

          {/* Application Fee - ONLY if not null */}
          {university.application_fee !== null && university.application_fee !== undefined && (
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-zinc-100 text-center">
              <span className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">Application Fee</span>
              <span className="text-lg sm:text-xl font-extrabold text-zinc-900 block truncate" title={String(university.application_fee)}>
                {university.application_fee}
              </span>
              <span className="text-[11px] text-zinc-400 mt-1 block">Institutional filing fee</span>
            </div>
          )}

          {/* Annual Tuition Coverage - ONLY if not null */}
          {university.annual_tuitioin_coveratge_cost !== null && university.annual_tuitioin_coveratge_cost !== undefined && university.annual_tuitioin_coveratge_cost > 0 && (
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-zinc-100 text-center">
              <span className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">Tuition Coverage</span>
              <span className="text-2xl font-extrabold text-[#D97706] block">
                ${university.annual_tuitioin_coveratge_cost.toLocaleString()}
              </span>
              <span className="text-[11px] text-zinc-400 mt-1 block">Estimated institutional aid</span>
            </div>
          )}

          {/* Tuition Waiver Threshold - ONLY if not null */}
          {university.tuition_waiver_threshold !== null && university.tuition_waiver_threshold !== undefined && university.tuition_waiver_threshold > 0 && (
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-zinc-100 text-center">
              <span className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">Waiver Cap</span>
              <span className="text-2xl font-extrabold text-[#D97706] block">
                ${university.tuition_waiver_threshold.toLocaleString()}
              </span>
              <span className="text-[11px] text-zinc-400 mt-1 block">Threshold for full waiver</span>
            </div>
          )}

          {/* Recommendation letters - ONLY if not null */}
          {university.number_of_recommendation_letters_required !== null && university.number_of_recommendation_letters_required !== undefined && (
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-zinc-100 text-center">
              <span className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">Letters of Rec</span>
              <span className="text-2xl font-extrabold text-zinc-900 block">
                {university.number_of_recommendation_letters_required}
              </span>
              <span className="text-[11px] text-zinc-400 mt-1 block">Recommendation letters required</span>
            </div>
          )}

          {/* Delivery Mode - ONLY if not null */}
          {university.program_delivery_mode && (
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-zinc-100 text-center">
              <span className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">Delivery Mode</span>
              <span className="text-lg font-extrabold text-zinc-900 block capitalize">
                {university.program_delivery_mode}
              </span>
              <span className="text-[11px] text-zinc-400 mt-1 block">Campus instructional format</span>
            </div>
          )}
        </div>
      </div>

      {/* Majors & Degree Programs / Study Fields */}
      <div className="bg-white border border-[#EDE4D3] rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#D97706]" />
            <h2 className="text-lg font-bold text-zinc-900">
              Academics &amp; Fields of Study
            </h2>
          </div>
          {fields.length > 0 && (
            <span className="text-xs font-semibold text-zinc-500">
              {fields.length} offerings recorded
            </span>
          )}
        </div>

        {/* If university has explicit programs table */}
        {Array.isArray(university.programs) && university.programs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Program Name</th>
                  <th className="py-3 px-3">Degree Level</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Net Tuition (USD)</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Language</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {university.programs.map((prog, idx) => (
                  <tr key={idx} className="hover:bg-[#FFFBEB]/50 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-zinc-900">{prog.name}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-zinc-200 text-zinc-700 font-semibold text-xs">
                        {prog.degree_level}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-zinc-600">{prog.faculty}</td>
                    <td className="py-3.5 px-3 font-bold text-zinc-900">
                      ${prog.tuition_per_year_usd?.toLocaleString()}/yr
                    </td>
                    <td className="py-3.5 px-3 text-zinc-600">{prog.duration_years} Years</td>
                    <td className="py-3.5 px-3 text-zinc-600">{prog.language}</td>
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
                  className="px-3.5 py-1.5 bg-[#F7F3EA] border border-[#E8DEC9] rounded-xl text-xs font-semibold text-[#78350F] capitalize"
                >
                  {f}
                </span>
              ))}
            </div>

            {levels.length > 0 && (
              <div className="pt-3 border-t border-zinc-100 flex items-center gap-2 text-xs text-zinc-600">
                <GraduationCap className="w-4 h-4 text-[#D97706]" />
                <span>Available Education Levels:</span>
                <span className="font-bold text-zinc-900 capitalize">{levels.join(', ')}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-zinc-500 italic">Consult the official admissions portal for specific departmental offerings.</p>
        )}
      </div>

      {/* Two columns: Admissions Criteria & Financial Aid Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Admissions & Language Criteria */}
        <div className="bg-white border border-[#EDE4D3] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#D97706]" />
            <span>Admissions &amp; Testing Policies</span>
          </h3>

          <div className="space-y-3.5 text-xs">
            {/* Need-Blind Policy */}
            {university.need_blind !== null && university.need_blind !== undefined && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-zinc-100">
                <span className="font-bold text-zinc-800">Financial Need Policy:</span>
                <span className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${
                  university.need_blind ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-zinc-100 text-zinc-700'
                }`}>
                  {university.need_blind ? 'Need-Blind Admission' : 'Need-Aware Admission'}
                </span>
              </div>
            )}

            {/* SAT / ACT Testing Policy */}
            {university.sat_required !== null && university.sat_required !== undefined && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-zinc-100">
                <span className="font-bold text-zinc-800">SAT / ACT Exam Requirement:</span>
                <span className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${
                  university.sat_required ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  {university.sat_required ? 'Standardized Tests Required' : 'Test-Optional / Not Required'}
                </span>
              </div>
            )}

            {/* Standardized Test Scores */}
            {standardizedTests.length > 0 && (
              <div className="pt-2">
                <span className="font-bold text-zinc-800 block mb-1">Standardized Entrance Exams:</span>
                <ul className="list-disc list-inside space-y-1 text-zinc-600">
                  {standardizedTests.map((test, idx) => (
                    <li key={idx}>{test}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* English Proficiency */}
            {university.english_proficiency_required !== null && university.english_proficiency_required !== undefined && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-zinc-100">
                <span className="font-bold text-zinc-800">English Proficiency Requirement:</span>
                <span className="font-bold text-zinc-900">
                  {university.english_proficiency_required ? 'Proficiency Proof Required' : 'Waived / Not Required'}
                </span>
              </div>
            )}

            {/* Accepted English Tests */}
            {englishTests.length > 0 && (
              <div className="pt-2">
                <span className="font-bold text-zinc-800 block mb-1">Accepted English Tests:</span>
                <div className="flex flex-wrap gap-1.5">
                  {englishTests.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-[#FAF8F5] border border-zinc-200 rounded-lg text-zinc-700 font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Application Platforms */}
            {platforms.length > 0 && (
              <div className="pt-2 border-t border-zinc-100">
                <span className="font-bold text-zinc-800 block mb-1">Accepted Application Platforms:</span>
                <span className="text-zinc-700 font-medium">{platforms.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Financial Aid & Institutional Scholarships */}
        <div className="bg-white border border-[#EDE4D3] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#D97706]" />
            <span>Financial Aid &amp; Cost Transparency</span>
          </h3>

          {university.financial_aid_policy ? (
            <p className="text-xs text-zinc-600 leading-relaxed bg-[#FFFBEB]/40 p-4 rounded-2xl border border-[#FDE68A]/60">
              {university.financial_aid_policy}
            </p>
          ) : (
            <p className="text-xs text-zinc-500 italic">No public financial aid statement provided.</p>
          )}

          <div className="p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#92400E]">Verified Opportunity:</span>
              <span className="font-extrabold text-[#D97706] text-sm">Direct Institutional Record</span>
            </div>
            <p className="text-xs text-zinc-600">
              Compare institutional tuition discounts and external foundation grants tenable at {name}.
            </p>
            <div className="pt-1">
              <Link
                href={`/scholarships?q=${encodeURIComponent(name)}`}
                className="text-xs font-bold text-[#D97706] hover:underline inline-flex items-center gap-1"
              >
                <span>Find scholarships matching {name} →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Deadlines Timeline - ONLY if deadlines exist */}
      {deadlines.length > 0 && (
        <div className="bg-white border border-[#EDE4D3] rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#D97706]" />
            <span>Application Deadlines</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {deadlines.map((dl, idx) => (
              <div key={idx} className="p-4 bg-[#FAF8F5] border border-zinc-200/80 rounded-2xl text-xs space-y-1">
                <span className="font-bold text-zinc-800 block">{dl.type}</span>
                <span className="font-extrabold text-zinc-900 text-sm block">{dl.date}</span>
                {dl.notes && <p className="text-[11px] text-zinc-500 mt-1">{dl.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verification / Source Footer */}
      {portalUrl && (
        <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D97706]" />
            <span>Official institutional profile for {name}</span>
          </div>
          <a
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D97706] font-bold hover:underline inline-flex items-center gap-1"
          >
            <span>Visit Admissions Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}
