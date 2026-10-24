"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  GraduationCap,
  Trash2,
  Edit3,
  ExternalLink,
  ArrowRight,
  Heart,
  AlertTriangle,
} from 'lucide-react';
import AuthGate from '../components/AuthGate';
import { useAuth } from '../lib/auth-context';
import { useSaved } from '../lib/saved-context';
import { SavedItem } from '../types';

/** Parse "Month YYYY" or ISO date strings and return a Date | null */
function parseDeadline(raw: string): Date | null {
  if (!raw || raw.toLowerCase() === 'rolling') return null;
  const d = new Date(raw);
  if (!isNaN(d.getTime())) return d;
  // Try "Month YYYY" e.g. "March 2026"
  const parts = raw.split(' ');
  if (parts.length === 2) {
    const attempt = new Date(`${parts[0]} 1, ${parts[1]}`);
    if (!isNaN(attempt.getTime())) return attempt;
  }
  return null;
}

function getDaysRemaining(raw: string): number | null {
  const d = parseDeadline(raw);
  if (!d) return null;
  const now = new Date();
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function DeadlineChip({ days }: { days: number | null }) {
  if (days === null)
    return <span className="text-xs font-bold text-zinc-500">Rolling</span>;
  if (days < 0)
    return <span className="text-xs font-bold text-zinc-400 line-through">Closed</span>;
  if (days <= 30)
    return (
      <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-red-100 text-red-700 border border-red-200">
        {days}d left
      </span>
    );
  if (days <= 90)
    return (
      <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
        {days}d left
      </span>
    );
  return (
    <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
      {days}d left
    </span>
  );
}

export default function DashboardPage() {
  return (
    <AuthGate
      featureName="My Saved List & Deadlines"
      description="Keep track of colleges you love, track upcoming application deadlines, and record your preparation notes in your personal workspace."
      icon="dashboard"
    >
      <DashboardContent />
    </AuthGate>
  );
}

function DashboardContent() {
  const { profile, user } = useAuth();
  const { savedItems, updateItemStatus, removeItem } = useSaved();
  const [filterType, setFilterType] = useState<'all' | 'scholarship' | 'university'>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState('');

  const filteredItems = savedItems.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const totalSaved = savedItems.length;
  const inProgressCount = savedItems.filter((i) => i.status === 'In Progress').length;
  const submittedCount = savedItems.filter((i) => i.status === 'Submitted').length;

  const handleStartEditNotes = (item: SavedItem) => {
    setEditingNotesId(item.id);
    setNotesInput(item.notes || '');
  };

  const handleSaveNotes = (id: string, currentStatus: SavedItem['status']) => {
    updateItemStatus(id, currentStatus, notesInput);
    setEditingNotesId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      
      {/* Top Welcome Banner */}
      <div className="bg-white border border-[#EDE4D3] rounded-3xl p-6 sm:p-8 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309]" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#D97706] uppercase tracking-wider mb-1">
              <Heart className="w-4 h-4 fill-current text-[#D97706]" />
              <span>My College & Scholarship List</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Welcome back, {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student'}!
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Track deadlines, monitor your application progress, and organize your saved opportunities.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/profile"
              className="px-4 py-2 text-xs font-bold rounded-full bg-[#FAF8F5] hover:bg-zinc-100 text-zinc-800 border border-zinc-200 transition-colors"
            >
              My Preferences
            </Link>
            <Link
              href="/assistant"
              className="px-5 py-2 text-xs font-bold rounded-full bg-[#D97706] text-white hover:bg-[#B45309] shadow-xs transition-colors"
            >
              Ask AI Advisor
            </Link>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-zinc-100 text-xs">
          <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-zinc-100">
            <span className="text-[11px] font-bold text-zinc-400 uppercase block">Total Saved</span>
            <span className="text-2xl font-extrabold text-zinc-900 mt-0.5 block">{totalSaved}</span>
          </div>

          <div className="p-3.5 bg-[#FFFBEB] rounded-2xl border border-[#FDE68A]">
            <span className="text-[11px] font-bold text-[#92400E] uppercase block">In Progress</span>
            <span className="text-2xl font-extrabold text-[#D97706] mt-0.5 block">{inProgressCount}</span>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-700 uppercase block">Submitted</span>
            <span className="text-2xl font-extrabold text-emerald-800 mt-0.5 block">{submittedCount}</span>
          </div>

          <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-zinc-100">
            <span className="text-[11px] font-bold text-zinc-400 uppercase block">Target Degree</span>
            <span className="text-base font-extrabold text-zinc-800 mt-0.5 block truncate">
              {profile?.target_degree_level || 'Master’s'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Saved Items + Deadlines Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Bookmarked Opportunities */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#EDE4D3]">
            <h2 className="text-lg font-bold text-zinc-900">
              My Saved Opportunities
            </h2>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-full text-xs border border-zinc-200">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  filterType === 'all'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                All ({savedItems.length})
              </button>
              <button
                onClick={() => setFilterType('scholarship')}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  filterType === 'scholarship'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                Scholarships
              </button>
              <button
                onClick={() => setFilterType('university')}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  filterType === 'university'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                Colleges
              </button>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-[#EDE4D3]">
              <Heart className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-zinc-800 mb-1">
                Your saved list is empty.
              </h3>
              <p className="text-xs text-zinc-500 mb-5 max-w-sm mx-auto">
                Explore colleges and scholarships and click the heart icon on any card to save them here.
              </p>
              <div className="flex items-center justify-center gap-2">
                <Link
                  href="/scholarships"
                  className="px-5 py-2.5 bg-[#D97706] text-white text-xs font-bold rounded-full shadow-xs"
                >
                  Discover Scholarships
                </Link>
                <Link
                  href="/universities"
                  className="px-5 py-2.5 bg-[#FAF8F5] text-zinc-800 text-xs font-bold rounded-full border border-zinc-200"
                >
                  Explore Universities
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#EDE4D3] hover:border-[#D97706] rounded-2xl p-5 shadow-xs transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] uppercase">
                          {item.type}
                        </span>
                        <span className="text-xs text-zinc-500 font-medium">{item.country}</span>
                      </div>
                      <h3 className="text-base font-bold text-zinc-900">
                        <Link
                          href={item.type === 'scholarship' ? `/scholarships/${item.target_id}` : `/universities/${item.target_id}`}
                          className="hover:text-[#D97706] transition-colors"
                        >
                          {item.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-zinc-500">{item.institution_or_org}</p>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      title="Remove bookmark"
                      className="p-1.5 text-zinc-300 hover:text-red-500 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Status Selector & Value Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 py-2 border-y border-zinc-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-700">Status:</span>
                      <select
                        value={item.status}
                        onChange={(e) => updateItemStatus(item.id, e.target.value as any, item.notes)}
                        className={`text-xs font-bold rounded-full px-3 py-1 border focus:outline-none ${
                          item.status === 'Accepted'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : item.status === 'Submitted'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : item.status === 'In Progress'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                        }`}
                      >
                        <option value="Saved">Saved</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Accepted">Accepted</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3 text-zinc-600 text-xs">
                      <span>Value: <strong>{item.funding_or_tuition}</strong></span>
                      <span>Deadline: <strong>{item.deadline}</strong></span>
                    </div>
                  </div>

                  {/* Application Notes */}
                  <div className="text-xs">
                    {editingNotesId === item.id ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={notesInput}
                          onChange={(e) => setNotesInput(e.target.value)}
                          placeholder="Add private notes: essays drafted, reference letters requested..."
                          className="w-full p-2.5 bg-[#FAF8F5] border border-zinc-300 rounded-xl text-xs text-zinc-800 focus:outline-none focus:border-[#D97706]"
                        />
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => setEditingNotesId(null)}
                            className="px-3 py-1 text-xs text-zinc-500 hover:text-zinc-800 font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNotes(item.id, item.status)}
                            className="px-4 py-1.5 bg-[#D97706] text-white text-xs font-bold rounded-full shadow-xs"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-zinc-600 bg-[#FAF8F5] p-2.5 rounded-xl border border-zinc-100">
                        <span className="text-xs italic">
                          {item.notes ? `Note: "${item.notes}"` : 'No application notes added yet.'}
                        </span>
                        <button
                          onClick={() => handleStartEditNotes(item)}
                          className="text-xs font-bold text-[#D97706] hover:underline flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{item.notes ? 'Edit' : 'Add Note'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Detail link */}
                  <div className="pt-1 flex items-center justify-end">
                    <Link
                      href={item.type === 'scholarship' ? `/scholarships/${item.target_id}` : `/universities/${item.target_id}`}
                      className="text-xs font-bold text-[#D97706] hover:underline inline-flex items-center gap-1"
                    >
                      <span>View Full Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Column: Deadlines Schedule */}
        <div className="space-y-6">
          
          <div className="bg-white border border-[#EDE4D3] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
              <Calendar className="w-5 h-5 text-[#D97706]" />
              <h3 className="text-base font-bold text-zinc-900">
                Upcoming Deadlines
              </h3>
            </div>

            {savedItems.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4 text-center">
                Save scholarships or universities to build your deadline timeline.
              </p>
            ) : (
              <div className="space-y-3">
                {[...savedItems]
                  .sort((a, b) => {
                    const da = getDaysRemaining(a.deadline);
                    const db = getDaysRemaining(b.deadline);
                    if (da === null && db === null) return 0;
                    if (da === null) return 1;
                    if (db === null) return -1;
                    return da - db;
                  })
                  .map((item) => {
                    const days = getDaysRemaining(item.deadline);
                    return (
                      <div
                        key={item.id}
                        className="p-3.5 bg-[#FAF8F5] border border-zinc-200/70 rounded-2xl space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase">{item.type}</span>
                          <DeadlineChip days={days} />
                        </div>
                        <h4 className="font-bold text-zinc-800 truncate">{item.title}</h4>
                        <div className="flex items-center gap-1 text-zinc-500 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>{item.deadline}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Quick Tip Box */}
          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-3xl p-6 text-xs space-y-2">
            <h4 className="font-bold text-[#92400E] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#D97706]" />
              <span>Niche Advisor Tip</span>
            </h4>
            <p className="text-zinc-700 leading-relaxed">
              Applying to 3–5 well-matched scholarships with tailored personal statements significantly boosts your probability of securing full funding.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
