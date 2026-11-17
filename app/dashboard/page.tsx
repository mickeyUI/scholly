"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  CheckCircle2,
  Award,
  GraduationCap,
  Trash2,
  Edit3,
  ArrowRight,
  Heart,
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
    return <span className="text-xs font-bold text-[#778da9]">Rolling</span>;
  if (days < 0)
    return <span className="text-xs font-bold text-[#778da9] line-through">Closed</span>;
  if (days <= 30)
    return (
      <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-red-100 text-red-800 border border-red-200">
        {days}d left
      </span>
    );
  if (days <= 90)
    return (
      <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[rgba(65,90,119,0.15)] text-[#1b263b] border border-[rgba(119,141,169,0.4)]">
        {days}d left
      </span>
    );
  return (
    <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[rgba(65,90,119,0.08)] text-[#0d1b2a] border border-[rgba(119,141,169,0.35)]">
      {days}d left
    </span>
  );
}

export default function DashboardPage() {
  return (
    <AuthGate
      featureName="My Saved List & Deadlines"
      description="Keep track of institutions you love, monitor critical admissions deadlines, and record personal preparation notes in your private student workspace."
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
      <div className="bg-white border border-[rgba(119,141,169,0.3)] rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-4px_rgba(13,27,42,0.08),0_2px_6px_-1px_rgba(13,27,42,0.04)] mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0d1b2a] via-[#1b263b] to-[#415a77]" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#415a77] uppercase tracking-[0.05em] mb-1">
              <Heart className="w-4 h-4 fill-current text-[#1b263b]" />
              <span>My Collegiate &amp; Scholarship Portfolio</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0d1b2a] tracking-tight">
              Welcome back, {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student'}
            </h1>
            <p className="text-xs sm:text-sm text-[#415a77] mt-1">
              Track deadlines, monitor your application progress, and organize your saved opportunities.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/profile"
              className="px-4 py-2 text-xs font-bold rounded-full bg-[#f3f4f0] hover:bg-[#e0e1dd]/40 text-[#0d1b2a] border border-[rgba(119,141,169,0.35)] transition-colors"
            >
              My Preferences
            </Link>
            <Link
              href="/assistant"
              className="px-5 py-2 text-xs font-bold rounded-full bg-[#1b263b] text-white hover:bg-[#0d1b2a] shadow-xs transition-colors"
            >
              Ask AI Advisor
            </Link>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[rgba(119,141,169,0.2)] text-xs">
          <div className="p-3.5 bg-[#f3f4f0] rounded-xl border border-[rgba(119,141,169,0.25)]">
            <span className="text-[11px] font-bold text-[#415a77] uppercase tracking-[0.05em] block">Total Saved</span>
            <span className="text-2xl font-serif font-bold text-[#0d1b2a] mt-0.5 block">{totalSaved}</span>
          </div>

          <div className="p-3.5 bg-[rgba(65,90,119,0.08)] rounded-xl border border-[rgba(119,141,169,0.35)]">
            <span className="text-[11px] font-bold text-[#1b263b] uppercase tracking-[0.05em] block">In Progress</span>
            <span className="text-2xl font-serif font-bold text-[#1b263b] mt-0.5 block">{inProgressCount}</span>
          </div>

          <div className="p-3.5 bg-[#f3f4f0] rounded-xl border border-[rgba(119,141,169,0.25)]">
            <span className="text-[11px] font-bold text-[#415a77] uppercase tracking-[0.05em] block">Submitted</span>
            <span className="text-2xl font-serif font-bold text-[#0d1b2a] mt-0.5 block">{submittedCount}</span>
          </div>

          <div className="p-3.5 bg-[#f3f4f0] rounded-xl border border-[rgba(119,141,169,0.25)]">
            <span className="text-[11px] font-bold text-[#415a77] uppercase tracking-[0.05em] block">Target Degree</span>
            <span className="text-base font-serif font-bold text-[#0d1b2a] mt-1 block truncate">
              {profile?.target_degree_level || 'Master’s'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Saved Items + Deadlines Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Bookmarked Opportunities */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(119,141,169,0.25)]">
            <h2 className="text-lg font-serif font-bold text-[#0d1b2a]">
              Saved Opportunities
            </h2>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#f3f4f0] p-1 rounded-full text-xs border border-[rgba(119,141,169,0.35)]">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-[#1b263b] text-white shadow-xs'
                    : 'text-[#415a77] hover:text-[#0d1b2a]'
                }`}
              >
                All ({savedItems.length})
              </button>
              <button
                onClick={() => setFilterType('scholarship')}
                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  filterType === 'scholarship'
                    ? 'bg-[#1b263b] text-white shadow-xs'
                    : 'text-[#415a77] hover:text-[#0d1b2a]'
                }`}
              >
                Scholarships
              </button>
              <button
                onClick={() => setFilterType('university')}
                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  filterType === 'university'
                    ? 'bg-[#1b263b] text-white shadow-xs'
                    : 'text-[#415a77] hover:text-[#0d1b2a]'
                }`}
              >
                Colleges
              </button>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-[rgba(119,141,169,0.35)]">
              <Heart className="w-10 h-10 text-[#778da9] mx-auto mb-3" />
              <h3 className="text-base font-serif font-bold text-[#0d1b2a] mb-1">
                Your saved list is empty.
              </h3>
              <p className="text-xs text-[#415a77] mb-5 max-w-sm mx-auto">
                Explore colleges and scholarships and click the bookmark icon on any card to save them here.
              </p>
              <div className="flex items-center justify-center gap-2">
                <Link
                  href="/scholarships"
                  className="px-5 py-2.5 bg-[#1b263b] hover:bg-[#0d1b2a] text-white text-xs font-bold rounded-full shadow-xs transition-colors"
                >
                  Discover Scholarships
                </Link>
                <Link
                  href="/universities"
                  className="px-5 py-2.5 bg-[#f3f4f0] hover:bg-[#e0e1dd]/40 text-[#0d1b2a] text-xs font-bold rounded-full border border-[rgba(119,141,169,0.35)] transition-colors"
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
                  className="bg-white border border-[rgba(119,141,169,0.3)] hover:border-[#1b263b] rounded-2xl p-5 shadow-[0_10px_30px_-4px_rgba(13,27,42,0.06)] transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[rgba(65,90,119,0.08)] border border-[rgba(119,141,169,0.35)] text-[#0d1b2a] uppercase tracking-wider">
                          {item.type}
                        </span>
                        <span className="text-xs text-[#415a77] font-medium">{item.country}</span>
                      </div>
                      <h3 className="text-base font-serif font-bold text-[#0d1b2a]">
                        <Link
                          href={item.type === 'scholarship' ? `/scholarships/${item.target_id}` : `/universities/${item.target_id}`}
                          className="hover:text-[#1b263b] transition-colors"
                        >
                          {item.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-[#778da9]">{item.institution_or_org}</p>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      title="Remove bookmark"
                      className="p-1.5 text-[#778da9] hover:text-red-600 rounded-full transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Status Selector & Value Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 py-2 border-y border-[rgba(119,141,169,0.15)] text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#415a77]">Status:</span>
                      <select
                        value={item.status}
                        onChange={(e) => updateItemStatus(item.id, e.target.value as any, item.notes)}
                        className={`text-xs font-bold rounded-full px-3 py-1 border focus:outline-none cursor-pointer ${
                          item.status === 'Accepted'
                            ? 'bg-[rgba(65,90,119,0.15)] text-[#0d1b2a] border-[rgba(119,141,169,0.4)]'
                            : item.status === 'Submitted'
                            ? 'bg-[#1b263b] text-white border-[#1b263b]'
                            : item.status === 'In Progress'
                            ? 'bg-[rgba(65,90,119,0.08)] text-[#1b263b] border-[rgba(119,141,169,0.35)]'
                            : 'bg-[#f3f4f0] text-[#415a77] border-[rgba(119,141,169,0.3)]'
                        }`}
                      >
                        <option value="Saved">Saved</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Accepted">Accepted</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3 text-[#415a77] text-xs">
                      <span>Value: <strong className="text-[#0d1b2a]">{item.funding_or_tuition}</strong></span>
                      <span>Deadline: <strong className="text-[#0d1b2a]">{item.deadline}</strong></span>
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
                          className="w-full p-2.5 bg-[#f3f4f0] border border-[rgba(119,141,169,0.35)] rounded-xl text-xs text-[#0d1b2a] focus:outline-none focus:border-[#1b263b]"
                        />
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => setEditingNotesId(null)}
                            className="px-3 py-1 text-xs text-[#415a77] hover:text-[#0d1b2a] font-medium cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNotes(item.id, item.status)}
                            className="px-4 py-1.5 bg-[#1b263b] text-white text-xs font-bold rounded-full shadow-xs hover:bg-[#0d1b2a] cursor-pointer"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-[#415a77] bg-[#f3f4f0] p-2.5 rounded-xl border border-[rgba(119,141,169,0.25)]">
                        <span className="text-xs italic">
                          {item.notes ? `Note: "${item.notes}"` : 'No application notes added yet.'}
                        </span>
                        <button
                          onClick={() => handleStartEditNotes(item)}
                          className="text-xs font-bold text-[#1b263b] hover:text-[#0d1b2a] flex items-center gap-1 cursor-pointer"
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
                      className="text-xs font-bold text-[#1b263b] hover:text-[#0d1b2a] inline-flex items-center gap-1"
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
          
          <div className="bg-white border border-[rgba(119,141,169,0.3)] rounded-2xl p-6 shadow-[0_10px_30px_-4px_rgba(13,27,42,0.08)] space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[rgba(119,141,169,0.2)]">
              <Calendar className="w-5 h-5 text-[#415a77]" />
              <h3 className="text-base font-serif font-bold text-[#0d1b2a]">
                Upcoming Deadlines
              </h3>
            </div>

            {savedItems.length === 0 ? (
              <p className="text-xs text-[#778da9] py-4 text-center">
                Save opportunities to build your personal deadline timeline.
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
                        className="p-3.5 bg-[#f3f4f0] border border-[rgba(119,141,169,0.25)] rounded-xl space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#415a77] uppercase tracking-wider">{item.type}</span>
                          <DeadlineChip days={days} />
                        </div>
                        <h4 className="font-serif font-bold text-[#0d1b2a] truncate">{item.title}</h4>
                        <div className="flex items-center gap-1.5 text-[#778da9] text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-[#415a77]" />
                          <span>{item.deadline}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Quick Tip Box */}
          <div className="bg-[#f3f4f0] border border-[rgba(119,141,169,0.35)] rounded-2xl p-6 text-xs space-y-2">
            <h4 className="font-bold text-[#1b263b] uppercase tracking-[0.05em] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#1b263b]" />
              <span>Collegiate Admissions Insight</span>
            </h4>
            <p className="text-[#415a77] leading-relaxed">
              Applying to 3–5 well-matched institutions with tailored statement of purpose letters significantly raises your admissions and funding rate.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
