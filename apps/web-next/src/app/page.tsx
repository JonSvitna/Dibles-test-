import Link from 'next/link';
import Card from '@/components/Card';
import PageHeader from '@/components/PageHeader';

export default function HomePage() {
  const actionCards = [
    {
      title: 'Import New Scores',
      description: 'Upload MAP-R or MCAP assessment data',
      icon: '📊',
      href: '/import',
      color: 'blue',
    },
    {
      title: 'View Reports',
      description: 'Analyze performance trends and distributions',
      icon: '📈',
      href: '/reports',
      color: 'green',
    },
    {
      title: 'Find a Student',
      description: 'Search students and view individual progress',
      icon: '👨‍🎓',
      href: '/students',
      color: 'purple',
    },
    {
      title: 'Help',
      description: 'Get help with data imports and exports',
      icon: '❓',
      href: '/help',
      color: 'orange',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Welcome to MAP-R Assessment Platform"
        subtitle="Select an action below to get started"
      />

      {/* Status Strip */}
      <Card className="p-4 mb-8 bg-blue-50 border-blue-200">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <span className="text-sm text-gray-600">Last Import:</span>
            <span className="ml-2 font-semibold text-gray-900">Demo Seed</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">Data Issues:</span>
            <span className="ml-2 font-semibold text-green-600">0</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">Program:</span>
            <span className="ml-2 font-semibold text-blue-600">MAP-R Demo</span>
          </div>
        </div>
      </Card>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {actionCards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="p-8 h-full hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-6xl mb-4">{card.icon}</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {card.title}
                </h2>
                <p className="text-gray-600">{card.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
