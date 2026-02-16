import React from 'react';
import Card from './Card';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
}

export default function EmptyState({ title, description, icon = '📭' }: EmptyStateProps) {
  return (
    <Card className="p-12 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      {description && <p className="text-gray-500">{description}</p>}
    </Card>
  );
}
