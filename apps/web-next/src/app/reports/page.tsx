'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Table from '@/components/Table';
import BandLegend from '@/components/BandLegend';
import Button from '@/components/Button';
import { getBandDistribution, getAverageRITByGrade, getGrowthStats } from '@/lib/maprAggregations';
import { getMCAPResults, getStudents, getDataMode, resetData } from '@/lib/storage';
import type { Term, Program } from '@/lib/types';

export default function ReportsPage() {
  const [selectedProgram, setSelectedProgram] = useState<Program>('MAP_R');
  const [selectedTerm, setSelectedTerm] = useState<Term>('Spring');
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'bygrade'>('overview');
  
  const mode = getDataMode();
  const terms: Term[] = ['Fall', 'Winter', 'Spring'];
  const grades = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data? This will return to demo mode with sample data.')) {
      resetData();
      window.location.reload();
    }
  };

  // MAP-R Data
  const bandDistribution = getBandDistribution(selectedTerm);
  const gradeStats = getAverageRITByGrade(selectedTerm);
  const growthStats = getGrowthStats();

  // Calculate average growth
  const avgGrowth =
    growthStats.length > 0
      ? Math.round(
          growthStats.reduce((sum, s) => sum + s.growth, 0) / growthStats.length
        )
      : 0;

  // Growth distribution
  const growthRanges = [
    { range: '10+ points', count: growthStats.filter((s) => s.growth >= 10).length },
    { range: '5-9 points', count: growthStats.filter((s) => s.growth >= 5 && s.growth < 10).length },
    { range: '1-4 points', count: growthStats.filter((s) => s.growth >= 1 && s.growth < 5).length },
    { range: '0 points', count: growthStats.filter((s) => s.growth === 0).length },
    { range: 'Negative', count: growthStats.filter((s) => s.growth < 0).length },
  ];

  const gradeStatsForTable = gradeStats.map((g) => ({
    grade: `Grade ${g.grade}`,
    averageRIT: g.averageRIT,
    studentCount: g.studentCount,
  }));

  const selectedGradeStats = gradeStats.find((g) => g.grade === selectedGrade);

  // MCAP Data
  const mcapResults = getMCAPResults();
  const students = getStudents();
  
  // MCAP aggregations by grade and season
  const getMCAPAveragesByGrade = () => {
    const gradeAverages = grades.map((grade) => {
      const gradeStudents = students.filter((s) => s.grade === grade);
      const gradeResults = mcapResults.filter((r) =>
        gradeStudents.some((s) => s.student_id === r.student_id && r.season === selectedTerm)
      );

      if (gradeResults.length === 0) {
        return {
          grade: `Grade ${grade}`,
          orgPurpose: 0,
          evidence: 0,
          conventions: 0,
          total: 0,
          count: 0,
        };
      }

      const validResults = gradeResults.filter(
        (r) =>
          r.organization_purpose !== undefined &&
          r.evidence_elaboration !== undefined &&
          r.conventions !== undefined
      );

      if (validResults.length === 0) {
        return {
          grade: `Grade ${grade}`,
          orgPurpose: 0,
          evidence: 0,
          conventions: 0,
          total: 0,
          count: gradeResults.length,
        };
      }

      const avgOrg =
        validResults.reduce((sum, r) => sum + (r.organization_purpose || 0), 0) /
        validResults.length;
      const avgEvidence =
        validResults.reduce((sum, r) => sum + (r.evidence_elaboration || 0), 0) /
        validResults.length;
      const avgConv =
        validResults.reduce((sum, r) => sum + (r.conventions || 0), 0) / validResults.length;

      return {
        grade: `Grade ${grade}`,
        orgPurpose: avgOrg.toFixed(1),
        evidence: avgEvidence.toFixed(1),
        conventions: avgConv.toFixed(1),
        total: (avgOrg + avgEvidence + avgConv).toFixed(1),
        count: validResults.length,
      };
    });

    return gradeAverages.filter((g) => g.count > 0);
  };

  const mcapAverages = getMCAPAveragesByGrade();
  const mcapCompletionCounts = grades.map((grade) => {
    const gradeStudents = students.filter((s) => s.grade === grade);
    const gradeResults = mcapResults.filter((r) =>
      gradeStudents.some((s) => s.student_id === r.student_id && r.season === selectedTerm)
    );
    
    return {
      grade: `Grade ${grade}`,
      total: gradeStudents.length,
      completed: gradeResults.length,
      percentage: gradeStudents.length > 0 
        ? `${Math.round((gradeResults.length / gradeStudents.length) * 100)}%`
        : '0%',
    };
  }).filter((g) => g.total > 0);

  return (
    <div>
      <PageHeader title="Reports" subtitle="Analyze assessment performance and trends" />

      {/* Data Mode and Program Selector */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <Card className="p-4 flex-1 min-w-[200px]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-600">Data Mode:</span>
              <span className={`ml-2 font-semibold ${mode === 'live' ? 'text-green-600' : 'text-blue-600'}`}>
                {mode === 'live' ? '🟢 Live Mode' : '🔵 Demo Mode'}
              </span>
            </div>
            {mode === 'live' && (
              <Button onClick={handleResetData} variant="outline" size="sm">
                Reset Data
              </Button>
            )}
          </div>
        </Card>

        <Card className="p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedProgram('MAP_R')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedProgram === 'MAP_R'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              MAP-R
            </button>
            <button
              onClick={() => setSelectedProgram('MCAP')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedProgram === 'MCAP'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              MCAP
            </button>
          </div>
        </Card>
      </div>

      {/* MAP-R Reports */}
      {selectedProgram === 'MAP_R' && (
        <>
          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('bygrade')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'bygrade'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                By Grade
              </button>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Term Selector */}
              <Card className="p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Term
                </label>
                <div className="flex gap-2">
                  {terms.map((term) => (
                    <button
                      key={term}
                      onClick={() => setSelectedTerm(term)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedTerm === term
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Band Distribution */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Band Distribution - {selectedTerm}
                </h2>
                <p className="text-sm text-gray-600 mb-4 italic">
                  What this means: Shows how many students fall into each performance band.
                </p>
                <Table
                  columns={[
                    { key: 'band', label: 'Performance Band', align: 'left' },
                    { key: 'count', label: 'Student Count', align: 'center' },
                    { key: 'percentage', label: 'Percentage', align: 'center' },
                  ]}
                  data={bandDistribution.map((b) => ({
                    band: b.band,
                    count: b.count,
                    percentage: `${b.percentage}%`,
                  }))}
                />
                <div className="mt-6">
                  <BandLegend />
                </div>
              </Card>

              {/* Average RIT by Grade */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Average RIT by Grade - {selectedTerm}
                </h2>
                <p className="text-sm text-gray-600 mb-4 italic">
                  What this means: Higher RIT scores indicate stronger reading skills.
                </p>
                <Table
                  columns={[
                    { key: 'grade', label: 'Grade', align: 'left' },
                    { key: 'averageRIT', label: 'Average RIT', align: 'center' },
                    { key: 'studentCount', label: 'Students', align: 'center' },
                  ]}
                  data={gradeStatsForTable}
                />
              </Card>

              {/* Growth Distribution */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Growth Distribution (Spring - Fall)
                </h2>
                <p className="text-sm text-gray-600 mb-4 italic">
                  What this means: Growth shows how much students improved from Fall to Spring. Positive
                  growth indicates learning progress.
                </p>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Average Growth:{' '}
                    <span className="font-semibold text-green-600">{avgGrowth} RIT points</span>
                  </p>
                </div>
                <Table
                  columns={[
                    { key: 'range', label: 'Growth Range', align: 'left' },
                    { key: 'count', label: 'Student Count', align: 'center' },
                  ]}
                  data={growthRanges}
                />
              </Card>
            </div>
          )}

          {activeTab === 'bygrade' && (
            <div className="space-y-6">
              {/* Grade Picker */}
              <Card className="p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Grade
                </label>
                <div className="flex gap-2 flex-wrap">
                  {grades.map((grade) => (
                    <button
                      key={grade}
                      onClick={() => setSelectedGrade(grade)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedGrade === grade
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Grade {grade}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Term Selector for Grade View */}
              <Card className="p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Term
                </label>
                <div className="flex gap-2">
                  {terms.map((term) => (
                    <button
                      key={term}
                      onClick={() => setSelectedTerm(term)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedTerm === term
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </Card>

              {selectedGradeStats && (
                <>
                  {/* Grade Overview */}
                  <Card className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Grade {selectedGrade} - {selectedTerm}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="text-sm text-gray-500">Average RIT Score</p>
                        <p className="text-3xl font-bold text-blue-600">
                          {selectedGradeStats.averageRIT}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Students</p>
                        <p className="text-3xl font-bold text-gray-900">
                          {selectedGradeStats.studentCount}
                        </p>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Band Distribution
                    </h3>
                    <Table
                      columns={[
                        { key: 'band', label: 'Performance Band', align: 'left' },
                        { key: 'count', label: 'Student Count', align: 'center' },
                        { key: 'percentage', label: 'Percentage', align: 'center' },
                      ]}
                      data={selectedGradeStats.bandDistribution.map((b) => ({
                        band: b.band,
                        count: b.count,
                        percentage: `${b.percentage}%`,
                      }))}
                    />
                  </Card>

                  <BandLegend />
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* MCAP Reports */}
      {selectedProgram === 'MCAP' && (
        <div className="space-y-6">
          {/* Term Selector */}
          <Card className="p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Season</label>
            <div className="flex gap-2">
              {terms.map((term) => (
                <button
                  key={term}
                  onClick={() => setSelectedTerm(term)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedTerm === term
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          </Card>

          {mcapResults.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500 mb-4">No MCAP data available yet.</p>
              <p className="text-sm text-gray-400">
                Import MCAP data to see writing rubric reports here.
              </p>
            </Card>
          ) : (
            <>
              {/* Writing Category Averages */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Writing Category Averages by Grade - {selectedTerm}
                </h2>
                <p className="text-sm text-gray-600 mb-4 italic">
                  What this means: Shows average scores for each writing rubric category. Scores range
                  from 0-4.
                </p>
                <Table
                  columns={[
                    { key: 'grade', label: 'Grade', align: 'left' },
                    { key: 'orgPurpose', label: 'Org/Purpose', align: 'center' },
                    { key: 'evidence', label: 'Evidence/Elab', align: 'center' },
                    { key: 'conventions', label: 'Conventions', align: 'center' },
                    { key: 'total', label: 'Total', align: 'center' },
                    { key: 'count', label: 'Students', align: 'center' },
                  ]}
                  data={mcapAverages}
                />
              </Card>

              {/* Completion Counts */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Completion by Grade - {selectedTerm}
                </h2>
                <p className="text-sm text-gray-600 mb-4 italic">
                  What this means: Shows how many students have completed MCAP assessments.
                </p>
                <Table
                  columns={[
                    { key: 'grade', label: 'Grade', align: 'left' },
                    { key: 'completed', label: 'Completed', align: 'center' },
                    { key: 'total', label: 'Total Students', align: 'center' },
                    { key: 'percentage', label: 'Completion %', align: 'center' },
                  ]}
                  data={mcapCompletionCounts}
                />
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
}
