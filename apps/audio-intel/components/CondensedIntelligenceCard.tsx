'use client';

import React from 'react';
import {
  parseIntelligenceFields,
  formatForWeb,
  hasIntelligence,
} from '../utils/intelligenceFormatter';

interface CondensedIntelligenceCardProps {
  intelligence?: string;
  confidence?: string;
  className?: string;
}

/**
 * Condensed Intelligence Card
 *
 * Displays contact enrichment intelligence in a clean, scannable 6-field format.
 * Replaces wall-of-text intelligence displays with key information only.
 */
export function CondensedIntelligenceCard({
  intelligence,
  confidence,
  className = '',
}: CondensedIntelligenceCardProps) {
  // Check if we have meaningful intelligence data
  if (!hasIntelligence(intelligence)) {
    return (
      <div className={`bg-gray-50 border-2 border-gray-200 rounded-lg p-4 ${className}`}>
        <p className="text-xs text-gray-600">No intelligence found for this contact</p>
      </div>
    );
  }

  // Parse intelligence string into structured fields
  const intelligenceFields = parseIntelligenceFields(intelligence!);
  const webFields = formatForWeb(intelligenceFields);

  // If no fields extracted, show original text
  if (webFields.length === 0) {
    return (
      <div className={`bg-gray-50 border-2 border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="text-sm text-gray-700 font-medium whitespace-pre-line">{intelligence}</div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 border-2 border-gray-200 rounded-lg p-4 ${className}`}>
      {/* Condensed Key Intelligence - Max 6 fields in scannable format */}
      <div className="grid gap-1.5">
        {webFields.map((field, idx) => (
          <div key={idx} className="flex text-xs">
            <span className="font-semibold text-gray-800 min-w-[80px] sm:min-w-[100px]">
              {field.label}:
            </span>
            <span className="text-gray-700 flex-1">{field.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
