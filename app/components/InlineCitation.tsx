"use client";

import React from 'react';
import { ExternalLink } from 'lucide-react';

interface InlineCitationProps {
  sourceName: string;
  sourceUrl?: string;
  className?: string;
  verificationDate?: string;
}

export default function InlineCitation({
  sourceName,
  sourceUrl,
  className = '',
  verificationDate
}: InlineCitationProps) {
  if (!sourceUrl) {
    return (
      <span
        title={verificationDate ? `Source: ${sourceName} • Verified: ${verificationDate}` : `Source: ${sourceName}`}
        className={`text-[11px] font-medium text-[#92400E] bg-[#FEF3C7]/90 px-1.5 py-0.5 rounded-md border border-[#FDE68A] inline-flex items-center gap-1 select-none ${className}`}
      >
        <span>[src: {sourceName}]</span>
      </span>
    );
  }

  return (
    <a
      href={sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={verificationDate ? `Source: ${sourceName} • Verified: ${verificationDate}` : `Source: ${sourceName}`}
      className={`text-[11px] font-medium text-[#92400E] hover:text-[#78350F] bg-[#FFFBEB] hover:bg-[#FEF3C7] px-1.5 py-0.5 rounded-md border border-[#FDE68A] inline-flex items-center gap-1 transition-colors no-underline ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <span>[src: {sourceName}]</span>
      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
    </a>
  );
}
