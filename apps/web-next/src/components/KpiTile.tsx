import React from 'react';
import Card from './Card';

interface KpiTileProps {
  label: string;
  value: string | number;
  icon?: string;
  helpText?: string;
}

export default function KpiTile({ label, value, icon, helpText }: KpiTileProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {helpText && (
            <p className="mt-2 text-xs text-gray-500 italic">{helpText}</p>
          )}
        </div>
        {icon && <div className="text-3xl">{icon}</div>}
      </div>
    </Card>
  );
}
