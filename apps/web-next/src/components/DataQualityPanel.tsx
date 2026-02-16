'use client';

import type { ValidationIssue } from '@/lib/types';
import Card from './Card';

interface DataQualityPanelProps {
  issues: ValidationIssue[];
}

export default function DataQualityPanel({ issues }: DataQualityPanelProps) {
  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;

  if (issues.length === 0) {
    return (
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-center gap-3">
          <div className="text-4xl">✅</div>
          <div>
            <h3 className="text-lg font-semibold text-green-800">All Checks Passed</h3>
            <p className="text-sm text-green-600">
              No data quality issues found. Your data is ready to import.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Data Quality Summary</h3>
          <div className="flex gap-4">
            {errorCount > 0 && (
              <span className="text-sm">
                <span className="font-semibold text-red-600">{errorCount}</span>{' '}
                {errorCount === 1 ? 'error' : 'errors'}
              </span>
            )}
            {warningCount > 0 && (
              <span className="text-sm">
                <span className="font-semibold text-yellow-600">{warningCount}</span>{' '}
                {warningCount === 1 ? 'warning' : 'warnings'}
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {errorCount > 0
            ? 'Please fix all errors before importing. Warnings are optional.'
            : 'Review warnings below. You can still import with warnings.'}
        </p>
      </Card>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {issues.map((issue, index) => (
          <Card
            key={index}
            className={`p-4 ${
              issue.severity === 'error'
                ? 'border-red-200 bg-red-50'
                : 'border-yellow-200 bg-yellow-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">
                {issue.severity === 'error' ? '❌' : '⚠️'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-semibold uppercase px-2 py-1 rounded ${
                      issue.severity === 'error'
                        ? 'bg-red-200 text-red-800'
                        : 'bg-yellow-200 text-yellow-800'
                    }`}
                  >
                    {issue.severity}
                  </span>
                  <span className="text-sm text-gray-600">
                    Row {issue.row} • {issue.column}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">{issue.message}</p>
                {issue.howToFix && (
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">How to fix:</span> {issue.howToFix}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
