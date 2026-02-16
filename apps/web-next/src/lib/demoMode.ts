import { getDummyData } from './maprDummy';
import type { Student, MapRResult, StudentWithResults } from './types';
import { isDemoMode } from './env';

// Get all students
export function getStudents(): Student[] {
  if (isDemoMode()) {
    return getDummyData().students;
  }
  // TODO: Fetch from API in future
  return [];
}

// Get all MAP-R results
export function getMapRResults(): MapRResult[] {
  if (isDemoMode()) {
    return getDummyData().results;
  }
  // TODO: Fetch from API in future
  return [];
}

// Get a single student by ID
export function getStudentById(studentId: string): Student | undefined {
  const students = getStudents();
  return students.find(s => s.student_id === studentId);
}

// Get results for a specific student
export function getStudentResults(studentId: string): MapRResult[] {
  const results = getMapRResults();
  return results.filter(r => r.student_id === studentId);
}

// Get student with all their results
export function getStudentWithResults(studentId: string): StudentWithResults | undefined {
  const student = getStudentById(studentId);
  if (!student) return undefined;
  
  const results = getStudentResults(studentId);
  return {
    ...student,
    results,
  };
}

// Search students by name or ID
export function searchStudents(query: string): Student[] {
  const students = getStudents();
  const lowerQuery = query.toLowerCase().trim();
  
  if (!lowerQuery) return students;
  
  return students.filter(s => 
    s.student_id.toLowerCase().includes(lowerQuery) ||
    s.first_name.toLowerCase().includes(lowerQuery) ||
    s.last_name.toLowerCase().includes(lowerQuery) ||
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(lowerQuery)
  );
}
