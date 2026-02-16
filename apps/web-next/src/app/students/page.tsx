'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import StudentCard from '@/components/StudentCard';
import EmptyState from '@/components/EmptyState';
import { searchStudents } from '@/lib/demoMode';

export default function StudentsPage() {
  const [query, setQuery] = useState('');
  const students = searchStudents(query);
  const showResults = query.length > 0 || students.length <= 20;
  const displayedStudents = showResults ? students.slice(0, 50) : [];

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle="Search for a student by name or ID"
      />

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or student ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {students.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            Found {students.length} student{students.length !== 1 ? 's' : ''}
            {students.length > 50 && ' (showing first 50)'}
          </p>
        )}
      </div>

      {/* Results */}
      {displayedStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedStudents.map((student) => (
            <StudentCard key={student.student_id} student={student} />
          ))}
        </div>
      ) : query.length > 0 ? (
        <EmptyState
          title="No students found"
          description="Try a different search term"
          icon="🔍"
        />
      ) : (
        <EmptyState
          title="Start searching"
          description="Enter a student name or ID to begin"
          icon="👨‍🎓"
        />
      )}
    </div>
  );
}
