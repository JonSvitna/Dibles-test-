'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import Wizard from '@/components/Wizard';
import Card from '@/components/Card';
import FileDropzone from '@/components/FileDropzone';
import Table from '@/components/Table';
import ValidationPanel from '@/components/ValidationPanel';
import Button from '@/components/Button';
import type { Program } from '@/lib/types';

export default function ImportPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const steps = [
    { title: 'Program', description: 'Choose assessment' },
    { title: 'Upload', description: 'Select file' },
    { title: 'Preview', description: 'Review data' },
    { title: 'Validate', description: 'Check issues' },
    { title: 'Complete', description: 'Finish import' },
  ];

  const handleNext = () => {
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
    // In demo mode, just redirect to reports
    router.push('/reports');
  };

  const canGoNext = () => {
    if (currentStep === 0) return selectedProgram !== null;
    if (currentStep === 1) return selectedFile !== null;
    return true;
  };

  // Sample preview data (using dummy data for demo)
  const previewData = [
    { studentId: 'STU00001', name: 'Emma Smith', grade: 1, rit: 170, percentile: 52 },
    { studentId: 'STU00002', name: 'Liam Johnson', grade: 2, rit: 180, percentile: 55 },
    { studentId: 'STU00003', name: 'Olivia Williams', grade: 3, rit: 190, percentile: 58 },
    { studentId: 'STU00004', name: 'Noah Brown', grade: 4, rit: 200, percentile: 60 },
    { studentId: 'STU00005', name: 'Ava Jones', grade: 5, rit: 210, percentile: 65 },
  ];

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
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Choose Assessment Program
            </h2>
            <p className="text-gray-600 mb-6">
              Select the type of assessment data you want to import.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card
                className={`p-6 cursor-pointer transition-all ${
                  selectedProgram === 'MAP_R'
                    ? 'border-2 border-blue-600 bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedProgram('MAP_R')}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">📊</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">MAP-R</h3>
                  <p className="text-sm text-gray-600">
                    MAP Reading assessment data with RIT scores and percentiles
                  </p>
                </div>
              </Card>

              <Card
                className={`p-6 cursor-pointer transition-all ${
                  selectedProgram === 'MCAP'
                    ? 'border-2 border-blue-600 bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedProgram('MCAP')}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">📝</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">MCAP</h3>
                  <p className="text-sm text-gray-600">
                    Maryland Comprehensive Assessment Program data
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Step 2: Upload File */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload File</h2>
            <p className="text-gray-600 mb-6">
              Upload your {selectedProgram} data file. Supported formats: Excel (.xlsx, .xls) and CSV (.csv)
            </p>

            <FileDropzone onFileSelect={setSelectedFile} />

            {selectedFile && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> In demo mode, file parsing is disabled. 
                  The system will use sample data for preview and validation.
                </p>
              </div>
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

            <Card className="p-4 mb-4 bg-yellow-50 border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Demo Mode:</strong> Showing sample data for demonstration purposes.
              </p>
            </Card>

            <Table
              columns={[
                { key: 'studentId', label: 'Student ID', align: 'left' },
                { key: 'name', label: 'Name', align: 'left' },
                { key: 'grade', label: 'Grade', align: 'center' },
                { key: 'rit', label: 'RIT', align: 'center' },
                { key: 'percentile', label: 'Percentile', align: 'center' },
              ]}
              data={previewData}
            />

            <p className="mt-4 text-sm text-gray-500">
              Showing 5 of 200 rows
            </p>
          </div>
        )}

        {/* Step 4: Validate */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Validation</h2>
            <p className="text-gray-600 mb-6">
              Checking your data for any issues or inconsistencies.
            </p>

            <ValidationPanel issues={[]} />

            <div className="mt-6">
              <Card className="p-4 bg-green-50 border-green-200">
                <p className="text-sm text-green-800">
                  ✅ All validation checks passed. Your data is ready to import.
                </p>
              </Card>
            </div>
          </div>
        )}

        {/* Step 5: Complete */}
        {currentStep === 4 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Import Complete!
            </h2>
            <p className="text-gray-600 mb-8">
              Your data has been successfully imported. You can now view reports and analyze student performance.
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
    </div>
  );
}
