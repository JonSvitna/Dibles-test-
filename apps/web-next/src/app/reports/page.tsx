'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Table from '@/components/Table';
import BandLegend from '@/components/BandLegend';
import { getBandDistribution, getAverageRITByGrade, getGrowthStats } from '@/lib/maprAggregations';
import type { Term } from '@/lib/types';

export default function ReportsPage() {
  const [selectedTerm, setSelectedTerm] = useState<Term>('Spring');
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'bygrade'>('overview');

  const terms: Term[] = ['Fall', 'Winter', 'Spring'];
  const grades = [1, 2, 3, 4, 5, 6, 7, 8];

  // Get data
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

  return (
    <div>
      <PageHeader title="Reports" subtitle="Analyze assessment performance and trends" />

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
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Band Distribution - {selectedTerm}
            </h2>
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Average RIT by Grade - {selectedTerm}
            </h2>
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Growth Distribution (Spring - Fall)
            </h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Average Growth: <span className="font-semibold text-green-600">{avgGrowth} RIT points</span>
              </p>
            </div>
            <Table
              columns={[
                { key: 'range', label: 'Growth Range', align: 'left' },
                { key: 'count', label: 'Student Count', align: 'center' },
              ]}
              data={growthRanges}
            />
            <p className="mt-4 text-xs text-gray-500 italic">
              What does this mean? Growth shows how much students improved from Fall to Spring.
              Positive growth indicates learning progress.
            </p>
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
    </div>
  );
}
