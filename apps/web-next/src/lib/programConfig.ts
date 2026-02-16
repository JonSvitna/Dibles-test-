import type { Program, Band } from './types';

/**
 * Program-specific configuration
 */

// MAP-R Configuration
export const MAPR_CONFIG = {
  requiredFields: ['student_id', 'first_name', 'last_name', 'grade', 'rit', 'percentile'],
  optionalFields: ['term'],
  
  // Band cutoffs based on percentile
  bandCutoffs: {
    blue: 81,
    green: 61,
    yellow: 41,
    orange: 21,
    red: 1,
  },
  
  // RIT score ranges
  ritRange: {
    min: 100,
    max: 300,
  },
  
  // Grade range
  gradeRange: {
    min: 0,
    max: 12,
  },
  
  // Percentile range
  percentileRange: {
    min: 1,
    max: 99,
  },
};

// MCAP Configuration
export const MCAP_CONFIG = {
  requiredFields: ['student_id', 'first_name', 'last_name', 'grade'],
  optionalFields: ['season', 'organization_purpose', 'evidence_elaboration', 'conventions'],
  
  // Grade range
  gradeRange: {
    min: 0,
    max: 12,
  },
  
  // Rubric score ranges (0-4 scale typically)
  rubricRange: {
    min: 0,
    max: 4,
  },
  
  // Performance level cutoffs (simple district-configurable)
  performanceLevels: [
    { label: 'Below Basic', maxScore: 4 },
    { label: 'Basic', maxScore: 7 },
    { label: 'Proficient', maxScore: 10 },
    { label: 'Advanced', maxScore: 12 },
  ],
};

/**
 * Get configuration for a specific program
 */
export function getProgramConfig(program: Program) {
  return program === 'MAP_R' ? MAPR_CONFIG : MCAP_CONFIG;
}

/**
 * Get required fields for a program
 */
export function getRequiredFields(program: Program): string[] {
  const config = getProgramConfig(program);
  return config.requiredFields;
}

/**
 * Calculate band from percentile for MAP-R
 */
export function getBandFromPercentile(percentile: number): Band {
  const { bandCutoffs } = MAPR_CONFIG;
  
  if (percentile >= bandCutoffs.blue) return 'Blue';
  if (percentile >= bandCutoffs.green) return 'Green';
  if (percentile >= bandCutoffs.yellow) return 'Yellow';
  if (percentile >= bandCutoffs.orange) return 'Orange';
  return 'Red';
}

/**
 * Calculate MCAP performance label from total score
 */
export function getMCAPPerformanceLabel(totalScore: number): string {
  const { performanceLevels } = MCAP_CONFIG;
  
  for (const level of performanceLevels) {
    if (totalScore <= level.maxScore) {
      return level.label;
    }
  }
  
  return performanceLevels[performanceLevels.length - 1].label;
}

/**
 * Get band color for display
 */
export function getBandColor(band: Band): string {
  const colors: Record<Band, string> = {
    Red: 'bg-red-100 text-red-800 border-red-200',
    Orange: 'bg-orange-100 text-orange-800 border-orange-200',
    Yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Green: 'bg-green-100 text-green-800 border-green-200',
    Blue: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  
  return colors[band];
}
