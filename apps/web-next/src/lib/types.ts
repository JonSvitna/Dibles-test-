// Core Program Types
export type Program = "MAP_R" | "MCAP";
export type Term = "Fall" | "Winter" | "Spring";
export type Band = "Red" | "Orange" | "Yellow" | "Green" | "Blue";
export type Season = "Fall" | "Winter" | "Spring";

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

// MCAP Assessment Result
export type MCAPResult = {
  student_id: string;
  season: Season;
  organization_purpose?: number;
  evidence_elaboration?: number;
  conventions?: number;
  total_score?: number;
  performance_label?: string;
};

// Combined Student with Results
export type StudentWithResults = Student & {
  results: MapRResult[];
  mcapResults?: MCAPResult[];
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

// Validation Types
export type ValidationIssue = {
  row: number;
  column: string;
  message: string;
  severity: 'error' | 'warning';
  howToFix?: string;
};

// Import Metadata
export type ImportMetadata = {
  timestamp: string;
  fileName: string;
  program: Program;
  mappingProfileUsed?: string;
  rowCount: number;
  validationPassed: boolean;
};

// Column Mapping
export type ColumnMapping = {
  [key: string]: string; // Maps from required field to actual column name
};

export type MappingProfile = {
  name: string;
  program: Program;
  mapping: ColumnMapping;
  createdAt: string;
};

// Parsed Data
export type ParsedRow = {
  [key: string]: string | number;
};

// Storage Data
export type StorageData = {
  students: Student[];
  maprResults: MapRResult[];
  mcapResults: MCAPResult[];
  importMetadata: ImportMetadata | null;
  mode: 'demo' | 'live';
};
