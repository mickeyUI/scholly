"use client";

import React from 'react';
import { Filter, RotateCcw, Search, ChevronDown, Check } from 'lucide-react';

interface FilterSidebarProps {
  type: 'scholarships' | 'universities';
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCountry: string;
  onCountryChange: (value: string) => void;
  selectedDegree: string;
  onDegreeChange: (value: string) => void;
  selectedFunding?: string;
  onFundingChange?: (value: string) => void;
  minGpa: number | '';
  onMinGpaChange: (value: number | '') => void;
  onReset: () => void;
}

const COUNTRIES = [
  'All Countries',
  'Germany',
  'United Kingdom',
  'United States',
  'Canada',
  'France',
  'Japan',
  'Switzerland',
  'South Africa'
];

const DEGREES = ['All Degrees', 'Bachelor', 'Master', 'PhD'];

const FUNDING_TYPES = ['All Funding', 'Fully Funded', 'Tuition Waiver', 'Partial Funding'];

export default function FilterSidebar({
  type,
  searchTerm,
  onSearchChange,
  selectedCountry,
  onCountryChange,
  selectedDegree,
  onDegreeChange,
  selectedFunding,
  onFundingChange,
  minGpa,
  onMinGpaChange,
  onReset
}: FilterSidebarProps) {
  return (
    <aside className="bg-white border border-[#EDE4D3] rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
          <Filter className="w-4 h-4 text-[#D97706]" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-[#D97706] hover:text-[#B45309] flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Keyword search input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-800 block">
          Keyword Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={type === 'scholarships' ? 'Search by scholarship, field...' : 'Search by school name, major...'}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-zinc-200 rounded-xl focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
          />
        </div>
      </div>

      {/* Destination Country with styled custom select */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-800 block">
          Destination Country
        </label>
        <div className="relative">
          <select
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className="w-full appearance-none pl-3.5 pr-8 py-2.5 text-xs bg-[#FAF8F5] hover:bg-[#F5F0E6] text-zinc-800 font-medium border border-[#EDE4D3] rounded-2xl focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#FEF3C7] transition-all cursor-pointer shadow-2xs"
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c === 'All Countries' ? '' : c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        </div>
      </div>

      {/* Target Degree Level - Cozy Segmented Pills */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-800 block">
          Degree Level
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {DEGREES.map((deg) => {
            const isSelected = (deg === 'All Degrees' && !selectedDegree) || selectedDegree === deg;
            return (
              <button
                key={deg}
                type="button"
                onClick={() => onDegreeChange(deg === 'All Degrees' ? '' : deg)}
                className={`py-2 px-2.5 text-xs rounded-xl text-center font-bold transition-all ${
                  isSelected
                    ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] shadow-xs'
                    : 'bg-[#FAF8F5] text-zinc-600 hover:text-zinc-900 hover:bg-[#F5F0E6] border border-[#EDE4D3]'
                }`}
              >
                {deg}
              </button>
            );
          })}
        </div>
      </div>

      {/* Funding Type (Scholarship only) - Segmented pills */}
      {type === 'scholarships' && onFundingChange && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-800 block">
            Funding Type
          </label>
          <div className="space-y-1.5">
            {FUNDING_TYPES.map((funding) => {
              const checked = (funding === 'All Funding' && !selectedFunding) || selectedFunding === funding;
              return (
                <button
                  key={funding}
                  type="button"
                  onClick={() => onFundingChange(funding === 'All Funding' ? '' : funding)}
                  className={`w-full flex items-center justify-between text-xs px-3 py-2 rounded-xl border text-left font-semibold transition-all ${
                    checked
                      ? 'bg-[#FFFBEB] border-[#D97706] text-[#92400E] shadow-2xs'
                      : 'bg-[#FAF8F5] border-[#EDE4D3] text-zinc-600 hover:bg-[#F5F0E6] hover:text-zinc-900'
                  }`}
                >
                  <span>{funding}</span>
                  {checked && <Check className="w-3.5 h-3.5 text-[#D97706]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Maximum Required Minimum GPA */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-zinc-800">Your Target GPA</label>
          <span className="text-zinc-500 font-medium">
            {minGpa ? `≤ ${minGpa}` : 'Any GPA'}
          </span>
        </div>
        <div className="relative">
          <select
            value={minGpa}
            onChange={(e) => onMinGpaChange(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full appearance-none pl-3.5 pr-8 py-2.5 text-xs bg-[#FAF8F5] hover:bg-[#F5F0E6] text-zinc-800 font-medium border border-[#EDE4D3] rounded-2xl focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#FEF3C7] transition-all cursor-pointer shadow-2xs"
          >
            <option value="">Any GPA requirement</option>
            <option value="3.0">3.0 or below (Most Accessible)</option>
            <option value="3.3">3.3 or below</option>
            <option value="3.5">3.5 or below</option>
            <option value="3.8">3.8 or below (Highly Selective)</option>
          </select>
          <ChevronDown className="absolute right-3 top-3 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        </div>
      </div>
    </aside>
  );
}
