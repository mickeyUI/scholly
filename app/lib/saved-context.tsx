"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SavedItem, Scholarship, University } from '../types';
import { useAuth } from './auth-context';

interface SavedContextType {
  savedItems: SavedItem[];
  isSaved: (targetId: string) => boolean;
  toggleSaveOpportunity: (item: Scholarship | University, type: 'scholarship' | 'university') => void;
  updateItemStatus: (id: string, status: SavedItem['status'], notes?: string) => void;
  removeItem: (id: string) => void;
  savedCount: number;
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      const stored = localStorage.getItem('scholly_saved_items');
      if (stored) {
        try {
          setSavedItems(JSON.parse(stored));
        } catch (e) {
          setSavedItems([]);
        }
      } else {
        // Pre-seed a couple of initial saved items for convenience
        const initialSeeds: SavedItem[] = [
          {
            id: 'init-1',
            type: 'scholarship',
            target_id: 'daad-helmut-schmidt',
            title: 'DAAD Helmut-Schmidt-Programme',
            institution_or_org: 'German Academic Exchange Service',
            country: 'Germany',
            deadline: '2026-07-31',
            funding_or_tuition: 'Fully Funded (€934/mo)',
            saved_at: new Date().toISOString(),
            status: 'In Progress',
            notes: 'Preparing Europass CV and English certificate'
          },
          {
            id: 'init-2',
            type: 'university',
            target_id: 'technical-university-munich',
            title: 'Technical University of Munich (TUM)',
            institution_or_org: 'TUM CIT',
            country: 'Germany',
            deadline: '2026-05-31',
            funding_or_tuition: '$6,500/year',
            saved_at: new Date().toISOString(),
            status: 'Saved',
            notes: 'Look into MSc Informatics requirements'
          }
        ];
        setSavedItems(initialSeeds);
        localStorage.setItem('scholly_saved_items', JSON.stringify(initialSeeds));
      }
    } else {
      setSavedItems([]);
    }
  }, [isAuthenticated]);

  const saveToStorage = (items: SavedItem[]) => {
    setSavedItems(items);
    localStorage.setItem('scholly_saved_items', JSON.stringify(items));
  };

  const isSaved = (targetId: string) => {
    return savedItems.some((item) => item.target_id === targetId);
  };

  const toggleSaveOpportunity = (item: Scholarship | University, type: 'scholarship' | 'university') => {
    if (!isAuthenticated) {
      openAuthModal('Sign in with your student account to save opportunities and track application deadlines');
      return;
    }

    const targetId = item.id || ('organization' in item ? item.organization : 'saved-item');

    if (isSaved(targetId)) {
      const filtered = savedItems.filter((i) => i.target_id !== targetId);
      saveToStorage(filtered);
    } else {
      let deadlineDate = 'Rolling';
      if ('deadlines' in item && Array.isArray((item as any).deadlines) && (item as any).deadlines.length > 0) {
        deadlineDate = (item as any).deadlines[0].date || 'Rolling';
      } else if ('university_deadlines' in item && Array.isArray(item.university_deadlines) && item.university_deadlines.length > 0) {
        deadlineDate = item.university_deadlines[0].deadline_date || 'Rolling';
      }

      let fundingOrTuition = 'Funding available';
      if ('funding_type' in item && item.funding_type) {
        fundingOrTuition = item.funding_type;
      } else if ('programs' in item && Array.isArray((item as any).programs) && (item as any).programs.length > 0) {
        fundingOrTuition = `$${(item as any).programs[0].tuition_per_year_usd?.toLocaleString()}/yr`;
      }

      const title = 'title' in item
        ? (item as any).title
        : item.organization || (item as any).name || 'Opportunity';

      const country = 'country_located' in item
        ? item.country_located
        : (item as any).country || 'Global';

      const institution = 'organization' in item
        ? item.organization
        : (item as any).name || (item as any).country || 'Institution';

      const newItem: SavedItem = {
        id: `saved-${Date.now()}`,
        type,
        target_id: targetId,
        title,
        institution_or_org: institution,
        country,
        deadline: deadlineDate,
        funding_or_tuition: fundingOrTuition,
        saved_at: new Date().toISOString(),
        status: 'Saved',
        notes: ''
      };

      saveToStorage([newItem, ...savedItems]);
    }
  };

  const updateItemStatus = (id: string, status: SavedItem['status'], notes?: string) => {
    const updated = savedItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status,
          notes: notes !== undefined ? notes : item.notes
        };
      }
      return item;
    });
    saveToStorage(updated);
  };

  const removeItem = (id: string) => {
    const filtered = savedItems.filter((item) => item.id !== id);
    saveToStorage(filtered);
  };

  return (
    <SavedContext.Provider
      value={{
        savedItems,
        isSaved,
        toggleSaveOpportunity,
        updateItemStatus,
        removeItem,
        savedCount: savedItems.length
      }}
    >
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error('useSaved must be used within a SavedProvider');
  }
  return context;
}
