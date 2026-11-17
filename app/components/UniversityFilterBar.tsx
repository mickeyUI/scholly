"use client";

import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  X,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  GraduationCap
} from 'lucide-react';

interface UniversityFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCountry: string;
  onCountryChange: (value: string) => void;
  selectedDegree: string;
  onDegreeChange: (value: string) => void;
  minGpa: number | '';
  onMinGpaChange: (value: number | '') => void;
  selectedNeedBlind: 'all' | 'need-blind' | 'need-aware' | '';
  onNeedBlindChange: (value: 'all' | 'need-blind' | 'need-aware' | '') => void;
  selectedSatRequired: 'all' | 'test-optional' | 'sat-required' | '';
  onSatRequiredChange: (value: 'all' | 'test-optional' | 'sat-required' | '') => void;
  selectedDeadlineType: string;
  onDeadlineTypeChange: (value: string) => void;
  selectedPlatform: string;
  onPlatformChange: (value: string) => void;
  selectedPolicyTag?: string;
  onPolicyTagChange?: (value: string) => void;
  onReset: () => void;
}

const COUNTRIES = [
  'All Countries',
  'China',
  'India',
  'Italy',
  'Japan',
  'Mauritius',
  'Romania',
  'Saudi Arabia',
  'South Korea',
  'Türkiye',
  'United States'
];

const DEGREES = ['All Degrees', 'Bachelor', 'Master', 'PhD'];

