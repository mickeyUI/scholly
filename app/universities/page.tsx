"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GraduationCap, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { University } from '../types';
import { getUniversities } from '../lib/opportunities';
import UniversityCard from '../components/UniversityCard';
import FilterSidebar from '../components/FilterSidebar';

export default function UniversitiesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-zinc-500">Loading university discovery...</p>
        </div>
      }
    >
      <UniversitiesContent />
    </Suspense>
  );
}

function UniversitiesContent() {
  const searchParams = useSearchParams();
  const initialCountry = searchParams.get('country') || '';
  const initialQuery = searchParams.get('q') || '';

  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [selectedDegree, setSelectedDegree] = useState('');
  const [minGpa, setMinGpa] = useState<number | ''>('');
  
  // New University-specific filters
  const [selectedNeedBlind, setSelectedNeedBlind] = useState<'all' | 'need-blind' | 'need-aware' | ''>('');
  const [selectedSatRequired, setSelectedSatRequired] = useState<'all' | 'test-optional' | 'sat-required' | ''>('');
  const [selectedDeadlineType, setSelectedDeadlineType] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');

  const [sortBy, setSortBy] = useState<'name' | 'aid' | 'gpa'>('name');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    getUniversities().then((data) => {
      setUniversities(data);
      setIsLoading(false);
    });
  }, []);

  const filteredUniversities = useMemo(() => {
    return universities
      .filter((uni) => {
        const uniName = (uni.organization || uni.name || '').toLowerCase();
        const uniCountry = (uni.country_located || uni.country || '').toLowerCase();
        const uniCampuses = Array.isArray(uni.campus_locations)
          ? uni.campus_locations.join(' ').toLowerCase()
          : '';
        const uniFields = Array.isArray(uni.fields)
          ? uni.fields.join(' ').toLowerCase()
          : '';
        const uniLevels = Array.isArray(uni.education_levels)
          ? uni.education_levels.join(' ').toLowerCase()
          : '';

        // Keyword match
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchesName = uniName.includes(query);
          const matchesCountry = uniCountry.includes(query);
          const matchesCampus = uniCampuses.includes(query);
          const matchesFields = uniFields.includes(query);
          const matchesLevels = uniLevels.includes(query);

          if (!matchesName && !matchesCountry && !matchesCampus && !matchesFields && !matchesLevels) {
            return false;
          }
        }

        // Country filter
        if (selectedCountry) {
          if (!uniCountry.includes(selectedCountry.toLowerCase())) {
            return false;
          }
        }

        // Degree filter (maps to education_levels: undergraduate/bachelor, graduate/master, doctoral/phd)
        if (selectedDegree) {
          const targetDeg = selectedDegree.toLowerCase();
          const hasLevel =
            Array.isArray(uni.education_levels) &&
            uni.education_levels.some((lvl) => {
              const l = lvl.toLowerCase();
              if (
                targetDeg === 'bachelor' &&
                (l.includes('bachelor') || l.includes('undergrad') || l.includes('first-year'))
              ) {
                return true;
              }
              if (
                targetDeg === 'master' &&
                (l.includes('master') || l.includes('grad') || l.includes('postgrad'))
              ) {
                return true;
              }
              if (
                targetDeg === 'phd' &&
                (l.includes('phd') || l.includes('doctor'))
              ) {
                return true;
              }
              return l.includes(targetDeg);
            });

          const hasLegacyProg =
            Array.isArray(uni.programs) &&
            uni.programs.some((p) => p.degree_level.toLowerCase().includes(targetDeg));

          if (!hasLevel && !hasLegacyProg) return false;
        }

        // Minimum GPA filter (show universities requiring <= student's GPA)
        if (minGpa !== '') {
          if (
            uni.minimum_gpa !== null &&
            uni.minimum_gpa !== undefined &&
            uni.minimum_gpa > Number(minGpa)
          ) {
            return false;
          }
        }

        // Need-Blind Filter
        if (selectedNeedBlind === 'need-blind') {
          if (uni.need_blind !== true) return false;
        } else if (selectedNeedBlind === 'need-aware') {
          if (uni.need_blind !== false) return false;
        }

        // SAT / Standardized Testing Requirement Filter
        if (selectedSatRequired === 'test-optional') {
          if (uni.sat_required !== false) return false;
        } else if (selectedSatRequired === 'sat-required') {
          if (uni.sat_required !== true) return false;
        }

        // Deadlines Filter
        if (selectedDeadlineType) {
          const deadlines = Array.isArray(uni.university_deadlines) && uni.university_deadlines.length > 0
            ? uni.university_deadlines
            : Array.isArray((uni as any).deadlines)
            ? (uni as any).deadlines
            : [];

          if (selectedDeadlineType === 'has-deadline') {
            if (deadlines.length === 0) return false;
          } else if (selectedDeadlineType === 'early') {
            const hasEarly = deadlines.some((d: any) => {
              const t = (d.deadline_type || d.type || '').toUpperCase();
              return t.includes('EA') || t.includes('ED') || t.includes('EARLY');
            });
            if (!hasEarly) return false;
          } else if (selectedDeadlineType === 'regular') {
            const hasRegular = deadlines.some((d: any) => {
              const t = (d.deadline_type || d.type || '').toUpperCase();
              return t.includes('RD') || t.includes('REGULAR');
            });
            if (!hasRegular) return false;
          } else if (selectedDeadlineType === 'transfer') {
            const hasTransfer = deadlines.some((d: any) => {
              const t = (d.deadline_type || d.type || '').toUpperCase();
              return t.includes('TR') || t.includes('TRANSFER');
            });
            if (!hasTransfer) return false;
          }
        }

        // Application Platform Filter
        if (selectedPlatform) {
          const platforms = Array.isArray(uni.accepted_application_platform)
            ? uni.accepted_application_platform
            : [];
          const target = selectedPlatform.toLowerCase();
          const matchesPlatform = platforms.some((p) => {
            const pl = p.toLowerCase();
            if (target === 'common-app') return pl.includes('common');
            if (target === 'scoir') return pl.includes('scoir') || pl.includes('coalition');
            if (target === 'questbridge') return pl.includes('questbridge');
            if (target === 'direct') {
              return (
                pl.includes('direct') ||
                pl.includes('portal') ||
                pl.includes('ucas') ||
                pl.includes('tumonline') ||
                pl.includes('eapply')
              );
            }
            return pl.includes(target);
          });
          if (!matchesPlatform) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const nameA = a.organization || a.name || '';
        const nameB = b.organization || b.name || '';

        if (sortBy === 'aid') {
          const aidA = a.annual_tuitioin_coveratge_cost ?? 0;
          const aidB = b.annual_tuitioin_coveratge_cost ?? 0;
          if (aidA !== aidB) return aidB - aidA;
          return nameA.localeCompare(nameB);
        }

        if (sortBy === 'gpa') {
          const gpaA = a.minimum_gpa ?? 99;
          const gpaB = b.minimum_gpa ?? 99;
          if (gpaA !== gpaB) return gpaA - gpaB;
          return nameA.localeCompare(nameB);
        }

        return nameA.localeCompare(nameB);
      });
  }, [
    universities,
    searchTerm,
    selectedCountry,
    selectedDegree,
    minGpa,
    selectedNeedBlind,
    selectedSatRequired,
    selectedDeadlineType,
    selectedPlatform,
    sortBy
  ]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCountry('');
    setSelectedDegree('');
    setMinGpa('');
    setSelectedNeedBlind('');
    setSelectedSatRequired('');
    setSelectedDeadlineType('');
    setSelectedPlatform('');
  };

  const isFiltered = Boolean(
    selectedCountry ||
    selectedDegree ||
    minGpa !== '' ||
    (selectedNeedBlind && selectedNeedBlind !== 'all') ||
    (selectedSatRequired && selectedSatRequired !== 'all') ||
    selectedDeadlineType ||
    selectedPlatform
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      {/* Header Banner */}
      <div className="mb-8 pb-6 border-b border-[#EDE4D3]">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#D97706] uppercase tracking-wider mb-1">
          <GraduationCap className="w-4 h-4" />
          <span>Colleges & Universities</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
          Explore Global Universities
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-2xl">
          Search accredited colleges worldwide. Filter by need-blind policies, standardized testing rules, application deadlines, and platforms.
        </p>
      </div>

      {/* Main Grid: Filter Sidebar + Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar
            type="universities"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCountry={selectedCountry}
            onCountryChange={setSelectedCountry}
            selectedDegree={selectedDegree}
            onDegreeChange={setSelectedDegree}
            minGpa={minGpa}
            onMinGpaChange={setMinGpa}
            selectedNeedBlind={selectedNeedBlind}
            onNeedBlindChange={setSelectedNeedBlind}
            selectedSatRequired={selectedSatRequired}
            onSatRequiredChange={setSelectedSatRequired}
            selectedDeadlineType={selectedDeadlineType}
            onDeadlineTypeChange={setSelectedDeadlineType}
            selectedPlatform={selectedPlatform}
            onPlatformChange={setSelectedPlatform}
            onReset={handleReset}
          />
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-2">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-zinc-300 text-zinc-800 shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{mobileFilterOpen ? 'Hide Filters' : 'Filter Universities'}</span>
          </button>
        </div>

        {mobileFilterOpen && (
          <div className="lg:hidden mb-6">
            <FilterSidebar
              type="universities"
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              selectedDegree={selectedDegree}
              onDegreeChange={setSelectedDegree}
              minGpa={minGpa}
              onMinGpaChange={setMinGpa}
              selectedNeedBlind={selectedNeedBlind}
              onNeedBlindChange={setSelectedNeedBlind}
              selectedSatRequired={selectedSatRequired}
              onSatRequiredChange={setSelectedSatRequired}
              selectedDeadlineType={selectedDeadlineType}
              onDeadlineTypeChange={setSelectedDeadlineType}
              selectedPlatform={selectedPlatform}
              onPlatformChange={setSelectedPlatform}
              onReset={handleReset}
            />
          </div>
        )}

        {/* Results Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results Summary & Sorting Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 text-xs">
            <div className="flex items-center gap-2 text-zinc-600 flex-wrap">
              <span className="font-semibold text-zinc-900">{filteredUniversities.length}</span>
              <span>colleges found</span>
              {isFiltered && (
                <span className="text-[#92400E] font-medium text-[11px] bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                  Active Filters
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-zinc-200 text-zinc-700 rounded-md px-2 py-1 focus:outline-none focus:border-[#D97706]"
              >
                <option value="name">Institution Name (A-Z)</option>
                <option value="aid">Aid Coverage (Highest First)</option>
                <option value="gpa">Minimum GPA (Lowest First)</option>
              </select>
            </div>
          </div>

          {/* Cards Grid or Loading */}
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-mono text-zinc-500">Querying university registry...</p>
            </div>
          ) : filteredUniversities.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-dashed border-zinc-300">
              <p className="text-sm font-serif font-semibold text-zinc-800 mb-1">
                No universities matched your selected filters.
              </p>
              <p className="text-xs text-zinc-500 mb-4">
                Try clearing some criteria or resetting testing and deadline filters.
              </p>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold rounded-full transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredUniversities.map((uni) => (
                <UniversityCard
                  key={uni.id || uni.organization}
                  university={uni}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
