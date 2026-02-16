'use client';

import type { Term } from '@/lib/types';

interface TermPickerProps {
  selected: Term;
  onSelect: (term: Term) => void;
  label?: string;
}

export default function TermPicker({ selected, onSelect, label = 'Select Term' }: TermPickerProps) {
  const terms: Term[] = ['Fall', 'Winter', 'Spring'];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex gap-2">
        {terms.map((term) => (
          <button
            key={term}
            onClick={() => onSelect(term)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selected === term
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
