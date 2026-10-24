"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Award, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Scholarship } from '../types';
import { getScholarships } from '../lib/opportunities';
import ScholarshipCard from '../components/ScholarshipCard';
import FilterSidebar from '../components/FilterSidebar';

export default function ScholarshipsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-zinc-500">Loading scholarship discovery...</p>
        </div>
      }
    >
      <ScholarshipsContent />
    </Suspense>
  );
}

function ScholarshipsContent() {
  const searchParams = useSearchParams();
  const initialFunding = searchParams.get('funding') || '';
  const initialDegree = searchParams.get('degree') || '';
  const initialQuery = searchParams.get('q') || '';
  const initialFee = searchParams.get('fee');

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedDegree, setSelectedDegree] = useState(initialDegree);
  const [selectedFunding, setSelectedFunding] = useState(initialFunding);
  const [minGpa, setMinGpa] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<'deadline' | 'coverage' | 'title'>('deadline');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    getScholarships().then((data) => {
      setScholarships(data);
      setIsLoading(false);
    });
  }, []);

  const filteredScholarships = useMemo(() => {
    return scholarships.filter((s) => {
      // Keyword search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = s.title.toLowerCase().includes(q);
        const matchesOrg = s.organization.toLowerCase().includes(q);
        const matchesCountry = s.country_located.toLowerCase().includes(q);
        const matchesFields = s.fields.some((f) => f.toLowerCase().includes(q));
        if (!matchesTitle && !matchesOrg && !matchesCountry && !matchesFields) {
          return false;
        }
      }

      // Fee filter
      if (initialFee === '0' && s.application_fee !== 0) {
        return false;
      }

      // Country filter
      if (selectedCountry && !s.country_located.toLowerCase().includes(selectedCountry.toLowerCase())) {
        return false;
      }

      // Degree filter
      if (selectedDegree && !s.education_levels.includes(selectedDegree)) {
        return false;
      }

      // Funding type filter
      if (selectedFunding && s.funding_type.toLowerCase() !== selectedFunding.toLowerCase()) {
        return false;
      }

      // Minimum GPA requirement filter
      if (minGpa !== '') {
        if (s.minimum_gpa && s.minimum_gpa > Number(minGpa)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'deadline') {
        const dateA = a.deadlines[0]?.date || '9999-99-99';
        const dateB = b.deadlines[0]?.date || '9999-99-99';
        return dateA.localeCompare(dateB);
      }
      if (sortBy === 'coverage') {
        return (b.annual_coverage_cost || 0) - (a.annual_coverage_cost || 0);
      }
      return a.title.localeCompare(b.title);
    });
  }, [scholarships, searchTerm, selectedCountry, selectedDegree, selectedFunding, minGpa, sortBy, initialFee]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCountry('');
    setSelectedDegree('');
    setSelectedFunding('');
    setMinGpa('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      
      {/* Header Banner */}
      <div className="mb-8 pb-6 border-b border-[#EDE4D3]">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#D97706] uppercase tracking-wider mb-1">
          <Award className="w-4 h-4" />
          <span>Financial Aid & Grants</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
          Explore Scholarships
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-2xl">
          Discover verified international scholarships, full-ride government awards, and tuition waivers. Filter by your target degree, nationality, and funding level.
        </p>
      </div>

      {/* Main Grid: Filter Sidebar + Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar
            type="scholarships"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCountry={selectedCountry}
            onCountryChange={setSelectedCountry}
            selectedDegree={selectedDegree}
            onDegreeChange={setSelectedDegree}
            selectedFunding={selectedFunding}
            onFundingChange={setSelectedFunding}
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
            <span>{mobileFilterOpen ? 'Hide Filters' : 'Filter Scholarships'}</span>
          </button>
        </div>

        {mobileFilterOpen && (
          <div className="lg:hidden mb-6">
            <FilterSidebar
              type="scholarships"
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              selectedDegree={selectedDegree}
              onDegreeChange={setSelectedDegree}
              selectedFunding={selectedFunding}
              onFundingChange={setSelectedFunding}
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
              <span className="font-semibold text-zinc-900">{filteredScholarships.length}</span>
              <span>scholarships discovered</span>
              {(selectedCountry || selectedDegree || selectedFunding || minGpa !== '') && (
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
                <option value="deadline">Upcoming Deadline</option>
                <option value="coverage">Award Value (Highest First)</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Cards Grid or Loading */}
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-mono text-zinc-500">Querying scholarship database...</p>
            </div>
          ) : filteredScholarships.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-dashed border-zinc-300">
              <p className="text-sm font-serif font-semibold text-zinc-800 mb-1">
                No scholarships match your selected filter criteria.
              </p>
              <p className="text-xs text-zinc-500 mb-4">
                Try removing degree or funding constraints to see more results.
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
              {filteredScholarships.map((scholarship) => (
                <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
