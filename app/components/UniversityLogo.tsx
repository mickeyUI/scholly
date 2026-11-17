"use client";

import React, { useState } from 'react';

interface UniversityLogoProps {
  name: string;
  logoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function UniversityLogo({
  name,
  logoUrl,
  size = 'md',
  className = ''
}: UniversityLogoProps) {
  const [hasError, setHasError] = useState(false);

  const initial = (name || 'U').trim().charAt(0).toUpperCase();

  // Size configurations adhering to circular medallion specifications
  const sizeConfig = {
    sm: {
      container: 'w-9 h-9 rounded-full p-1',
      sealClass: 'w-9 h-9 text-sm',
    },
    md: {
      container: 'w-12 h-12 rounded-full p-1.5',
      sealClass: 'w-12 h-12 text-lg',
    },
    lg: {
      container: 'w-16 h-16 md:w-20 md:h-20 rounded-full p-2.5',
      sealClass: 'w-16 h-16 md:w-20 md:h-20 text-2xl md:text-3xl',
    }
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;

  if (logoUrl && !hasError) {
    return (
      <div
        className={`relative flex items-center justify-center bg-white rounded-full border-2 border-[rgba(119,141,169,0.25)] shadow-xs flex-shrink-0 transition-transform group-hover:scale-105 overflow-hidden ${currentSize.container} ${className}`}
        title={`${name} Logo`}
      >
        <img
          src={logoUrl}
          alt={`${name} Logo`}
          className="w-full h-full object-contain object-center"
          loading="lazy"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  // Fallback to collegiate circular crest medallion in #1b263b with white serif initial
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-[#1b263b] text-white font-serif font-bold border-2 border-[rgba(119,141,169,0.25)] shadow-xs flex-shrink-0 select-none ${currentSize.sealClass} ${className}`}
      title={`${name} Crest`}
    >
      <span className="drop-shadow-xs">{initial}</span>
    </div>
  );
}
