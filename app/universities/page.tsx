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
          <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
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
  const [sortBy, setSortBy] = useState<'ranking' | 'tuition' | 'name'>('ranking');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    getUniversities().then((data) => {
      setUniversities(data);
      setIsLoading(false);
    });
  }, []);

  const filteredUniversities = useMemo(() => {
    return universities.filter((uni) => {
      // Keyword match
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = uni.name.toLowerCase().includes(query);
        const matchesCountry = uni.country.toLowerCase().includes(query);
        const matchesCity = uni.city.toLowerCase().includes(query);
        const matchesPrograms = uni.programs.some((p) => p.name.toLowerCase().includes(query));
        if (!matchesName && !matchesCountry && !matchesCity && !matchesPrograms) {
          return false;
        }
      }

      // Country filter
      if (selectedCountry && !uni.country.toLowerCase().includes(selectedCountry.toLowerCase())) {
        return false;
      }

      // Degree filter
      if (selectedDegree) {
        const hasDegree = uni.programs.some(
          (p) => p.degree_level.toLowerCase() === selectedDegree.toLowerCase()
        );
        if (!hasDegree) return false;
      }

      // Minimum GPA filter (show universities requiring <= student's GPA)
      if (minGpa !== '') {
        if (uni.minimum_gpa && uni.minimum_gpa > Number(minGpa)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'ranking') {
        return (a.world_ranking || 999) - (b.world_ranking || 999);
      }
      if (sortBy === 'tuition') {
        const tuitionA = a.programs[0]?.tuition_per_year_usd || 0;
        const tuitionB = b.programs[0]?.tuition_per_year_usd || 0;
        return tuitionA - tuitionB;
      }
      return a.name.localeCompare(b.name);
    });
  }, [universities, searchTerm, selectedCountry, selectedDegree, minGpa, sortBy]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCountry('');
    setSelectedDegree('');
    setMinGpa('');
  };

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
          Search accredited colleges worldwide. Compare international admissions selectivity, net tuition costs, and verified scholarship support.
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
            onReset={handleReset}
          />
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-2">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-zinc-300 text-zinc-800 shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A059]" />
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
              onReset={handleReset}
            />
          </div>
        )}

        {/* Results Column */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Results Summary & Sorting Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 text-xs">
            <div className="flex items-center gap-2 text-zinc-600">
              <span className="font-semibold text-zinc-900">{filteredUniversities.length}</span>
              <span>universities discovered</span>
              {(selectedCountry || selectedDegree || minGpa !== '') && (
                <span className="text-[#957328] font-mono text-[11px]">
                  (Filtered)
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-zinc-200 text-zinc-700 rounded-md px-2 py-1 focus:outline-none focus:border-[#C5A059]"
              >
                <option value="ranking">World Ranking (Best First)</option>
                <option value="tuition">Tuition (Lowest First)</option>
                <option value="name">Institution Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Cards Grid or Loading */}
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-mono text-zinc-500">Querying university registry...</p>
            </div>
          ) : filteredUniversities.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-dashed border-zinc-300">
              <p className="text-sm font-serif font-semibold text-zinc-800 mb-1">
                No universities matched your selected filters.
              </p>
              <p className="text-xs text-zinc-500 mb-4">
                Try widening your search terms or resetting destination filters.
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
                <UniversityCard key={uni.id} university={uni} />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
