'use client';

import type { Program } from '@/lib/types';
import Card from './Card';

interface ProgramPickerProps {
  selected: Program | null;
  onSelect: (program: Program) => void;
}

export default function ProgramPicker({ selected, onSelect }: ProgramPickerProps) {
  const programs: { id: Program; name: string; icon: string; description: string }[] = [
    {
      id: 'MAP_R',
      name: 'MAP-R',
      icon: '📊',
      description: 'MAP Reading assessment data with RIT scores and percentiles',
    },
    {
      id: 'MCAP',
      name: 'MCAP',
      icon: '📝',
      description: 'Maryland Comprehensive Assessment Program writing rubric data',
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Assessment Program</h2>
      <p className="text-gray-600 mb-6">
        Select the type of assessment data you want to import.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programs.map((program) => (
          <Card
            key={program.id}
            className={`p-6 cursor-pointer transition-all ${
              selected === program.id
                ? 'border-2 border-blue-600 bg-blue-50'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelect(program.id)}
          >
            <div className="text-center">
              <div className="text-5xl mb-3">{program.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{program.name}</h3>
              <p className="text-sm text-gray-600">{program.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