export default function UniversityFilterBar({
  searchTerm,
  onSearchChange,
  selectedCountry,
  onCountryChange,
  selectedDegree,
  onDegreeChange,
  minGpa,
  onMinGpaChange,
  selectedNeedBlind,
  onNeedBlindChange,
  selectedSatRequired,
  onSatRequiredChange,
  selectedDeadlineType,
  onDeadlineTypeChange,
  selectedPlatform,
  onPlatformChange,
  selectedPolicyTag,
  onPolicyTagChange,
  onReset
}: UniversityFilterBarProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  // Count active criteria
  const advancedFilterCount = [
    selectedNeedBlind && selectedNeedBlind !== 'all',
    selectedSatRequired && selectedSatRequired !== 'all',
    Boolean(selectedPlatform),
    Boolean(selectedDeadlineType),
    Boolean(selectedPolicyTag),
    minGpa !== ''
  ].filter(Boolean).length;

  const totalActiveFilters = [
    Boolean(searchTerm.trim()),
    Boolean(selectedCountry),
    Boolean(selectedDegree),
    selectedNeedBlind && selectedNeedBlind !== 'all',
    selectedSatRequired && selectedSatRequired !== 'all',
    Boolean(selectedPlatform),
    Boolean(selectedDeadlineType),
    Boolean(selectedPolicyTag),
    minGpa !== ''
  ].filter(Boolean).length;

  return (
    <div className="bg-white border border-[rgba(119,141,169,0.3)] rounded-2xl p-4 sm:p-5 shadow-[0_10px_30px_-4px_rgba(13,27,42,0.08),0_2px_6px_-1px_rgba(13,27,42,0.04)] space-y-4 mb-8">
      {/* Primary Row: Search Bar, Country, Degree, Mobile Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Keyword Search Input */}
        <div className="md:col-span-6 lg:col-span-6 relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#778da9] pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search universities by name, campus, major..."
            className="w-full pl-10 pr-9 py-2.5 text-xs bg-[#f3f4f0] border border-[rgba(119,141,169,0.35)] rounded-xl focus:outline-none focus:border-[#1b263b] focus:ring-1 focus:ring-[#1b263b] text-[#0d1b2a] placeholder:text-[#778da9] transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 p-1 text-[#778da9] hover:text-[#0d1b2a] rounded-full"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Destination Country Select */}
        <div className="md:col-span-3 lg:col-span-3 relative">
          <select
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className={`w-full appearance-none pl-3.5 pr-8 py-2.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#1b263b] focus:border-[#1b263b] transition-all cursor-pointer ${
              selectedCountry
                ? 'bg-[rgba(65,90,119,0.08)] border-[#1b263b] text-[#0d1b2a] font-semibold'
                : 'bg-[#f3f4f0] border-[rgba(119,141,169,0.35)] text-[#415a77] font-medium hover:bg-[#e0e1dd]/40'
            }`}
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c === 'All Countries' ? '' : c}>
                {c === 'All Countries' ? '🌍 All Countries' : c}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 w-3.5 h-3.5 text-[#778da9] pointer-events-none" />
        </div>

        {/* Target Degree Level */}
        <div className="md:col-span-3 lg:col-span-3 flex items-center gap-2">
          <div className="relative flex-1">
            <select
              value={selectedDegree}
              onChange={(e) => onDegreeChange(e.target.value)}
              className={`w-full appearance-none pl-3.5 pr-8 py-2.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#1b263b] focus:border-[#1b263b] transition-all cursor-pointer ${
                selectedDegree
                  ? 'bg-[rgba(65,90,119,0.08)] border-[#1b263b] text-[#0d1b2a] font-semibold'
                  : 'bg-[#f3f4f0] border-[rgba(119,141,169,0.35)] text-[#415a77] font-medium hover:bg-[#e0e1dd]/40'
              }`}
            >
              {DEGREES.map((deg) => (
                <option key={deg} value={deg === 'All Degrees' ? '' : deg}>
                  {deg === 'All Degrees' ? '🎓 All Degrees' : deg}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 w-3.5 h-3.5 text-[#778da9] pointer-events-none" />
          </div>

          {/* Mobile More Filters Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className={`md:hidden flex items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
              mobileExpanded || advancedFilterCount > 0
                ? 'bg-[#1b263b] text-white border-[#1b263b]'
                : 'bg-[#f3f4f0] text-[#415a77] border-[rgba(119,141,169,0.35)]'
            }`}
            title="Toggle more filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {advancedFilterCount > 0 && (
              <span className="ml-1 w-4 h-4 bg-white text-[#1b263b] text-[10px] rounded-full flex items-center justify-center font-bold">
                {advancedFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick Policy Filter Chips */}
      {onPolicyTagChange && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1">
          {[
            { id: '', label: '✨ All Policies' },
            { id: 'govt-scholarship', label: '🏛️ Govt Scholarships' },
            { id: 'english-medium', label: '🗣️ English Tracks / MOI' },
            { id: 'stay-back', label: '🛂 Stay-Back Visas' },
            { id: 'need-blind', label: '🛡️ Need-Blind (US)' },
          ].map((tag) => {
            const active = (selectedPolicyTag || '') === tag.id;
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => onPolicyTagChange(active ? '' : tag.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  active
                    ? 'bg-[#1b263b] border-[#1b263b] text-white shadow-2xs'
                    : 'bg-[rgba(65,90,119,0.08)] border-[rgba(119,141,169,0.35)] text-[#415a77] hover:border-[#1b263b] hover:text-[#0d1b2a]'
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Secondary Row: Admissions & Detailed Policy Filters (Horizontal 5-Column Grid on Desktop) */}
      <div
        className={`${
          mobileExpanded ? 'grid' : 'hidden md:grid'
        } grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-[rgba(119,141,169,0.2)]`}
      >
        {/* Need-Blind Policy */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#415a77] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#415a77]" />
            <span>Need-Blind Policy</span>
          </label>
          <div className="relative">
            <select
              value={selectedNeedBlind || ''}
              onChange={(e) => onNeedBlindChange(e.target.value as any)}
              className={`w-full appearance-none pl-3 pr-7 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#1b263b] focus:border-[#1b263b] transition-all cursor-pointer ${
                selectedNeedBlind && selectedNeedBlind !== 'all'
                  ? 'bg-[rgba(65,90,119,0.08)] border-[#1b263b] text-[#0d1b2a] font-semibold'
                  : 'bg-[#f3f4f0] border-[rgba(119,141,169,0.35)] text-[#415a77] font-medium hover:bg-[#e0e1dd]/40'
              }`}
            >
              <option value="">All Policies</option>
              <option value="need-blind">Need-Blind Only</option>
              <option value="need-aware">Need-Aware</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-[#778da9] pointer-events-none" />
          </div>
        </div>

        {/* Standardized Tests (SAT / ACT) */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#415a77] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#415a77]" />
            <span>Standardized Tests</span>
          </label>
          <div className="relative">
            <select
              value={selectedSatRequired || ''}
              onChange={(e) => onSatRequiredChange(e.target.value as any)}
              className={`w-full appearance-none pl-3 pr-7 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#1b263b] focus:border-[#1b263b] transition-all cursor-pointer ${
                selectedSatRequired && selectedSatRequired !== 'all'
                  ? 'bg-[rgba(65,90,119,0.08)] border-[#1b263b] text-[#0d1b2a] font-semibold'
                  : 'bg-[#f3f4f0] border-[rgba(119,141,169,0.35)] text-[#415a77] font-medium hover:bg-[#e0e1dd]/40'
              }`}
            >
              <option value="">All Testing Rules</option>
              <option value="test-optional">Test-Optional</option>
              <option value="sat-required">SAT / ACT Required</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-[#778da9] pointer-events-none" />
          </div>
        </div>

        {/* Application Platform */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#415a77] flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#415a77]" />
            <span>Platform</span>
          </label>
          <div className="relative">
            <select
              value={selectedPlatform || ''}
              onChange={(e) => onPlatformChange(e.target.value)}
              className={`w-full appearance-none pl-3 pr-7 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#1b263b] focus:border-[#1b263b] transition-all cursor-pointer ${
                selectedPlatform
                  ? 'bg-[rgba(65,90,119,0.08)] border-[#1b263b] text-[#0d1b2a] font-semibold'
                  : 'bg-[#f3f4f0] border-[rgba(119,141,169,0.35)] text-[#415a77] font-medium hover:bg-[#e0e1dd]/40'
              }`}
            >
              <option value="">All Platforms</option>
              <option value="common-app">Common App</option>
              <option value="scoir">Coalition / Scoir</option>
              <option value="questbridge">QuestBridge</option>
              <option value="direct">Direct Portal</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-[#778da9] pointer-events-none" />
          </div>
        </div>

        {/* Deadline Cycle */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#415a77] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#415a77]" />
            <span>Deadline Cycle</span>
          </label>
          <div className="relative">
            <select
              value={selectedDeadlineType || ''}
              onChange={(e) => onDeadlineTypeChange(e.target.value)}
              className={`w-full appearance-none pl-3 pr-7 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#1b263b] focus:border-[#1b263b] transition-all cursor-pointer ${
                selectedDeadlineType
                  ? 'bg-[rgba(65,90,119,0.08)] border-[#1b263b] text-[#0d1b2a] font-semibold'
                  : 'bg-[#f3f4f0] border-[rgba(119,141,169,0.35)] text-[#415a77] font-medium hover:bg-[#e0e1dd]/40'
              }`}
            >
              <option value="">All Deadlines</option>
              <option value="early">Early Action / Decision (EA/ED)</option>
              <option value="regular">Regular Decision (RD)</option>
              <option value="transfer">Transfer Application (TR)</option>
              <option value="has-deadline">Recorded Deadlines Only</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-[#778da9] pointer-events-none" />
          </div>
        </div>

        {/* Target Minimum GPA */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#415a77] flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-[#415a77]" />
            <span>Target GPA</span>
          </label>
          <div className="relative">
            <select
              value={minGpa}
              onChange={(e) => onMinGpaChange(e.target.value === '' ? '' : Number(e.target.value))}
              className={`w-full appearance-none pl-3 pr-7 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#1b263b] focus:border-[#1b263b] transition-all cursor-pointer ${
                minGpa !== ''
                  ? 'bg-[rgba(65,90,119,0.08)] border-[#1b263b] text-[#0d1b2a] font-semibold'
                  : 'bg-[#f3f4f0] border-[rgba(119,141,169,0.35)] text-[#415a77] font-medium hover:bg-[#e0e1dd]/40'
              }`}
            >
              <option value="">Any GPA</option>
              <option value="3.0">≤ 3.0 (Most Accessible)</option>
              <option value="3.3">≤ 3.3</option>
              <option value="3.5">≤ 3.5</option>
              <option value="3.8">≤ 3.8 (Selective)</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-[#778da9] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Row 3: Active Filters Tags & Quick Reset Button */}
      {totalActiveFilters > 0 && (
        <div className="flex items-center gap-2 pt-3 border-t border-[rgba(119,141,169,0.2)] flex-wrap text-xs">
          <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#415a77]">
            Active ({totalActiveFilters}):
          </span>

          {searchTerm.trim() && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[rgba(65,90,119,0.08)] text-[#0d1b2a] border border-[rgba(119,141,169,0.4)] text-[11px] font-semibold">
              Search: "{searchTerm}"
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="hover:text-[#1b263b] ml-0.5"
                title="Remove keyword filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCountry && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[rgba(65,90,119,0.08)] text-[#0d1b2a] border border-[rgba(119,141,169,0.4)] text-[11px] font-semibold">
              Country: {selectedCountry}
              <button
                type="button"
                onClick={() => onCountryChange('')}
                className="hover:text-[#1b263b] ml-0.5"
                title="Remove country filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedDegree && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[rgba(65,90,119,0.08)] text-[#0d1b2a] border border-[rgba(119,141,169,0.4)] text-[11px] font-semibold">
              Degree: {selectedDegree}
              <button
                type="button"
                onClick={() => onDegreeChange('')}
                className="hover:text-[#1b263b] ml-0.5"
                title="Remove degree filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedNeedBlind && selectedNeedBlind !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[rgba(65,90,119,0.08)] text-[#0d1b2a] border border-[rgba(119,141,169,0.4)] text-[11px] font-semibold">
              {selectedNeedBlind === 'need-blind' ? 'Need-Blind Only' : 'Need-Aware'}
              <button
                type="button"
                onClick={() => onNeedBlindChange('')}
                className="hover:text-[#1b263b] ml-0.5"
                title="Remove need-blind filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedSatRequired && selectedSatRequired !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[rgba(65,90,119,0.08)] text-[#0d1b2a] border border-[rgba(119,141,169,0.4)] text-[11px] font-semibold">
              {selectedSatRequired === 'test-optional' ? 'Test-Optional' : 'SAT Required'}
              <button
                type="button"
                onClick={() => onSatRequiredChange('')}
                className="hover:text-[#1b263b] ml-0.5"
                title="Remove testing filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedPlatform && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[rgba(65,90,119,0.08)] text-[#0d1b2a] border border-[rgba(119,141,169,0.4)] text-[11px] font-semibold capitalize">
              Platform: {selectedPlatform.replace('-', ' ')}
              <button
                type="button"
                onClick={() => onPlatformChange('')}
                className="hover:text-[#1b263b] ml-0.5"
                title="Remove platform filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedPolicyTag && onPolicyTagChange && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[rgba(65,90,119,0.08)] text-[#0d1b2a] border border-[rgba(119,141,169,0.4)] text-[11px] font-semibold capitalize">
              Policy: {selectedPolicyTag.replace('-', ' ')}
              <button
                type="button"
                onClick={() => onPolicyTagChange('')}
                className="hover:text-[#1b263b] ml-0.5"
                title="Remove policy filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedDeadlineType && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[rgba(65,90,119,0.08)] text-[#0d1b2a] border border-[rgba(119,141,169,0.4)] text-[11px] font-semibold capitalize">
              Deadline: {selectedDeadlineType}
              <button
                type="button"
                onClick={() => onDeadlineTypeChange('')}
                className="hover:text-[#1b263b] ml-0.5"
                title="Remove deadline filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {minGpa !== '' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[rgba(65,90,119,0.08)] text-[#0d1b2a] border border-[rgba(119,141,169,0.4)] text-[11px] font-semibold">
              GPA ≤ {minGpa}
              <button
                type="button"
                onClick={() => onMinGpaChange('')}
                className="hover:text-[#1b263b] ml-0.5"
                title="Remove GPA filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onReset}
            className="text-xs font-bold text-[#1b263b] hover:text-[#0d1b2a] ml-auto transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}
    </div>
  );
}
