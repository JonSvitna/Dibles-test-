import React from 'react';

interface ColumnMapping {
  source: string;
  target: string;
  status: 'matched' | 'unmapped' | 'suggested';
}

interface ColumnMapperTableProps {
  mappings: ColumnMapping[];
}

export default function ColumnMapperTable({ mappings }: ColumnMapperTableProps) {
  const statusColors = {
    matched: 'bg-green-100 text-green-800',
    unmapped: 'bg-red-100 text-red-800',
    suggested: 'bg-yellow-100 text-yellow-800',
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Source Column
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Maps To
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {mappings.map((mapping, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {mapping.source}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {mapping.target}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${statusColors[mapping.status]}`}>
                  {mapping.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
