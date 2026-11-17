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
        className={`text-[11px] font-semibold text-[#1b263b] bg-[rgba(65,90,119,0.08)] px-2.5 py-0.5 rounded-full border border-[rgba(119,141,169,0.35)] inline-flex items-center gap-1 select-none ${className}`}
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
      className={`text-[11px] font-semibold text-[#1b263b] hover:text-white bg-[rgba(65,90,119,0.08)] hover:bg-[#1b263b] hover:border-[#1b263b] px-2.5 py-0.5 rounded-full border border-[rgba(119,141,169,0.35)] inline-flex items-center gap-1 transition-all no-underline cursor-pointer group shadow-2xs ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <span>[src: {sourceName}]</span>
      <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover:opacity-100" />
    </a>
  );
}
