import * as XLSX from 'xlsx';
import type { ParsedRow } from './types';

export interface ParseResult {
  data: ParsedRow[];
  errors: string[];
  headers: string[];
}

/**
 * Parse XLSX/XLS file into structured data
 * Returns parsed rows with headers as keys
 */
export async function parseXlsx(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          resolve({
            data: [],
            errors: ['Failed to read file'],
            headers: [],
          });
          return;
        }

        // Parse workbook
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          resolve({
            data: [],
            errors: ['No sheets found in workbook'],
            headers: [],
          });
          return;
        }

        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON with header row
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          raw: false, // Convert dates and numbers to strings
          defval: '', // Default value for empty cells
        });

        if (jsonData.length === 0) {
          resolve({
            data: [],
            errors: ['No data found in sheet'],
            headers: [],
          });
          return;
        }

        // Extract headers from first row
        const headers = Object.keys(jsonData[0]);
        
        // Clean and validate data
        const cleanData: ParsedRow[] = jsonData.map((row, index) => {
          const cleanRow: ParsedRow = {};
          
          headers.forEach((header) => {
            const value = row[header];
            
            // Try to convert to number if it looks like one
            if (typeof value === 'string' && value.trim() !== '') {
              const numValue = Number(value);
              if (!isNaN(numValue) && value.trim() === numValue.toString()) {
                cleanRow[header] = numValue;
              } else {
                cleanRow[header] = value.trim();
              }
            } else if (typeof value === 'number') {
              cleanRow[header] = value;
            } else {
              cleanRow[header] = value === null || value === undefined ? '' : String(value).trim();
            }
          });
          
          return cleanRow;
        });

        resolve({
          data: cleanData,
          errors: [],
          headers,
        });
      } catch (error) {
        resolve({
          data: [],
          errors: [`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`],
          headers: [],
        });
      }
    };

    reader.onerror = () => {
      resolve({
        data: [],
        errors: ['Failed to read file'],
        headers: [],
      });
    };

    reader.readAsArrayBuffer(file);
  });
}
