"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GraduationCap, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { University } from '../types';
import { getUniversities } from '../lib/opportunities';
import { getNormalizedPolicies } from '../lib/country-policies';
import UniversityCard from '../components/UniversityCard';
import UniversityFilterBar from '../components/UniversityFilterBar';

const PAGE_SIZE = 20;

export default function UniversitiesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-[#1b263b] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-[#415a77]">Loading university discovery...</p>
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
  const [selectedPolicyTag, setSelectedPolicyTag] = useState<string>('');

  const [sortBy, setSortBy] = useState<'name' | 'aid' | 'gpa'>('name');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page whenever filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedCountry,
    selectedDegree,
    minGpa,
    selectedNeedBlind,
    selectedSatRequired,
    selectedDeadlineType,
    selectedPlatform,
    selectedPolicyTag,
    sortBy
  ]);

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

        const pol = getNormalizedPolicies(uni);
        const effectiveNeedBlind = pol.need_blind !== undefined ? pol.need_blind : uni.need_blind;
        const effectiveSatRequired = pol.sat_required !== undefined ? pol.sat_required : uni.sat_required;

        // Need-Blind Filter
        if (selectedNeedBlind === 'need-blind') {
          if (effectiveNeedBlind !== true) return false;
        } else if (selectedNeedBlind === 'need-aware') {
          if (effectiveNeedBlind !== false) return false;
        }

        // SAT / Standardized Testing Requirement Filter
        if (selectedSatRequired === 'test-optional') {
          if (effectiveSatRequired !== false) return false;
        } else if (selectedSatRequired === 'sat-required') {
          if (effectiveSatRequired !== true) return false;
        }

        // Quick Country Policy Tag Filter
        if (selectedPolicyTag === 'govt-scholarship') {
          const hasGovtScholarship =
            Boolean(pol.iccr_scholarship_eligible) ||
            Boolean(pol.csc_scholarship_supported) ||
            Boolean(pol.dsu_regional_scholarship_board) ||
            Boolean(pol.isee_parificato_eligible) ||
            Boolean(pol.mext_scholarship_recommendations) ||
            Boolean(pol.jica_abe_initiative_partner) ||
            Boolean(pol.royal_scholarship_stipend_monthly) ||
            Boolean(pol.flight_tickets_provided) ||
            Boolean(pol.campus_housing_provided) ||
            Boolean(pol.gks_kgsp_eligible) ||
            Boolean(pol.turkiye_burslari_ytb_eligible) ||
            Boolean(pol.mae_romanian_mfa_scholarship_eligible) ||
            Boolean(pol.mass_scholarship_eligible) ||
            effectiveNeedBlind === true;
          if (!hasGovtScholarship) return false;
        } else if (selectedPolicyTag === 'english-medium') {
          const hasEnglishMedium =
            Boolean(pol.medium_of_instruction_certificate_accepted) ||
            Boolean(pol.english_taught_degrees_offered) ||
            Boolean(pol.sgu_top_global_status) ||
            (typeof pol.language_of_instruction_ratio === 'string' &&
              pol.language_of_instruction_ratio.toLowerCase().includes('english')) ||
            (typeof pol.language_of_instruction === 'string' &&
              pol.language_of_instruction.toLowerCase().includes('english')) ||
            (Array.isArray(uni.accepted_english_proficiency_tests) &&
              uni.accepted_english_proficiency_tests.length > 0) ||
            uni.english_proficiency_required === false;
          if (!hasEnglishMedium) return false;
        } else if (selectedPolicyTag === 'stay-back') {
          const hasStayBack =
            (typeof pol.post_study_work_stay_back_months === 'number' &&
              pol.post_study_work_stay_back_months > 0) ||
            Boolean(pol.post_study_work_visa) ||
            Boolean(pol.d10_job_seeker_stay_back_duration) ||
            Boolean(pol.ypop_stay_back_eligible) ||
            (typeof pol.post_study_stay_back_months === 'number' &&
              pol.post_study_stay_back_months > 0) ||
            Boolean(pol.work_rights_during_studies);
          if (!hasStayBack) return false;
        } else if (selectedPolicyTag === 'need-blind') {
          if (effectiveNeedBlind !== true) return false;
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
    selectedPolicyTag,
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
    setSelectedPolicyTag('');
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filteredUniversities.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, filteredUniversities.length);
  const paginatedUniversities = filteredUniversities.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const element = document.getElementById('university-listings');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };

  const isFiltered = Boolean(
    selectedCountry ||
    selectedDegree ||
    minGpa !== '' ||
    (selectedNeedBlind && selectedNeedBlind !== 'all') ||
    (selectedSatRequired && selectedSatRequired !== 'all') ||
    selectedDeadlineType ||
    selectedPlatform ||
    selectedPolicyTag
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      {/* Header Banner */}
      <div className="mb-8 pb-6 border-b border-[rgba(119,141,169,0.25)]">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#415a77] uppercase tracking-[0.05em] mb-1">
          <GraduationCap className="w-4 h-4 text-[#415a77]" />
          <span>Colleges &amp; Universities</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0d1b2a] tracking-tight">
          Explore Global Universities
        </h1>
        <p className="text-xs sm:text-sm text-[#415a77] mt-1 max-w-2xl">
          Search accredited colleges worldwide. Filter by need-blind policies, standardized testing rules, application deadlines, and platforms.
        </p>
      </div>

      {/* Horizontal Filter Bar Component on Top of University List */}
      <UniversityFilterBar
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
        selectedPolicyTag={selectedPolicyTag}
        onPolicyTagChange={setSelectedPolicyTag}
        onReset={handleReset}
      />

      {/* University Listings Section */}
      <div id="university-listings" className="space-y-6">
        {/* Results Summary & Sorting Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(119,141,169,0.2)] text-xs">
          <div className="flex items-center gap-2 text-[#415a77] flex-wrap">
            <span className="font-bold text-[#0d1b2a]">{filteredUniversities.length}</span>
            <span>colleges found</span>
            {filteredUniversities.length > 0 && (
              <span className="text-[#415a77] font-semibold text-[11px] bg-[rgba(65,90,119,0.08)] border border-[rgba(119,141,169,0.35)] px-2.5 py-0.5 rounded-full">
                Showing {startIndex + 1}–{endIndex}
              </span>
            )}
            {isFiltered && (
              <span className="text-white font-bold text-[11px] bg-[#1b263b] px-2.5 py-0.5 rounded-full">
                Active Filters
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#778da9]" />
            <span className="text-[#415a77] font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[rgba(119,141,169,0.35)] text-[#0d1b2a] rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#1b263b]"
            >
              <option value="name">Institution Name (A-Z)</option>
              <option value="aid">Aid Coverage (Highest First)</option>
              <option value="gpa">Minimum GPA (Lowest First)</option>
            </select>
          </div>
        </div>

        {/* Cards Grid: 3 COLUMNS */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-[#1b263b] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-mono text-[#415a77]">Querying university registry...</p>
          </div>
        ) : filteredUniversities.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[rgba(119,141,169,0.35)] shadow-[0_10px_30px_-4px_rgba(13,27,42,0.08)]">
            <p className="text-sm font-serif font-bold text-[#0d1b2a] mb-1">
              No universities matched your selected filters.
            </p>
            <p className="text-xs text-[#415a77] mb-4">
              Try clearing some criteria or resetting testing and deadline filters.
            </p>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-[#1b263b] hover:bg-[#0d1b2a] text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedUniversities.map((uni) => (
                <UniversityCard
                  key={uni.id || uni.organization}
                  university={uni}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-[rgba(119,141,169,0.25)]">
                <div className="text-xs text-[#415a77] font-medium">
                  Page <span className="font-bold text-[#0d1b2a]">{currentPage}</span> of{' '}
                  <span className="font-bold text-[#0d1b2a]">{totalPages}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Previous Button: Appears only after the first 20 have been passed */}
                  {currentPage > 1 && (
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="px-3.5 py-2 bg-white border border-[rgba(119,141,169,0.35)] hover:border-[#1b263b] hover:bg-[rgba(224,225,221,0.3)] text-[#0d1b2a] text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 text-[#1b263b]" />
                      <span>Previous</span>
                    </button>
                  )}

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      if (
                        totalPages > 6 &&
                        pageNum !== 1 &&
                        pageNum !== totalPages &&
                        Math.abs(pageNum - currentPage) > 1
                      ) {
                        if (pageNum === 2 || pageNum === totalPages - 1) {
                          return (
                            <span key={pageNum} className="px-1 text-[#778da9] text-xs">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }

                      const isActive = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#1b263b] text-white shadow-xs'
                              : 'bg-white border border-[rgba(119,141,169,0.35)] text-[#415a77] hover:border-[#1b263b] hover:bg-[rgba(224,225,221,0.3)]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button: Disables when no more universities are left */}
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
                      currentPage >= totalPages
                        ? 'bg-[#f3f4f0] border-[rgba(119,141,169,0.2)] text-[#778da9] cursor-not-allowed opacity-60'
                        : 'bg-white border-[rgba(119,141,169,0.35)] hover:border-[#1b263b] hover:bg-[rgba(224,225,221,0.3)] text-[#0d1b2a] shadow-2xs cursor-pointer'
                    }`}
                  >
                    <span>Next</span>
                    <ChevronRight className={`w-4 h-4 ${currentPage >= totalPages ? 'text-[#778da9]' : 'text-[#1b263b]'}`} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
