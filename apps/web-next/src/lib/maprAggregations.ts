import type { MapRResult, Band, Term, BandDistribution, GradeStats, GrowthStats } from './types';
import { getStudents, getMapRResults } from './demoMode';

// Get band distribution for a specific term
export function getBandDistribution(term: Term): BandDistribution[] {
  const results = getMapRResults().filter(r => r.term === term);
  const bands: Band[] = ["Red", "Orange", "Yellow", "Green", "Blue"];
  
  const distribution: BandDistribution[] = bands.map(band => {
    const count = results.filter(r => r.band === band).length;
    const percentage = results.length > 0 ? Math.round((count / results.length) * 100) : 0;
    return { band, count, percentage };
  });
  
  return distribution;
}

// Get average RIT by grade for a specific term
export function getAverageRITByGrade(term: Term): GradeStats[] {
  const results = getMapRResults().filter(r => r.term === term);
  const students = getStudents();
  const grades = [1, 2, 3, 4, 5, 6, 7, 8];
  
  return grades.map(grade => {
    const gradeStudents = students.filter(s => s.grade === grade);
    const gradeResults = results.filter(r => 
      gradeStudents.some(s => s.student_id === r.student_id)
    );
    
    const averageRIT = gradeResults.length > 0
      ? Math.round(gradeResults.reduce((sum, r) => sum + r.rit, 0) / gradeResults.length)
      : 0;
    
    // Get band distribution for this grade
    const bands: Band[] = ["Red", "Orange", "Yellow", "Green", "Blue"];
    const bandDistribution: BandDistribution[] = bands.map(band => {
      const count = gradeResults.filter(r => r.band === band).length;
      const percentage = gradeResults.length > 0 
        ? Math.round((count / gradeResults.length) * 100) 
        : 0;
      return { band, count, percentage };
    });
    
    return {
      grade,
      averageRIT,
      studentCount: gradeStudents.length,
      bandDistribution,
    };
  });
}

// Get growth statistics (Spring RIT - Fall RIT)
export function getGrowthStats(): GrowthStats[] {
  const results = getMapRResults();
  const students = getStudents();
  const growthStats: GrowthStats[] = [];
  
  students.forEach(student => {
    const studentResults = results.filter(r => r.student_id === student.student_id);
    const fallResult = studentResults.find(r => r.term === "Fall");
    const springResult = studentResults.find(r => r.term === "Spring");
    
    if (fallResult && springResult) {
      growthStats.push({
        student_id: student.student_id,
        studentName: `${student.first_name} ${student.last_name}`,
        grade: student.grade,
        fallRIT: fallResult.rit,
        springRIT: springResult.rit,
        growth: springResult.rit - fallResult.rit,
      });
    }
  });
  
  return growthStats;
}

// Get stats for a specific grade
export function getGradeStats(grade: number, term: Term): GradeStats | null {
  const stats = getAverageRITByGrade(term);
  return stats.find(s => s.grade === grade) || null;
}
