"use client";

import React from 'react';
import Link from 'next/link';
import { Calendar, Award, ExternalLink, MapPin, Heart, ShieldCheck } from 'lucide-react';
import { Scholarship } from '../types';
import InlineCitation from './InlineCitation';
import { useSaved } from '../lib/saved-context';

export default function ScholarshipCard({ scholarship, featured = false }: { scholarship: Scholarship; featured?: boolean }) {
  const { isSaved, toggleSaveOpportunity } = useSaved();
  const saved = isSaved(scholarship.id);

  const nextDeadline = scholarship.deadlines && scholarship.deadlines.length > 0
    ? scholarship.deadlines[0]
    : { type: 'Deadline', date: 'Rolling' };

  const grade = scholarship.funding_type === 'Fully Funded' ? 'A+' : 'A';
  const isFullRide = scholarship.funding_type === 'Fully Funded';

  return (
    <div
      className={`group relative bg-white border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 shadow-[0_10px_30px_-4px_rgba(13,27,42,0.08),0_2px_6px_-1px_rgba(13,27,42,0.04)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-6px_rgba(13,27,42,0.12),0_4px_10px_-2px_rgba(13,27,42,0.06)] ${
        featured
          ? 'border-[#1b263b] ring-1 ring-[#1b263b]/30'
          : 'border-[rgba(119,141,169,0.3)] hover:border-[rgba(65,90,119,0.5)]'
      }`}
    >
      {/* Visual Header Thumbnail Band */}
      <div className="relative h-14 w-full bg-gradient-to-r from-[#f3f4f0] via-[#ffffff] to-[rgba(224,225,221,0.4)] border-b border-[rgba(119,141,169,0.25)] px-4 flex items-center justify-between">
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#415a77_1px,transparent_1px)] [background-size:12px_12px]" />
        
        <div className="relative flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[rgba(65,90,119,0.08)] border border-[rgba(119,141,169,0.35)] text-[#0d1b2a] text-xs font-semibold shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-[#415a77]" />
          <span>{scholarship.country_located}</span>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={() => toggleSaveOpportunity(scholarship, 'scholarship')}
          title={saved ? 'Remove from saved' : 'Save scholarship'}
          className={`relative p-1.5 rounded-full transition-all border ${
            saved
              ? 'bg-[#1b263b] text-white border-[#1b263b] shadow-xs'
              : 'bg-white/90 hover:bg-white text-[#778da9] hover:text-[#0d1b2a] border-[rgba(119,141,169,0.3)]'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-current text-white' : ''}`} />
        </button>

        {featured && (
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#1b263b] text-white text-[10px] font-bold uppercase tracking-wider rounded-b-md shadow-xs">
            Best Match
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Circular Seal & Header Metadata */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#1b263b] text-white font-serif font-bold text-sm flex items-center justify-center border-2 border-[rgba(119,141,169,0.25)] shadow-xs flex-shrink-0" title={`${grade} Funding Grade`}>
              {grade}
            </div>

            <div className="flex-1 min-w-0">
              <span className="block text-[11px] uppercase font-bold tracking-[0.05em] text-[#415a77]">
                {scholarship.funding_type}
              </span>
              <p className="text-xs font-medium text-[#778da9] truncate">
                {scholarship.organization}
              </p>
            </div>
          </div>

          {/* Title with Classical Serif */}
          <h3 className="font-serif text-lg font-bold text-[#0d1b2a] group-hover:text-[#1b263b] transition-colors line-clamp-2 mb-3 leading-snug">
            <Link href={`/scholarships/${scholarship.id}`}>
              {scholarship.title}
            </Link>
          </h3>

          {/* Coverage Box */}
          <div className="mb-4 p-3 rounded-xl bg-[#f3f4f0] border border-[rgba(119,141,169,0.3)] flex items-center justify-between gap-2">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-[0.05em] text-[#415a77]">
                Estimated Coverage
              </span>
              <span className="text-sm font-bold text-[#0d1b2a] mt-0.5 block">
                {scholarship.award_details.monthly_stipend || `$${scholarship.annual_coverage_cost?.toLocaleString() || 'Full'} / yr`}
              </span>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-[11px] font-bold text-[#1b263b] bg-[rgba(65,90,119,0.08)] px-2.5 py-0.5 rounded-full border border-[rgba(119,141,169,0.35)]">
                {isFullRide ? '100% Full-Ride' : 'Partial Aid'}
              </span>
            </div>
          </div>

          {/* Deadline preview */}
          <div className="flex items-center gap-1.5 text-xs text-[#415a77]">
            <Calendar className="w-3.5 h-3.5 text-[#415a77]" />
            <span className="font-medium">
              {nextDeadline.type}: {nextDeadline.date}
            </span>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-3 border-t border-[rgba(119,141,169,0.2)] flex items-center justify-between">
          <Link
            href={`/scholarships/${scholarship.id}`}
            className="text-xs font-bold text-[#1b263b] hover:text-[#0d1b2a] transition-colors inline-flex items-center gap-1"
          >
            <span>View Award Details</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
