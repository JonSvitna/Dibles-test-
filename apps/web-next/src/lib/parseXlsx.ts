import ExcelJS from 'exceljs';
import type { ParsedRow } from './types';

export interface ParseResult {
  data: ParsedRow[];
  errors: string[];
  headers: string[];
}

/**
 * Parse XLSX/XLS file into structured data using ExcelJS
 * Returns parsed rows with headers as keys
 */
export async function parseXlsx(file: File): Promise<ParseResult> {
  try {
    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Create workbook and load data
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);
    
    // Get first worksheet
    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      return {
        data: [],
        errors: ['No sheets found in workbook'],
        headers: [],
      };
    }

    // Check if worksheet has data
    if (worksheet.rowCount === 0) {
      return {
        data: [],
        errors: ['No data found in sheet'],
        headers: [],
      };
    }

    // Get headers from first row
    const headerRow = worksheet.getRow(1);
    const headers: string[] = [];
    
    headerRow.eachCell({ includeEmpty: false }, (cell) => {
      const value = cell.value;
      if (value !== null && value !== undefined) {
        // Handle different cell value types
        if (typeof value === 'object' && 'text' in value) {
          headers.push(String(value.text));
        } else {
          headers.push(String(value));
        }
      }
    });

    if (headers.length === 0) {
      return {
        data: [],
        errors: ['No headers found in first row'],
        headers: [],
      };
    }

    // Parse data rows
    const data: ParsedRow[] = [];
    
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      // Skip header row
      if (rowNumber === 1) return;
      
      const rowData: ParsedRow = {};
      
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const header = headers[colNumber - 1];
        if (!header) return;
        
        const value = cell.value;
        
        // Handle different cell value types
        if (value === null || value === undefined || value === '') {
          rowData[header] = '';
        } else if (typeof value === 'number') {
          rowData[header] = value;
        } else if (typeof value === 'string') {
          // Try to convert to number if it looks like one
          const trimmed = value.trim();
          const numValue = Number(trimmed);
          if (!isNaN(numValue) && trimmed === numValue.toString()) {
            rowData[header] = numValue;
          } else {
            rowData[header] = trimmed;
          }
        } else if (typeof value === 'object') {
          // Handle rich text and formulas
          if ('text' in value) {
            rowData[header] = String(value.text).trim();
          } else if ('result' in value) {
            rowData[header] = String(value.result).trim();
          } else {
            rowData[header] = String(value).trim();
          }
        } else {
          rowData[header] = String(value).trim();
        }
      });
      
      data.push(rowData);
    });

    return {
      data,
      errors: [],
      headers,
    };
  } catch (error) {
    return {
      data: [],
      errors: [`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`],
      headers: [],
    };
  }
}
