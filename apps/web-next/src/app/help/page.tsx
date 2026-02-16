import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';

export default function HelpPage() {
  const faqSections = [
    {
      title: 'How to export from Performance Matters',
      icon: '📊',
      steps: [
        'Log in to your Performance Matters account',
        'Navigate to the Reports section',
        'Select the assessment type (MAP-R or MCAP)',
        'Choose the time period and student group',
        'Click "Export to Excel" button',
        'Save the file to your computer',
        'Return to this platform and use the Import Data feature',
      ],
    },
    {
      title: 'How to export MAP data from NWEA',
      icon: '🗺️',
      steps: [
        'Log in to your NWEA MAP Growth account',
        'Go to the "Data Export" section',
        'Select "Student Progress Report"',
        'Choose the term (Fall, Winter, or Spring)',
        'Select all students or specific grades',
        'Export as Excel or CSV format',
        'Download the file and use the Import Data feature on this platform',
      ],
    },
    {
      title: 'How to download Google Sheets as Excel',
      icon: '📑',
      steps: [
        'Open your Google Sheet with assessment data',
        'Click "File" in the menu',
        'Select "Download"',
        'Choose "Microsoft Excel (.xlsx)"',
        'The file will download to your computer',
        'Use the Import Data feature to upload the Excel file',
      ],
    },
    {
      title: 'Required Data Columns',
      icon: '📋',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">MAP-R Data Must Include:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Student ID</li>
              <li>Student Name (First and Last)</li>
              <li>Grade</li>
              <li>Term (Fall, Winter, or Spring)</li>
              <li>RIT Score</li>
              <li>Achievement Percentile</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">MCAP Data Must Include:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Student ID</li>
              <li>Student Name</li>
              <li>Grade</li>
              <li>Subject</li>
              <li>Performance Level</li>
              <li>Scale Score</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Help & Support"
        subtitle="Get assistance with data imports and platform features"
      />

      <div className="space-y-6">
        {faqSections.map((section, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{section.icon}</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
                {section.steps && (
                  <ol className="space-y-2">
                    {section.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start gap-3">
                        <span className="inline-block w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                          {stepIndex + 1}
                        </span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                )}
                {section.content && <div>{section.content}</div>}
              </div>
            </div>
          </Card>
        ))}

        {/* Contact Support */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="text-4xl">📧</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Need More Help?</h2>
              <p className="text-gray-700 mb-4">
                If you have questions or encounter any issues, please contact our support team.
              </p>
              <a
                href="mailto:support@example.com"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
