import type { Student, MapRResult, StudentWithResults } from './types';
import { getStudents as getStoredStudents, getMapRResults as getStoredResults, getMCAPResults } from './storage';

// Get all students
export function getStudents(): Student[] {
  return getStoredStudents();
}

// Get all MAP-R results
export function getMapRResults(): MapRResult[] {
  return getStoredResults();
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
  const mcapResults = getMCAPResults().filter(r => r.student_id === studentId);
  
  return {
    ...student,
    results,
    mcapResults: mcapResults.length > 0 ? mcapResults : undefined,
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
