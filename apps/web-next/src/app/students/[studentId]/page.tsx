import { notFound } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Table from '@/components/Table';
import Button from '@/components/Button';
import { getStudentWithResults } from '@/lib/demoMode';
import type { Term } from '@/lib/types';

interface StudentProfilePageProps {
  params: Promise<{ studentId: string }>;
}

export default async function StudentProfilePage({ params }: StudentProfilePageProps) {
  const { studentId } = await params;
  const studentWithResults = getStudentWithResults(studentId);

  if (!studentWithResults) {
    notFound();
  }

  const { student_id, first_name, last_name, grade, results, mcapResults } = studentWithResults;

  // Calculate MAP-R growth (Spring - Fall)
  const fallResult = results.find((r) => r.term === 'Fall');
  const springResult = results.find((r) => r.term === 'Spring');
  const growth =
    fallResult && springResult ? springResult.rit - fallResult.rit : null;

  // Sort MAP-R results by term order
  const termOrder: Record<Term, number> = { Fall: 1, Winter: 2, Spring: 3 };
  const sortedResults = [...results].sort(
    (a, b) => termOrder[a.term] - termOrder[b.term]
  );

  // Prepare MAP-R table data
  const maprTableData = sortedResults.map((r) => ({
    term: r.term,
    rit: r.rit,
    percentile: `${r.ach_pct}%`,
    band: r.band,
  }));

  // Prepare MCAP table data
  const mcapTableData = mcapResults?.map((r) => ({
    season: r.season,
    orgPurpose: r.organization_purpose !== undefined ? r.organization_purpose : 'N/A',
    evidence: r.evidence_elaboration !== undefined ? r.evidence_elaboration : 'N/A',
    conventions: r.conventions !== undefined ? r.conventions : 'N/A',
    total: r.total_score !== undefined ? r.total_score : 'N/A',
    performanceLabel: r.performance_label || 'N/A',
  })) || [];

  return (
    <div>
      <PageHeader
        title={`${first_name} ${last_name}`}
        subtitle={`Student ID: ${student_id} • Grade ${grade}`}
        actions={
          <Link href="/students">
            <Button variant="outline">← Back to Students</Button>
          </Link>
        }
      />

      {/* Student Info Card */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500">Student ID</p>
            <p className="text-lg font-semibold text-gray-900">{student_id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Grade</p>
            <p className="text-lg font-semibold text-gray-900">{grade}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Year Growth (Spring - Fall)</p>
            <p
              className={`text-lg font-semibold ${
                growth !== null
                  ? growth > 0
                    ? 'text-green-600'
                    : growth < 0
                    ? 'text-red-600'
                    : 'text-gray-600'
                  : 'text-gray-400'
              }`}
            >
              {growth !== null ? `${growth > 0 ? '+' : ''}${growth} RIT` : 'N/A'}
            </p>
          </div>
        </div>
      </Card>

      {/* MAP-R Results Section */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">MAP-R Results</h2>
        {results.length > 0 ? (
          <Table
            columns={[
              { key: 'term', label: 'Term', align: 'left' },
              { key: 'rit', label: 'RIT Score', align: 'center' },
              { key: 'percentile', label: 'Percentile', align: 'center' },
              { key: 'band', label: 'Performance Band', align: 'center' },
            ]}
            data={maprTableData}
          />
        ) : (
          <p className="text-gray-500 text-center py-8">No MAP-R results available</p>
        )}
      </Card>

      {/* MCAP Results Section */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">MCAP Writing Results</h2>
        {mcapTableData.length > 0 ? (
          <>
            <Table
              columns={[
                { key: 'season', label: 'Season', align: 'left' },
                { key: 'orgPurpose', label: 'Org/Purpose', align: 'center' },
                { key: 'evidence', label: 'Evidence/Elab', align: 'center' },
                { key: 'conventions', label: 'Conventions', align: 'center' },
                { key: 'total', label: 'Total', align: 'center' },
                { key: 'performanceLabel', label: 'Performance Level', align: 'center' },
              ]}
              data={mcapTableData}
            />
            <p className="mt-4 text-xs text-gray-500 italic">
              Rubric scores range from 0-4. Total is the sum of all three categories.
            </p>
          </>
        ) : (
          <p className="text-gray-500 text-center py-8">No MCAP results available</p>
        )}
      </Card>
    </div>
  );
}
