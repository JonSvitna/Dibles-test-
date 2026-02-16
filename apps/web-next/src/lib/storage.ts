import type {
  Student,
  MapRResult,
  MCAPResult,
  StorageData,
  ImportMetadata,
  Program,
  Term,
  Season,
} from './types';
import { getDummyData } from './maprDummy';
import { getBandFromPercentile } from './programConfig';

const STORAGE_KEY = 'dibles_data';
const MODE_KEY = 'dibles_mode';

/**
 * Get current data mode (demo or live)
 */
export function getDataMode(): 'demo' | 'live' {
  if (typeof window === 'undefined') return 'demo';
  
  try {
    const mode = localStorage.getItem(MODE_KEY);
    return mode === 'live' ? 'live' : 'demo';
  } catch {
    return 'demo';
  }
}

/**
 * Set data mode
 */
export function setDataMode(mode: 'demo' | 'live'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MODE_KEY, mode);
}

/**
 * Get stored data or demo data
 */
export function getStorageData(): StorageData {
  const mode = getDataMode();
  
  if (mode === 'demo') {
    const dummy = getDummyData();
    return {
      students: dummy.students,
      maprResults: dummy.results,
      mcapResults: [],
      importMetadata: null,
      mode: 'demo',
    };
  }
  
  // Live mode - get from localStorage
  if (typeof window === 'undefined') {
    return {
      students: [],
      maprResults: [],
      mcapResults: [],
      importMetadata: null,
      mode: 'live',
    };
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        students: [],
        maprResults: [],
        mcapResults: [],
        importMetadata: null,
        mode: 'live',
      };
    }
    
    const data = JSON.parse(stored);
    return {
      ...data,
      mode: 'live',
    };
  } catch (error) {
    console.error('Failed to load data from storage:', error);
    return {
      students: [],
      maprResults: [],
      mcapResults: [],
      importMetadata: null,
      mode: 'live',
    };
  }
}

/**
 * Save data to localStorage
 */
