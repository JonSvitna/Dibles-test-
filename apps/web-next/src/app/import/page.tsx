'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import Wizard from '@/components/Wizard';
import Card from '@/components/Card';
import FileDropzone from '@/components/FileDropzone';
import Table from '@/components/Table';
import Button from '@/components/Button';
import ProgramPicker from '@/components/ProgramPicker';
import TermPicker from '@/components/TermPicker';
import DataQualityPanel from '@/components/DataQualityPanel';
import MappingProfileModal from '@/components/MappingProfileModal';
import type { Program, Term, ParsedRow, ColumnMapping, ValidationIssue } from '@/lib/types';
import { parseCsv } from '@/lib/parseCsv';
import { parseXlsx } from '@/lib/parseXlsx';
import { autoMatchColumns } from '@/lib/mappingProfiles';
import { validateData } from '@/lib/validation';
import { importMapRData, importMCAPData } from '@/lib/storage';

export default function ImportPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<Term>('Fall');
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const steps = [
    { title: 'Program', description: 'Choose assessment' },
    { title: 'Upload', description: 'Select file' },
    { title: 'Preview', description: 'Review data' },
    { title: 'Map Columns', description: 'Match fields' },
    { title: 'Validate', description: 'Check issues' },
    { title: 'Complete', description: 'Finish import' },
  ];

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setParseError(null);

    try {
      // Parse file based on type
      let result;
      if (file.name.endsWith('.csv')) {
        result = await parseCsv(file);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        result = await parseXlsx(file);
      } else {
        setParseError('Unsupported file type. Please upload a CSV or Excel file.');
        return;
      }

      if (result.errors.length > 0) {
        setParseError(result.errors.join(', '));
        return;
      }

      setParsedData(result.data);
      setHeaders(result.headers);

      // Auto-match columns if we have a program selected
      if (selectedProgram) {
        const autoMapping = autoMatchColumns(result.headers, selectedProgram);
        setMapping(autoMapping);
      }
    } catch (error) {
      setParseError(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleNext = () => {
    if (currentStep === 3) {
      // Run validation before moving to validation step
      if (selectedProgram) {
        const issues = validateData(parsedData, selectedProgram, mapping, selectedTerm);
        setValidationIssues(issues);
      }
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (!selectedProgram) return;

    try {
      if (selectedProgram === 'MAP_R') {
        importMapRData(parsedData, mapping, selectedTerm, {
          fileName: selectedFile?.name || 'unknown',
          program: selectedProgram,
          mappingProfileUsed: undefined,
        });
      } else if (selectedProgram === 'MCAP') {
        importMCAPData(parsedData, mapping, selectedTerm, {
          fileName: selectedFile?.name || 'unknown',
          program: selectedProgram,
          mappingProfileUsed: undefined,
        });
      }

      // Redirect to reports
      router.push('/reports');
    } catch (error) {
      alert(`Failed to import data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const canGoNext = () => {
    if (currentStep === 0) return selectedProgram !== null;
    if (currentStep === 1) return selectedFile !== null && parsedData.length > 0;
    if (currentStep === 2) return parsedData.length > 0;
    if (currentStep === 3) {
      // Check that all required fields are mapped
      if (!selectedProgram) return false;
      const requiredFields = selectedProgram === 'MAP_R'
        ? ['student_id', 'first_name', 'last_name', 'grade', 'rit', 'percentile']
        : ['student_id', 'first_name', 'last_name', 'grade'];
      return requiredFields.every((field) => mapping[field]);
    }
    if (currentStep === 4) {
      // Can proceed if no errors (warnings are OK)
      return validationIssues.filter((i) => i.severity === 'error').length === 0;
    }
    return true;
  };

  const handleApplyMapping = (newMapping: ColumnMapping) => {
    setMapping(newMapping);
  };

  const handleSaveProfile = (name: string, profileMapping: ColumnMapping) => {
    if (!selectedProgram) return;
    // Profile is saved inside the modal via mappingProfiles.ts
  };

  // Get preview columns based on current mapping
  const getPreviewColumns = () => {
    if (headers.length === 0) return [];
    
    // Show first 5 columns or all if less than 5
    return headers.slice(0, Math.min(5, headers.length)).map((header) => ({
      key: header,
      label: header,
      align: 'left' as const,
    }));
  };

  const getPreviewData = () => {
    // Show first 10 rows
    return parsedData.slice(0, 10);
  };

  return (
    <div>
      <PageHeader title="Import Assessment Data" subtitle="Follow the steps to import new scores" />

      <Wizard
        steps={steps}
        currentStep={currentStep}
        onNext={handleNext}
        onPrev={handlePrev}
        onComplete={handleComplete}
        canGoNext={canGoNext()}
      >
        {/* Step 1: Choose Program */}
        {currentStep === 0 && (
          <ProgramPicker selected={selectedProgram} onSelect={setSelectedProgram} />
        )}

        {/* Step 2: Upload File */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload File</h2>
            <p className="text-gray-600 mb-6">
              Upload your {selectedProgram} data file. Supported formats: Excel (.xlsx, .xls) and CSV (.csv)
            </p>

            <FileDropzone onFileSelect={handleFileSelect} />

            {parseError && (
              <Card className="mt-6 p-4 bg-red-50 border-red-200">
                <p className="text-sm text-red-800">
                  <strong>Error:</strong> {parseError}
                </p>
              </Card>
            )}

            {selectedFile && parsedData.length > 0 && (
              <Card className="mt-6 p-4 bg-green-50 border-green-200">
                <p className="text-sm text-green-800">
                  ✅ File parsed successfully! Found {parsedData.length} rows.
                </p>
              </Card>
            )}
          </div>
        )}

        {/* Step 3: Preview Data */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Preview Data</h2>
            <p className="text-gray-600 mb-6">
              Review the first few rows of your data to ensure it looks correct.
            </p>

            {parsedData.length > 0 ? (
              <>
                <Table columns={getPreviewColumns()} data={getPreviewData()} />
                <p className="mt-4 text-sm text-gray-500">
                  Showing {Math.min(10, parsedData.length)} of {parsedData.length} rows
                </p>
              </>
            ) : (
              <Card className="p-8 text-center text-gray-500">No data to preview</Card>
            )}
          </div>
        )}

        {/* Step 4: Column Mapping */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Column Mapping</h2>
            <p className="text-gray-600 mb-6">
              We've auto-matched your columns. Review and adjust if needed.
            </p>

            <Card className="p-6 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">Current Mapping</h3>
              <div className="space-y-2">
                {Object.entries(mapping).map(([field, column]) => (
                  <div key={field} className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-700">
                      {field.replace(/_/g, ' ').toUpperCase()}:
                    </span>
                    <span className="text-gray-600">{column || '(not mapped)'}</span>
                  </div>
                ))}
              </div>
            </Card>

            {selectedProgram === 'MAP_R' && !mapping['term'] && (
              <Card className="p-4 mb-4 bg-yellow-50 border-yellow-200">
                <h4 className="font-medium text-gray-900 mb-2">Term Selection Required</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Your file doesn't have a term column. Please select which term this data is for:
                </p>
                <TermPicker selected={selectedTerm} onSelect={setSelectedTerm} label="" />
              </Card>
            )}

            <div className="flex justify-center">
              <Button onClick={() => setShowMappingModal(true)} variant="outline">
                Adjust Column Mapping
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Validate */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Quality Check</h2>
            <p className="text-gray-600 mb-6">
              Checking your data for any issues or inconsistencies.
            </p>

            <DataQualityPanel issues={validationIssues} />

            {validationIssues.filter((i) => i.severity === 'error').length === 0 && (
              <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
                <p className="text-sm text-blue-800">
                  ℹ️ You can proceed with the import. Any warnings shown above are optional to fix.
                </p>
              </Card>
            )}
          </div>
        )}

        {/* Step 6: Complete */}
        {currentStep === 5 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Import Complete!</h2>
            <p className="text-gray-600 mb-8">
              Your data has been successfully imported. You can now view reports and analyze student
              performance.
            </p>

            <div className="flex justify-center gap-4">
              <Button onClick={() => router.push('/reports')} size="lg">
                View Reports
              </Button>
              <Button onClick={() => router.push('/')} variant="outline" size="lg">
                Go Home
              </Button>
            </div>
          </div>
        )}
      </Wizard>

      {/* Mapping Profile Modal */}
      {selectedProgram && (
        <MappingProfileModal
          isOpen={showMappingModal}
          onClose={() => setShowMappingModal(false)}
          program={selectedProgram}
          headers={headers}
          currentMapping={mapping}
          onApplyMapping={handleApplyMapping}
          onSaveProfile={handleSaveProfile}
        />
      )}
    </div>
  );
}
