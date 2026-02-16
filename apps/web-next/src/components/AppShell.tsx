import React from 'react';
import Nav from './Nav';
import { isDemoMode } from '@/lib/env';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const showDemoBadge = isDemoMode();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      {showDemoBadge && (
        <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2 text-center">
          <span className="inline-block bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
            Demo Mode
          </span>
          <span className="ml-2 text-sm text-yellow-800">
            Using dummy data for demonstration purposes
          </span>
        </div>
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
