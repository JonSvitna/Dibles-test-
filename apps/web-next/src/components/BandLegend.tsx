import React from 'react';
import type { Band } from '@/lib/types';

const bandColors: Record<Band, { bg: string; text: string; description: string }> = {
  Blue: { bg: 'bg-blue-100', text: 'text-blue-800', description: 'Advanced (95th+ percentile)' },
  Green: { bg: 'bg-green-100', text: 'text-green-800', description: 'Proficient (75th-94th percentile)' },
  Yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', description: 'Average (50th-74th percentile)' },
  Orange: { bg: 'bg-orange-100', text: 'text-orange-800', description: 'Below Average (25th-49th percentile)' },
  Red: { bg: 'bg-red-100', text: 'text-red-800', description: 'Needs Support (Below 25th percentile)' },
};

export default function BandLegend() {
  const bands: Band[] = ['Blue', 'Green', 'Yellow', 'Orange', 'Red'];
  
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Performance Bands</h3>
      <div className="space-y-2">
        {bands.map((band) => {
          const colors = bandColors[band];
          return (
            <div key={band} className="flex items-center gap-3">
              <span className={`inline-block w-4 h-4 rounded ${colors.bg} border border-gray-300`}></span>
              <span className="font-medium text-sm">{band}:</span>
              <span className="text-xs text-gray-600">{colors.description}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-gray-500 italic">
        What does this mean? Bands show how students perform compared to national norms.
      </p>
    </div>
  );
}
