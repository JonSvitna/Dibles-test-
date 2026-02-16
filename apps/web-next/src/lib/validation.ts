import type { ParsedRow, Program, ValidationIssue, ColumnMapping, Term } from './types';
import { MAPR_CONFIG, MCAP_CONFIG } from './programConfig';

/**
 * Validate imported data based on program-specific rules
 */
export function validateData(
  data: ParsedRow[],
  program: Program,
  mapping: ColumnMapping,
  selectedTerm?: Term
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const config = program === 'MAP_R' ? MAPR_CONFIG : MCAP_CONFIG;
  const seenIds = new Set<string>();

  data.forEach((row, index) => {
    const rowNumber = index + 2; // +2 because row 1 is header, and arrays are 0-indexed

    // Check required fields
    config.requiredFields.forEach((field) => {
      const columnName = mapping[field];
      if (!columnName) {
        issues.push({
          row: rowNumber,
          column: field,
          message: `Required field "${field}" is not mapped to any column.`,
          severity: 'error',
          howToFix: 'Map this field to the appropriate column in your file.',
        });
        return;
      }

      const value = row[columnName];
      if (value === '' || value === null || value === undefined) {
        issues.push({
          row: rowNumber,
          column: columnName,
          message: `Missing ${field}. This field is required.`,
          severity: 'error',
          howToFix: `Provide a value for ${field} in your data file.`,
        });
      }
    });

    // Check student ID for duplicates
    const studentIdColumn = mapping['student_id'];
    if (studentIdColumn) {
      const studentId = String(row[studentIdColumn] || '').trim();
      if (studentId) {
        if (seenIds.has(studentId)) {
          issues.push({
            row: rowNumber,
            column: studentIdColumn,
            message: `Duplicate Student ID: ${studentId}. Each student should appear only once.`,
            severity: 'error',
            howToFix: 'Remove duplicate entries or ensure each student has a unique ID.',
          });
        } else {
          seenIds.add(studentId);
        }
      }
    }

    // Check grade range
    const gradeColumn = mapping['grade'];
    if (gradeColumn && row[gradeColumn] !== '') {
      const grade = Number(row[gradeColumn]);
      if (isNaN(grade)) {
        issues.push({
          row: rowNumber,
          column: gradeColumn,
          message: 'Grade must be a number.',
          severity: 'error',
          howToFix: 'Ensure the grade is a numeric value (e.g., 1, 2, 3).',
        });
      } else if (grade < config.gradeRange.min || grade > config.gradeRange.max) {
        issues.push({
          row: rowNumber,
          column: gradeColumn,
          message: `Grade ${grade} is outside the allowed range (${config.gradeRange.min}-${config.gradeRange.max}).`,
          severity: 'error',
          howToFix: `Ensure grade is between ${config.gradeRange.min} and ${config.gradeRange.max}.`,
        });
      }
    }

    // Program-specific validation
    if (program === 'MAP_R') {
      // Validate percentile
      const percentileColumn = mapping['percentile'];
      if (percentileColumn && row[percentileColumn] !== '') {
        const percentile = Number(row[percentileColumn]);
        if (isNaN(percentile)) {
          issues.push({
            row: rowNumber,
            column: percentileColumn,
            message: 'Percentile must be a number.',
            severity: 'error',
            howToFix: 'Ensure the percentile is a numeric value between 1-99.',
          });
        } else if (
          percentile < MAPR_CONFIG.percentileRange.min ||
          percentile > MAPR_CONFIG.percentileRange.max
        ) {
          issues.push({
            row: rowNumber,
            column: percentileColumn,
            message: `Percentile ${percentile} is outside the valid range (1-99).`,
            severity: 'error',
            howToFix: 'Ensure percentile is between 1 and 99.',
          });
        }
      }

      // Validate RIT score
      const ritColumn = mapping['rit'];
      if (ritColumn && row[ritColumn] !== '') {
        const rit = Number(row[ritColumn]);
        if (isNaN(rit)) {
          issues.push({
            row: rowNumber,
            column: ritColumn,
            message: 'RIT score must be a number.',
            severity: 'error',
            howToFix: 'Ensure the RIT score is a numeric value.',
          });
        } else if (rit < MAPR_CONFIG.ritRange.min || rit > MAPR_CONFIG.ritRange.max) {
          issues.push({
            row: rowNumber,
            column: ritColumn,
            message: `RIT score ${rit} is unusual (expected range: ${MAPR_CONFIG.ritRange.min}-${MAPR_CONFIG.ritRange.max}).`,
            severity: 'warning',
            howToFix: 'Verify the RIT score is correct. This is a soft warning.',
          });
        }
      }

      // Check if term is missing and not provided
      const termColumn = mapping['term'];
      if ((!termColumn || row[termColumn] === '') && !selectedTerm) {
        issues.push({
          row: rowNumber,
          column: 'term',
          message: 'Term is missing. Please select a term for this import.',
          severity: 'warning',
          howToFix: 'Select a term (Fall, Winter, or Spring) for this import.',
        });
      }
    } else if (program === 'MCAP') {
      // Validate rubric scores
      const rubricFields = ['organization_purpose', 'evidence_elaboration', 'conventions'];
      
      rubricFields.forEach((field) => {
        const column = mapping[field];
        if (column && row[column] !== '') {
          const score = Number(row[column]);
          if (isNaN(score)) {
            issues.push({
              row: rowNumber,
              column: column,
              message: `${field} must be a number.`,
              severity: 'error',
              howToFix: 'Ensure the score is a numeric value.',
            });
          } else if (
            score < MCAP_CONFIG.rubricRange.min ||
            score > MCAP_CONFIG.rubricRange.max
          ) {
            issues.push({
              row: rowNumber,
              column: column,
              message: `${field} score ${score} is outside the valid range (${MCAP_CONFIG.rubricRange.min}-${MCAP_CONFIG.rubricRange.max}).`,
              severity: 'warning',
              howToFix: `Ensure score is between ${MCAP_CONFIG.rubricRange.min} and ${MCAP_CONFIG.rubricRange.max}.`,
            });
          }
        }
      });
    }
  });

  return issues;
}

/**
 * Get validation summary
 */
export function getValidationSummary(issues: ValidationIssue[]): string {
  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;

  if (issues.length === 0) {
    return 'All validation checks passed. Your data is ready to import.';
  }

  const parts: string[] = [];
  if (errorCount > 0) {
    parts.push(`${errorCount} error${errorCount !== 1 ? 's' : ''}`);
  }
  if (warningCount > 0) {
    parts.push(`${warningCount} warning${warningCount !== 1 ? 's' : ''}`);
  }

  return `Found ${parts.join(' and ')}. Please review before importing.`;
}
