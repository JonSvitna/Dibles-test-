import type { Program, ColumnMapping, MappingProfile } from './types';

const STORAGE_KEY = 'dibles_mapping_profiles';

/**
 * Get all saved mapping profiles
 */
export function getMappingProfiles(): MappingProfile[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load mapping profiles:', error);
    return [];
  }
}

/**
 * Save a new mapping profile
 */
export function saveMappingProfile(name: string, program: Program, mapping: ColumnMapping): MappingProfile {
  const profile: MappingProfile = {
    name,
    program,
    mapping,
    createdAt: new Date().toISOString(),
  };
  
  const profiles = getMappingProfiles();
  
  // Replace if exists with same name and program
  const existingIndex = profiles.findIndex(
    (p) => p.name === name && p.program === program
  );
  
  if (existingIndex >= 0) {
    profiles[existingIndex] = profile;
  } else {
    profiles.push(profile);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  return profile;
}

/**
 * Get mapping profiles for a specific program
 */
export function getMappingProfilesByProgram(program: Program): MappingProfile[] {
  return getMappingProfiles().filter((p) => p.program === program);
}

/**
 * Delete a mapping profile
 */
export function deleteMappingProfile(name: string, program: Program): void {
  const profiles = getMappingProfiles();
  const filtered = profiles.filter(
    (p) => !(p.name === name && p.program === program)
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Auto-match columns based on common naming patterns
 */
export function autoMatchColumns(headers: string[], program: Program): ColumnMapping {
  const mapping: ColumnMapping = {};
  
  if (program === 'MAP_R') {
    const patterns: Record<string, string[]> = {
      student_id: ['student id', 'studentid', 'id', 'student_id', 'sid'],
      first_name: ['first name', 'firstname', 'first', 'fname', 'first_name'],
      last_name: ['last name', 'lastname', 'last', 'lname', 'last_name'],
      grade: ['grade', 'grade level', 'gradelevel'],
      term: ['term', 'season', 'testing term'],
      rit: ['rit', 'rit score', 'score'],
      percentile: ['percentile', 'ach_pct', 'achievement percentile', 'pct', '%ile'],
    };
    
    Object.entries(patterns).forEach(([field, variants]) => {
      const match = headers.find((h) =>
        variants.some((v) => h.toLowerCase().includes(v))
      );
      if (match) {
        mapping[field] = match;
      }
    });
  } else if (program === 'MCAP') {
    const patterns: Record<string, string[]> = {
      student_id: ['student id', 'studentid', 'id', 'student_id', 'sid'],
      first_name: ['first name', 'firstname', 'first', 'fname', 'first_name'],
      last_name: ['last name', 'lastname', 'last', 'lname', 'last_name'],
      grade: ['grade', 'grade level', 'gradelevel'],
      season: ['season', 'window', 'term', 'testing window'],
      organization_purpose: ['organization', 'organization/purpose', 'org'],
      evidence_elaboration: ['evidence', 'evidence/elaboration', 'elab'],
      conventions: ['conventions', 'conv'],
    };
    
    Object.entries(patterns).forEach(([field, variants]) => {
      const match = headers.find((h) =>
        variants.some((v) => h.toLowerCase().includes(v))
      );
      if (match) {
        mapping[field] = match;
      }
    });
  }
  
  return mapping;
}
