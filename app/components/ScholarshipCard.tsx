"use client";

import React from 'react';
import Link from 'next/link';
import { Calendar, Award, ExternalLink, MapPin, Heart } from 'lucide-react';
import { Scholarship } from '../types';
import InlineCitation from './InlineCitation';
import { useSaved } from '../lib/saved-context';

export default function ScholarshipCard({ scholarship, featured = false }: { scholarship: Scholarship; featured?: boolean }) {
  const { isSaved, toggleSaveOpportunity } = useSaved();
  const saved = isSaved(scholarship.id);

  const nextDeadline = scholarship.deadlines && scholarship.deadlines.length > 0
    ? scholarship.deadlines[0]
    : { type: 'Deadline', date: 'Rolling' };

  // Calculate a cozy Niche-style grade for the award
  const grade = scholarship.funding_type === 'Fully Funded' ? 'A+' : 'A';
  const isFullRide = scholarship.funding_type === 'Fully Funded';

  return (
    <div className={`group relative bg-white border rounded-3xl overflow-hidden warm-card-lift flex flex-col justify-between ${featured ? 'border-[#D97706] shadow-sm ring-1 ring-[#D97706]/20' : 'border-[#EDE4D3]'}`}>
      
      {/* Visual Header Thumbnail Band */}
      <div className="relative h-16 w-full bg-gradient-to-r from-[#FDE68A]/40 via-[#FEF3C7] to-[#FDF4E3] border-b border-[#EDE4D3]/70 px-5 flex items-center justify-between">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#92400e_1px,transparent_1px)] [background-size:10px_10px]" />
        
        <div className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-[#EDE4D3] text-zinc-700 text-xs font-semibold shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
          <span>{scholarship.country_located}</span>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={() => toggleSaveOpportunity(scholarship, 'scholarship')}
          title={saved ? 'Remove from saved' : 'Save scholarship'}
          className={`relative p-2 rounded-full transition-all border ${
            saved
              ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A] shadow-xs'
              : 'bg-white/80 hover:bg-white text-zinc-400 hover:text-zinc-700 border-[#EDE4D3]/60'
          }`}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-current text-[#D97706]' : ''}`} />
        </button>

        {featured && (
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#D97706] text-white text-[10px] font-extrabold uppercase rounded-b-md shadow-xs tracking-wider">
            Best Match
          </div>
        )}
      </div>

      <div className="p-6 pt-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Circular Seal & Header Metadata */}
          <div className="flex items-start gap-3.5 mb-3">
            {/* Authentic Circular Niche Seal */}
            <div className="niche-seal" title={`${grade} Funding Grade`}>
              {grade}
            </div>

            <div className="flex-1 min-w-0">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-[#92400E]">
                {scholarship.funding_type}
              </span>
              <p className="text-xs font-medium text-zinc-400 truncate">
                {scholarship.organization}
              </p>
            </div>
          </div>

          {/* Title with Editorial Serif touch */}
          <h3 className="font-serif text-lg font-bold text-zinc-900 group-hover:text-[#D97706] transition-colors line-clamp-2 mb-3 leading-snug">
            <Link href={`/scholarships/${scholarship.id}`}>
              {scholarship.title}
            </Link>
          </h3>

          {/* Cozy Highlight Box with Visual Affordability Meter */}
          <div className="mb-4 p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A]/70 flex items-center justify-between gap-2">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Estimated Coverage
              </span>
              <span className="text-sm font-extrabold text-zinc-900 mt-0.5 block">
                {scholarship.award_details.monthly_stipend || `$${scholarship.annual_coverage_cost?.toLocaleString() || 'Full'} / yr`}
              </span>
            </div>

            {/* Visual 3-segment Affordability Meter */}
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                <span className={`w-2.5 h-2 rounded-xs ${isFullRide ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className={`w-2.5 h-2 rounded-xs ${isFullRide ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className={`w-2.5 h-2 rounded-xs ${isFullRide ? 'bg-emerald-500' : 'bg-zinc-200'}`} />
              </div>
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                {isFullRide ? '100% Full-Ride' : 'Partial Aid'}
              </span>
            </div>
          </div>

          {/* Degrees & Fields with Warm Honey Tags */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-1.5 text-xs text-zinc-600 flex-wrap">
              <span className="font-semibold text-zinc-700">Eligible:</span>
              {scholarship.education_levels.map((lvl) => (
                <span key={lvl} className="px-2 py-0.5 bg-[#F7F3EA] border border-[#E8DEC9] text-[#78350F] rounded-md text-xs font-semibold">
                  {lvl}
                </span>
              ))}
              {scholarship.minimum_gpa && (
                <span className="inline-flex items-center gap-1 ml-auto text-xs text-zinc-600">
                  <span>Min GPA: <strong className="text-zinc-900">{scholarship.minimum_gpa}</strong></span>
                </span>
              )}
            </div>

            <div className="text-xs text-zinc-500 truncate">
              <span className="font-semibold text-zinc-700 mr-1">Fields:</span>
              <span>{scholarship.fields.join(', ')}</span>
            </div>
          </div>

          {/* Deadline & Fee */}
          <div className="flex items-center justify-between py-2.5 border-t border-zinc-100 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-600">
              <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
              <span className="font-medium">{nextDeadline.type}:</span>
              <span className="font-bold text-zinc-900">{nextDeadline.date}</span>
            </div>

            {scholarship.application_fee === 0 ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                $0 App Fee
              </span>
            ) : (
              <span className="text-xs text-zinc-500 font-medium">
                Fee: ${scholarship.application_fee}
              </span>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
          <Link
            href={`/scholarships/${scholarship.id}`}
            className="text-xs font-bold text-[#D97706] hover:text-[#B45309] transition-colors"
          >
            Check Eligibility &amp; Steps
          </Link>

          {scholarship.application_url && (
            <a
              href={scholarship.application_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-zinc-400 hover:text-zinc-700 transition-colors"
              title="Open official portal"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
