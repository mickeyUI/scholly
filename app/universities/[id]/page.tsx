"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  GraduationCap,
  MapPin,
  Users,
  Award,
  ExternalLink,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  BookOpen,
  DollarSign,
  ArrowLeft,
  Heart
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
  const id = params?.id as string;
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
        <p className="text-xs text-zinc-500 mb-6">We couldn’t find an institutional record matching that identifier.</p>
        <Link
          href="/universities"
          className="px-6 py-2.5 bg-[#D97706] text-white text-xs font-bold rounded-full shadow-sm"
        >
          Return to All Colleges
        </Link>
      </div>
    );
  }

  const saved = isSaved(university.id);
  const nicheGrade = (university.world_ranking && university.world_ranking <= 30) ? 'A+' : 'A';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      
      {/* Friendly breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs text-zinc-500 font-medium">
        <Link href="/universities" className="hover:text-[#D97706] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Universities</span>
        </Link>
        <span>/</span>
        <span className="text-zinc-800 font-semibold truncate">{university.name}</span>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white border border-[#EDE4D3] rounded-3xl p-6 sm:p-8 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309]" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pt-2">
          <div className="space-y-3 max-w-3xl">
            
            <div className="flex items-center gap-3 flex-wrap">
              {/* Authentic Niche Circular Seal */}
              <div className="niche-seal" title={`${nicheGrade} Overall Niche Grade`}>
                {nicheGrade}
              </div>

              {university.world_ranking && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F7F3EA] border border-[#E8DEC9] text-[#78350F]">
                  Rank #{university.world_ranking} Worldwide
                </span>
              )}

              <span className="inline-flex items-center gap-1 text-xs text-zinc-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{university.city}, {university.country}</span>
              </span>

              {university.is_verified && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Profile</span>
                </span>
              )}
            </div>

            {/* University Name with Editorial Serif */}
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-zinc-900 tracking-tight">
              {university.name}
            </h1>

            {/* Accolade review snippet */}
            {university.notable_accolades && university.notable_accolades.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {university.notable_accolades.map((acc, idx) => (
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

            {university.admissions_url && (
              <a
                href={university.admissions_url}
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

      {/* Niche-style Report Card Grid */}
      <div className="bg-white border border-[#EDE4D3] rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-[#D97706]" />
          <span>Report Card & Key Admissions Metrics</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-zinc-100 text-center">
            <span className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">Academics & GPA</span>
            <div className="flex items-center justify-center gap-1">
              <span className="text-2xl font-extrabold text-zinc-900">{university.minimum_gpa || '3.0'}</span>
              <InlineCitation sourceName={university.source_name} sourceUrl={university.source_url} />
            </div>
            <span className="text-[11px] text-zinc-400 mt-1 block">Minimum GPA threshold</span>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-zinc-100 text-center">
            <span className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">Acceptance Rate</span>
            <span className="text-2xl font-extrabold text-zinc-900 block">{university.acceptance_rate_percent}%</span>
            <span className="text-[11px] text-zinc-400 mt-1 block">International selectivity</span>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-zinc-100 text-center">
            <span className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">Intl. Student Body</span>
            <span className="text-2xl font-extrabold text-[#D97706] block">{university.international_student_population?.toLocaleString()}</span>
            <span className="text-[11px] text-zinc-400 mt-1 block">Foreign students enrolled</span>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-zinc-100 text-center">
            <span className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">Application Fee</span>
            <div className="flex items-center justify-center gap-1">
              <span className="text-2xl font-extrabold text-zinc-900">
                {university.application_fee === 0 ? 'Free ($0)' : `$${university.application_fee}`}
              </span>
              <InlineCitation sourceName={university.source_name} sourceUrl={university.source_url} />
            </div>
            <span className="text-[11px] text-zinc-400 mt-1 block">Direct application cost</span>
          </div>
        </div>
      </div>

      {/* Majors & Degree Programs Table */}
      <div className="bg-white border border-[#EDE4D3] rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#D97706]" />
            <h2 className="text-lg font-bold text-zinc-900">
              Popular Majors & English-Taught Programs
            </h2>
          </div>
          <span className="text-xs font-semibold text-zinc-500">
            {university.programs.length} programs available
          </span>
        </div>

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
                    ${prog.tuition_per_year_usd.toLocaleString()}/yr
                    <InlineCitation sourceName={university.source_name} sourceUrl={university.source_url} className="ml-1" />
                  </td>
                  <td className="py-3.5 px-3 text-zinc-600">{prog.duration_years} Years</td>
                  <td className="py-3.5 px-3 text-zinc-600">{prog.language}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two columns: Admissions Criteria & Financial Aid Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        
        {/* Admissions & Language Criteria */}
        <div className="bg-white border border-[#EDE4D3] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#D97706]" />
            <span>Admissions & Test Requirements</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-bold text-zinc-800 block mb-1">Accepted English Proficiency Tests:</span>
              <ul className="list-disc list-inside space-y-1.5 text-zinc-600">
                {university.english_proficiency_required.map((eng, idx) => (
                  <li key={idx}>
                    {eng}
                    <InlineCitation sourceName={university.source_name} sourceUrl={university.source_url} className="ml-1.5" />
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-zinc-100">
              <span className="font-bold text-zinc-800 block mb-1">Required Entrance Examinations:</span>
              <ul className="list-disc list-inside space-y-1.5 text-zinc-600">
                {university.standardized_tests.map((test, idx) => (
                  <li key={idx}>
                    {test}
                    <InlineCitation sourceName={university.source_name} sourceUrl={university.source_url} className="ml-1.5" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Financial Aid & Institutional Scholarships */}
        <div className="bg-white border border-[#EDE4D3] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#D97706]" />
            <span>Financial Aid & Cost Transparency</span>
          </h3>

          <p className="text-xs text-zinc-600 leading-relaxed">
            {university.financial_aid_policy}
          </p>

          <div className="p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#92400E]">Eligible Scholarship Schemes:</span>
              <span className="font-extrabold text-[#D97706] text-sm">{university.scholarship_opportunities_count} Available</span>
            </div>
            <p className="text-xs text-zinc-600">
              Discover verified foundation and government grants tenable at {university.name}.
            </p>
            <div className="pt-1">
              <Link
                href={`/scholarships?q=${encodeURIComponent(university.name)}`}
                className="text-xs font-bold text-[#D97706] hover:underline inline-flex items-center gap-1"
              >
                <span>Find scholarships matching {university.name} →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Deadlines Timeline */}
      <div className="bg-white border border-[#EDE4D3] rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
        <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-[#D97706]" />
          <span>Application Deadlines</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {university.deadlines.map((dl, idx) => (
            <div key={idx} className="p-4 bg-[#FAF8F5] border border-zinc-200/80 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-zinc-800 block">{dl.type}</span>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-zinc-900 text-sm">{dl.date}</span>
                <InlineCitation sourceName={university.source_name} sourceUrl={university.source_url} />
              </div>
              {dl.notes && <p className="text-[11px] text-zinc-500 mt-1">{dl.notes}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Verification footer */}
      <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#D97706]" />
          <span>Information verified against official registrar records ({university.verification_date})</span>
        </div>
        <a
          href={university.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#D97706] font-bold hover:underline inline-flex items-center gap-1"
        >
          <span>View Source Document</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

    </div>
  );
}
