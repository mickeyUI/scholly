"use client";

import React from 'react';
import Link from 'next/link';
import { MapPin, Users, Award, ExternalLink, Heart } from 'lucide-react';
import { University } from '../types';
import InlineCitation from './InlineCitation';
import { useSaved } from '../lib/saved-context';

export default function UniversityCard({ university, featured = false }: { university: University; featured?: boolean }) {
  const { isSaved, toggleSaveOpportunity } = useSaved();
  const saved = isSaved(university.id);

  const primaryTuitionNumber = university.programs && university.programs.length > 0
    ? university.programs[0].tuition_per_year_usd
    : null;

  const primaryTuition = primaryTuitionNumber !== null
    ? `$${primaryTuitionNumber.toLocaleString()}/yr`
    : 'Tuition varies';

  // Cost meter segments (Low: <= $7,500, Moderate: <= $20,000, High: > $20,000)
  const isLowTuition = primaryTuitionNumber !== null && primaryTuitionNumber <= 7500;
  const isModerateTuition = primaryTuitionNumber !== null && primaryTuitionNumber > 7500 && primaryTuitionNumber <= 25000;

  const nicheGrade = (university.world_ranking && university.world_ranking <= 30) ? 'A+' : 'A';

  return (
    <div className={`group relative bg-white border rounded-3xl overflow-hidden warm-card-lift flex flex-col justify-between ${featured ? 'border-[#D97706] shadow-sm ring-1 ring-[#D97706]/20' : 'border-[#EDE4D3]'}`}>
      
      {/* Visual Header Thumbnail Band */}
      <div className="relative h-16 w-full bg-gradient-to-r from-[#FEF3C7] via-[#FFFBEB] to-[#FDE68A]/50 border-b border-[#EDE4D3]/70 px-5 flex items-center justify-between">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#92400e_1px,transparent_1px)] [background-size:10px_10px]" />

        <div className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-[#EDE4D3] text-zinc-700 text-xs font-semibold shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
          <span>{university.city}, {university.country}</span>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={() => toggleSaveOpportunity(university, 'university')}
          title={saved ? 'Remove from saved' : 'Save university'}
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
            <div className="niche-seal" title={`${nicheGrade} Overall Niche Grade`}>
              {nicheGrade}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-[#92400E]">
                  Overall Grade
                </span>
                {university.world_ranking && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#F7F3EA] border border-[#E8DEC9] text-[#78350F]">
                    Rank #{university.world_ranking}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-zinc-400 truncate">
                {university.university_type}
              </p>
            </div>
          </div>

          {/* University Name with Editorial Serif touch */}
          <h3 className="font-serif text-lg font-bold text-zinc-900 group-hover:text-[#D97706] transition-colors mb-2 leading-snug">
            <Link href={`/universities/${university.id}`}>
              {university.name}
            </Link>
          </h3>

          {/* Accolade review snippet */}
          {university.notable_accolades && university.notable_accolades.length > 0 && (
            <p className="text-xs text-zinc-600 mb-3 bg-[#FAF8F5] p-2.5 rounded-xl border border-zinc-100 italic">
              "{university.notable_accolades[0]}"
            </p>
          )}

          {/* Key Metrics grid with Visual Affordability Indicator */}
          <div className="grid grid-cols-2 gap-2 mb-4 p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A]/70 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">Est. Net Tuition</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-extrabold text-zinc-900">{primaryTuition}</span>
              </div>
              {primaryTuitionNumber !== null && (
                <div className="flex items-center gap-1 mt-1">
                  <span className={`w-2 h-1.5 rounded-xs ${isLowTuition || isModerateTuition ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className={`w-2 h-1.5 rounded-xs ${isModerateTuition ? 'bg-amber-500' : isLowTuition ? 'bg-emerald-500' : 'bg-zinc-200'}`} />
                  <span className={`w-2 h-1.5 rounded-xs ${isLowTuition ? 'bg-emerald-500' : 'bg-zinc-200'}`} />
                  <span className="text-[9px] font-semibold text-zinc-500 ml-0.5">
                    {isLowTuition ? 'Low Tuition' : isModerateTuition ? 'Moderate' : 'Standard'}
                  </span>
                </div>
              )}
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">Intl. Students</span>
              <div className="flex items-center gap-1 mt-1">
                <Users className="w-3.5 h-3.5 text-[#D97706]" />
                <span className="font-extrabold text-zinc-800">
                  {university.international_student_population?.toLocaleString() || 'Global'}
                </span>
              </div>
            </div>
          </div>

          {/* Programs Preview with Warm Linen Tags */}
          <div className="space-y-1.5 mb-4">
            <span className="text-xs font-semibold text-zinc-700 block">Popular Majors:</span>
            <div className="flex flex-wrap gap-1.5">
              {university.programs.slice(0, 3).map((prog, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-[#F7F3EA] border border-[#E8DEC9] rounded-lg text-xs font-medium text-[#78350F]">
                  {prog.name}
                </span>
              ))}
              {university.programs.length > 3 && (
                <span className="px-2 py-1 text-xs text-zinc-400 font-medium">
                  +{university.programs.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Bottom Specs */}
          <div className="flex items-center justify-between text-xs py-2.5 border-t border-zinc-100">
            <div className="flex items-center gap-1 text-zinc-600">
              <span>Min GPA: <strong className="text-zinc-900">{university.minimum_gpa || '3.0'}</strong></span>
            </div>

            <div className="flex items-center gap-1 text-[#92400E] font-bold text-xs bg-[#FEF3C7] px-2.5 py-0.5 rounded-full border border-[#FDE68A]">
              <Award className="w-3 h-3 text-[#D97706]" />
              <span>{university.scholarship_opportunities_count} Scholarships</span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
          <Link
            href={`/universities/${university.id}`}
            className="text-xs font-bold text-[#D97706] hover:text-[#B45309] transition-colors"
          >
            See Programs &amp; Admissions
          </Link>

          {university.website_url && (
            <a
              href={university.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-zinc-400 hover:text-zinc-700 transition-colors"
              title="Visit university official website"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
