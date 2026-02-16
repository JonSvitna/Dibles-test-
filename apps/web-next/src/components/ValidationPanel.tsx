import React from 'react';
import Card from './Card';

interface ValidationIssue {
  row: number;
  column: string;
  message: string;
  severity: 'error' | 'warning';
}

interface ValidationPanelProps {
  issues: ValidationIssue[];
}

export default function ValidationPanel({ issues }: ValidationPanelProps) {
  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  
  if (issues.length === 0) {
    return (
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-center gap-3">
          <div className="text-4xl">✅</div>
          <div>
            <h3 className="text-lg font-semibold text-green-800">Validation Passed</h3>
            <p className="text-sm text-green-600">No issues found. Data is ready to import.</p>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Validation Results</h3>
        <div className="flex gap-4 mt-2">
          {errorCount > 0 && (
            <span className="text-sm">
              <span className="font-semibold text-red-600">{errorCount}</span> errors
            </span>
          )}
          {warningCount > 0 && (
            <span className="text-sm">
              <span className="font-semibold text-yellow-600">{warningCount}</span> warnings
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        {issues.map((issue, index) => (
          <div
            key={index}
            className={`p-3 rounded border ${
              issue.severity === 'error'
                ? 'bg-red-50 border-red-200'
                : 'bg-yellow-50 border-yellow-200'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-lg">{issue.severity === 'error' ? '❌' : '⚠️'}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Row {issue.row}, Column: {issue.column}
                </p>
                <p className="text-sm text-gray-600 mt-1">{issue.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