export function saveStorageData(data: Partial<StorageData>): void {
  if (typeof window === 'undefined') return;
  
  const current = getStorageData();
  const updated = {
    students: data.students ?? current.students,
    maprResults: data.maprResults ?? current.maprResults,
    mcapResults: data.mcapResults ?? current.mcapResults,
    importMetadata: data.importMetadata ?? current.importMetadata,
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  
  // Switch to live mode when data is saved
  setDataMode('live');
}

/**
 * Reset data (return to demo mode)
 */
export function resetData(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(STORAGE_KEY);
  setDataMode('demo');
}

/**
 * Import MAP-R data from parsed rows
 */
export function importMapRData(
  parsedData: any[],
  mapping: { [key: string]: string },
  selectedTerm: Term,
  metadata: Omit<ImportMetadata, 'timestamp' | 'rowCount' | 'validationPassed'>
): void {
  const currentData = getStorageData();
  
  // Build students map (to avoid duplicates)
  const studentsMap = new Map<string, Student>();
  currentData.students.forEach((s) => studentsMap.set(s.student_id, s));
  
  const newResults: MapRResult[] = [];
  
  parsedData.forEach((row) => {
    const studentId = String(row[mapping['student_id']] || '').trim();
    if (!studentId) return;
    
    // Add or update student
    if (!studentsMap.has(studentId)) {
      studentsMap.set(studentId, {
        student_id: studentId,
        first_name: String(row[mapping['first_name']] || '').trim(),
        last_name: String(row[mapping['last_name']] || '').trim(),
        grade: Number(row[mapping['grade']] || 0),
      });
    }
    
    // Determine term
    let term: Term = selectedTerm;
    if (mapping['term'] && row[mapping['term']]) {
      const termValue = String(row[mapping['term']]).trim();
      if (termValue === 'Fall' || termValue === 'Winter' || termValue === 'Spring') {
        term = termValue;
      }
    }
    
    // Create result
    const rit = Number(row[mapping['rit']] || 0);
    const percentile = Number(row[mapping['percentile']] || 0);
    const band = getBandFromPercentile(percentile);
    
    newResults.push({
      student_id: studentId,
      term,
      rit,
      ach_pct: percentile,
      band,
    });
  });
  
  // Merge with existing data (replace results for same student/term)
  const existingResults = currentData.maprResults.filter(
    (r) => !newResults.some((n) => n.student_id === r.student_id && n.term === r.term)
  );
  
  const importMetadataWithTimestamp: ImportMetadata = {
    ...metadata,
    timestamp: new Date().toISOString(),
    rowCount: parsedData.length,
    validationPassed: true,
  };
  
  saveStorageData({
    students: Array.from(studentsMap.values()),
    maprResults: [...existingResults, ...newResults],
    importMetadata: importMetadataWithTimestamp,
  });
}

/**
 * Import MCAP data from parsed rows
 */
export function importMCAPData(
  parsedData: any[],
  mapping: { [key: string]: string },
  selectedSeason: Season,
  metadata: Omit<ImportMetadata, 'timestamp' | 'rowCount' | 'validationPassed'>
): void {
  const currentData = getStorageData();
  
  // Build students map (to avoid duplicates)
  const studentsMap = new Map<string, Student>();
  currentData.students.forEach((s) => studentsMap.set(s.student_id, s));
  
  const newResults: MCAPResult[] = [];
  
  parsedData.forEach((row) => {
    const studentId = String(row[mapping['student_id']] || '').trim();
    if (!studentId) return;
    
    // Add or update student
    if (!studentsMap.has(studentId)) {
      studentsMap.set(studentId, {
        student_id: studentId,
        first_name: String(row[mapping['first_name']] || '').trim(),
        last_name: String(row[mapping['last_name']] || '').trim(),
        grade: Number(row[mapping['grade']] || 0),
      });
    }
    
    // Determine season
    let season: Season = selectedSeason;
    if (mapping['season'] && row[mapping['season']]) {
      const seasonValue = String(row[mapping['season']]).trim();
      if (seasonValue === 'Fall' || seasonValue === 'Winter' || seasonValue === 'Spring') {
        season = seasonValue;
      }
    }
    
    // Get rubric scores
    const orgPurpose = mapping['organization_purpose'] ? Number(row[mapping['organization_purpose']] || 0) : undefined;
    const evidence = mapping['evidence_elaboration'] ? Number(row[mapping['evidence_elaboration']] || 0) : undefined;
    const conventions = mapping['conventions'] ? Number(row[mapping['conventions']] || 0) : undefined;
    
    // Calculate total and performance label
    let totalScore: number | undefined;
    let performanceLabel: string | undefined;
    
    if (orgPurpose !== undefined && evidence !== undefined && conventions !== undefined) {
      totalScore = orgPurpose + evidence + conventions;
      
      // Simple performance levels
      if (totalScore <= 4) performanceLabel = 'Below Basic';
      else if (totalScore <= 7) performanceLabel = 'Basic';
      else if (totalScore <= 10) performanceLabel = 'Proficient';
      else performanceLabel = 'Advanced';
    }
    
    newResults.push({
      student_id: studentId,
      season,
      organization_purpose: orgPurpose,
      evidence_elaboration: evidence,
      conventions,
      total_score: totalScore,
      performance_label: performanceLabel,
    });
  });
  
  // Merge with existing data
  const existingResults = currentData.mcapResults.filter(
    (r) => !newResults.some((n) => n.student_id === r.student_id && n.season === r.season)
  );
  
  const importMetadataWithTimestamp: ImportMetadata = {
    ...metadata,
    timestamp: new Date().toISOString(),
    rowCount: parsedData.length,
    validationPassed: true,
  };
  
  saveStorageData({
    students: Array.from(studentsMap.values()),
    mcapResults: [...existingResults, ...newResults],
    importMetadata: importMetadataWithTimestamp,
  });
}

/**
 * Get all students
 */
export function getStudents(): Student[] {
  return getStorageData().students;
}

/**
 * Get all MAP-R results
 */
export function getMapRResults(): MapRResult[] {
  return getStorageData().maprResults;
}

/**
 * Get all MCAP results
 */
export function getMCAPResults(): MCAPResult[] {
  return getStorageData().mcapResults;
}

/**
 * Get import metadata
 */
export function getImportMetadata(): ImportMetadata | null {
  return getStorageData().importMetadata;
}
