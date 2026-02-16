import Papa from 'papaparse';
import type { ParsedRow } from './types';

export interface ParseResult {
  data: ParsedRow[];
  errors: string[];
  headers: string[];
}

/**
 * Parse CSV file into structured data
 * Returns parsed rows with headers as keys
 */
export async function parseCsv(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const errors: string[] = [];
        
        // Check for parsing errors
        if (results.errors && results.errors.length > 0) {
          results.errors.forEach((error) => {
            errors.push(`Row ${error.row}: ${error.message}`);
          });
        }

        // Get headers from meta
        const headers = results.meta.fields || [];
        
        // Clean and validate data
        const data = results.data.map((row: any, index: number) => {
          const cleanRow: ParsedRow = {};
          
          headers.forEach((header) => {
            const value = row[header];
            // Convert to string or number
            if (value === null || value === undefined || value === '') {
              cleanRow[header] = '';
            } else if (typeof value === 'number') {
              cleanRow[header] = value;
            } else {
              cleanRow[header] = String(value).trim();
            }
          });
          
          return cleanRow;
        });

        resolve({
          data,
          errors,
          headers,
        });
      },
      error: (error) => {
        resolve({
          data: [],
          errors: [error.message],
          headers: [],
        });
      },
    });
  });
}
