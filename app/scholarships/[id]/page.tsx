"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Award,
  Globe,
  DollarSign,
  ExternalLink,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  FileText,
  Clock,
  ArrowLeft,
  Heart
} from 'lucide-react';
import { Scholarship } from '../../types';
import { getScholarshipById } from '../../lib/opportunities';
import InlineCitation from '../../components/InlineCitation';
import { useSaved } from '../../lib/saved-context';

export default function ScholarshipDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center py-28">
          <div className="w-8 h-8 border-3 border-[#D97706] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ScholarshipDetailContent />
    </Suspense>
  );
}

function ScholarshipDetailContent() {
  const params = useParams();
  const id = params?.id as string;
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { isSaved, toggleSaveOpportunity } = useSaved();

  useEffect(() => {
    if (id) {
      getScholarshipById(id).then((data) => {
        setScholarship(data);
        setIsLoading(false);
      });
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-28">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#D97706] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-zinc-500">Loading scholarship details...</p>
        </div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Scholarship Not Found</h2>
        <p className="text-xs text-zinc-500 mb-6">The requested scholarship program could not be located in our verified directory.</p>
        <Link
          href="/scholarships"
          className="px-6 py-2.5 bg-[#D97706] text-white text-xs font-bold rounded-full shadow-sm"
        >
          Return to All Scholarships
        </Link>
      </div>
    );
  }

  const saved = isSaved(scholarship.id);
  const grade = scholarship.funding_type === 'Fully Funded' ? 'A+' : 'A';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      
      {/* Friendly Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs text-zinc-500 font-medium">
        <Link href="/scholarships" className="hover:text-[#D97706] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Scholarships</span>
        </Link>
        <span>/</span>
        <span className="text-zinc-800 font-semibold truncate">{scholarship.title}</span>
      </div>

      {/* Main Header Card */}
      <div className="bg-white border border-[#EDE4D3] rounded-3xl p-6 sm:p-8 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309]" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pt-2">
          <div className="space-y-3 max-w-3xl">
            
            <div className="flex items-center gap-3 flex-wrap">
              {/* Authentic Niche Circular Seal */}
              <div className="niche-seal" title={`${grade} Funding Grade`}>
                {grade}
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F7F3EA] border border-[#E8DEC9] text-[#78350F]">
                {scholarship.funding_type}
              </span>

              <span className="inline-flex items-center gap-1 text-xs text-zinc-600 font-medium">
                <Globe className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{scholarship.country_located}</span>
              </span>

              {scholarship.is_verified && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Award</span>
                </span>
              )}
            </div>

            {/* Title with Editorial Serif */}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
              {scholarship.title}
            </h1>

            {/* Provider */}
            <p className="text-xs sm:text-sm text-zinc-500 font-medium">
              Administered by: <strong className="text-zinc-800">{scholarship.organization}</strong>
            </p>

            {/* Accolades */}
            {scholarship.notable_accolades && scholarship.notable_accolades.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {scholarship.notable_accolades.map((acc, idx) => (
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
              onClick={() => toggleSaveOpportunity(scholarship, 'scholarship')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                saved
                  ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A] shadow-xs'
                  : 'bg-[#FAF8F5] hover:bg-zinc-100 text-zinc-800 border-zinc-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-current text-[#D97706]' : ''}`} />
              <span>{saved ? 'Saved to My List' : 'Add to My List'}</span>
            </button>

            {scholarship.application_url && (
              <a
                href={scholarship.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold rounded-full flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Award & Financial Coverage Grid */}
      <div className="bg-white border border-[#EDE4D3] rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-[#D97706]" />
          <span>Award Breakdown & Funding Coverage</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-zinc-100">
            <span className="text-[11px] font-bold uppercase text-zinc-500 block">Tuition Coverage</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-sm font-extrabold text-emerald-800">
                {scholarship.award_details.tuition_covered ? '100% Fully Waived' : 'Partial Assistance'}
              </span>
              <InlineCitation sourceName={scholarship.source_name} sourceUrl={scholarship.source_url} />
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">Paid directly to host university</p>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-zinc-100">
            <span className="text-[11px] font-bold uppercase text-zinc-500 block">Monthly Stipend</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-sm font-extrabold text-zinc-900">
                {scholarship.award_details.monthly_stipend || 'Provided'}
              </span>
              <InlineCitation sourceName={scholarship.source_name} sourceUrl={scholarship.source_url} />
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">Direct monthly living allowance</p>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-zinc-100">
            <span className="text-[11px] font-bold uppercase text-zinc-500 block">Airfare & Travel</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-sm font-extrabold text-zinc-900">
                {scholarship.award_details.travel_covered ? 'Round-Trip Flight' : 'Self-funded'}
              </span>
              <InlineCitation sourceName={scholarship.source_name} sourceUrl={scholarship.source_url} />
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">Home country to destination</p>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-zinc-100">
            <span className="text-[11px] font-bold uppercase text-zinc-500 block">Health Insurance</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-sm font-extrabold text-zinc-900">
                {scholarship.award_details.health_insurance ? 'Full Coverage' : 'Excluded'}
              </span>
              <InlineCitation sourceName={scholarship.source_name} sourceUrl={scholarship.source_url} />
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">Mandatory student health scheme</p>
          </div>
        </div>

        {scholarship.award_details.additional_allowances && (
          <div className="mt-4 pt-4 border-t border-zinc-100 text-xs text-zinc-700 flex items-start gap-2">
            <span className="font-bold text-zinc-900 flex-shrink-0">Additional Allowances:</span>
            <span>{scholarship.award_details.additional_allowances}</span>
          </div>
        )}
      </div>

      {/* Two columns: Eligibility & Document Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        
        {/* Eligibility Criteria */}
        <div className="bg-white border border-[#EDE4D3] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#D97706]" />
            <span>Eligibility Requirements</span>
          </h3>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="font-bold text-zinc-800 block mb-1">Eligible Nationalities:</span>
              <div className="flex flex-wrap gap-1.5">
                {scholarship.eligible_countries.map((c, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] border border-zinc-200 text-zinc-700 font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-zinc-800 block mb-1">Degree Levels Supported:</span>
              <div className="flex flex-wrap gap-1.5">
                {scholarship.education_levels.map((lvl) => (
                  <span key={lvl} className="px-2.5 py-0.5 rounded-md bg-[#FEF3C7] text-[#92400E] font-bold">
                    {lvl}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-zinc-800 block mb-1">Eligible Fields of Study:</span>
              <p className="text-zinc-600 leading-relaxed">
                {scholarship.fields.join(', ')}
              </p>
            </div>

            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
              <span className="font-bold text-zinc-800">Minimum Academic GPA:</span>
              <div className="flex items-center gap-1 font-extrabold text-zinc-900">
                <span>{scholarship.minimum_gpa ? `${scholarship.minimum_gpa} / 4.0` : 'None specified'}</span>
                <InlineCitation sourceName={scholarship.source_name} sourceUrl={scholarship.source_url} />
              </div>
            </div>

            {scholarship.max_age && (
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-800">Age Restriction:</span>
                <span className="font-bold text-zinc-900">Under {scholarship.max_age} years old</span>
              </div>
            )}

            <div>
              <span className="font-bold text-zinc-800 block mb-1">Language Requirements & Waivers:</span>
              <ul className="list-disc list-inside space-y-1 text-zinc-600">
                {scholarship.english_proficiency_required.map((req, idx) => (
                  <li key={idx}>
                    {req}
                    <InlineCitation sourceName={scholarship.source_name} sourceUrl={scholarship.source_url} className="ml-1.5" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Required Documents Checklist */}
        <div className="bg-white border border-[#EDE4D3] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#D97706]" />
            <span>Required Application Dossier</span>
          </h3>

          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-zinc-200 flex items-center justify-between">
              <span className="font-bold text-zinc-800">Letters of Recommendation:</span>
              <span className="font-extrabold text-[#D97706] text-sm">
                {scholarship.number_of_recommendation_letters_required || '2'} Letters Required
              </span>
            </div>

            {scholarship.essays_required && (
              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-zinc-200">
                <span className="font-bold text-zinc-800 block mb-1">Required Essays / Statements:</span>
                <p className="text-zinc-600">{scholarship.essays_required}</p>
              </div>
            )}

            <div>
              <span className="font-bold text-zinc-800 block mb-1.5">Document Checklist:</span>
              <ul className="space-y-1.5">
                {scholarship.required_documents.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-zinc-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Application Timeline & Procedure */}
      <div className="bg-white border border-[#EDE4D3] rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
        <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-[#D97706]" />
          <span>Application Timelines & Steps</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {scholarship.deadlines.map((dl, idx) => (
            <div key={idx} className="p-4 bg-[#FAF8F5] border border-zinc-200 rounded-2xl text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-800">{dl.type}</span>
                <InlineCitation sourceName={scholarship.source_name} sourceUrl={scholarship.source_url} />
              </div>
              <div className="font-extrabold text-base text-zinc-900">{dl.date}</div>
              {dl.notes && <p className="text-[11px] text-zinc-500 mt-1">{dl.notes}</p>}
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-xs space-y-2">
          <span className="font-bold text-[#92400E] block">How to Submit:</span>
          <p className="text-zinc-700 leading-relaxed">
            {scholarship.application_process}
          </p>
          {scholarship.application_url && (
            <div className="pt-2">
              <a
                href={scholarship.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97706] hover:underline"
              >
                <span>Go to {scholarship.organization} portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Verification footer */}
      <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#D97706]" />
          <span>Verified directly against {scholarship.source_name} ({scholarship.verification_date})</span>
        </div>
        <a
          href={scholarship.source_url}
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
