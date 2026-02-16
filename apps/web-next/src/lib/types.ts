// Core Program Types
export type Program = "MAP_R" | "MCAP";
export type Term = "Fall" | "Winter" | "Spring";
export type Band = "Red" | "Orange" | "Yellow" | "Green" | "Blue";

// Student Information
export type Student = {
  student_id: string;
  first_name: string;
  last_name: string;
  grade: number;
};

// MAP-R Assessment Result
export type MapRResult = {
  student_id: string;
  term: Term;
  rit: number;
  ach_pct: number;
  band: Band;
};

// Combined Student with Results
export type StudentWithResults = Student & {
  results: MapRResult[];
};

// Aggregation Types for Reports
export type BandDistribution = {
  band: Band;
  count: number;
  percentage: number;
};

export type GradeStats = {
  grade: number;
  averageRIT: number;
  studentCount: number;
  bandDistribution: BandDistribution[];
};

export type GrowthStats = {
  student_id: string;
  studentName: string;
  grade: number;
  fallRIT: number;
  springRIT: number;
  growth: number;
};
