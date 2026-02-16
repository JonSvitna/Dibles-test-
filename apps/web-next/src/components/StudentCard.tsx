import React from 'react';
import Link from 'next/link';
import Card from './Card';
import type { Student } from '@/lib/types';

interface StudentCardProps {
  student: Student;
}

export default function StudentCard({ student }: StudentCardProps) {
  return (
    <Link href={`/students/${student.student_id}`}>
      <Card className="p-4 hover:bg-gray-50">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {student.first_name} {student.last_name}
            </h3>
            <p className="text-sm text-gray-600">ID: {student.student_id}</p>
          </div>
          <div className="text-right">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
              Grade {student.grade}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
