# MAP-R Assessment Platform

A Next.js-based school assessment platform for managing MAP-R and MCAP data with built-in Demo Mode.

## Features

- **Demo Mode**: Works offline with 200 dummy students and realistic data
- **Student Search**: Find students by name or ID
- **Student Profiles**: View individual performance with growth tracking
- **Reports**: Analyze band distribution, grade-level performance, and growth trends
- **Import Wizard**: Step-by-step UI for data import (UI-only in v0)
- **Help Documentation**: Guides for exporting data from various sources

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: Custom components (no external UI libraries)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd apps/web-next
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file:
```bash
cp .env.example .env.local
```

### Running the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

### Type Checking

```bash
npm run type-check
```

## Environment Variables

The application uses the following environment variables (configured in `.env.local`):

- `NEXT_PUBLIC_DEMO_MODE` - Set to `true` to enable Demo Mode (default: true)
- `API_BASE` - API base URL (not used in v0)

## Demo Mode

Demo Mode is **enabled by default** and provides:

- 200 sample students (grades 1-8)
- 600 MAP-R results (3 terms per student: Fall, Winter, Spring)
- Realistic RIT scores based on grade-level norms
- Percentiles correlated with RIT scores
- Performance bands (Red, Orange, Yellow, Green, Blue)

When Demo Mode is active, a yellow badge appears at the top of the page.

## Project Structure

```
apps/web-next/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── layout.tsx           # Root layout with AppShell
│   │   ├── page.tsx             # Home page
│   │   ├── globals.css          # Global styles with Tailwind
│   │   ├── import/              # Import wizard page
│   │   ├── reports/             # Reports page
│   │   ├── students/            # Students search and profiles
│   │   └── help/                # Help documentation
│   ├── components/              # Reusable UI components
│   │   ├── AppShell.tsx         # Main layout wrapper
│   │   ├── Nav.tsx              # Navigation bar
│   │   ├── PageHeader.tsx       # Page headers
│   │   ├── Card.tsx             # Card container
│   │   ├── Button.tsx           # Button component
│   │   ├── Table.tsx            # Data table
│   │   ├── StudentCard.tsx      # Student card display
│   │   ├── KpiTile.tsx          # KPI metric tile
│   │   ├── BandLegend.tsx       # Performance band legend
│   │   ├── Wizard.tsx           # Multi-step wizard
│   │   ├── FileDropzone.tsx     # File upload component
│   │   ├── ColumnMapperTable.tsx # Column mapping table
│   │   ├── ValidationPanel.tsx  # Data validation display
│   │   └── EmptyState.tsx       # Empty state component
│   └── lib/                     # Utilities and data functions
│       ├── types.ts             # TypeScript type definitions
│       ├── env.ts               # Environment utilities
│       ├── demoMode.ts          # Demo data access functions
│       ├── maprDummy.ts         # Dummy data generator
│       ├── maprAggregations.ts  # Data aggregation functions
│       └── fetcher.ts           # API fetcher (unused in v0)
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── README.md                    # This file
```

## Pages

### Home (`/`)
- Overview dashboard with 4 action cards
- Status strip showing import status and data issues
- Quick navigation to all features

### Import Data (`/import`)
- 5-step wizard for data import
- Program selection (MAP-R or MCAP)
- File upload interface
- Data preview and validation
- **Note**: File parsing not implemented in v0 (UI-only)

### Reports (`/reports`)
- **Overview Tab**: Band distribution, grade-level averages, growth stats
- **By Grade Tab**: Detailed stats for individual grades
- Term selector (Fall, Winter, Spring)
- Performance band legend with explanations

### Students (`/students`)
- Search bar for finding students by name or ID
- Student card list with grade information
- Click to view individual student profile

### Student Profile (`/students/[studentId]`)
- Student information and grade
- MAP-R results table for all terms
- Year growth calculation (Spring - Fall)

### Help (`/help`)
- Export guides for Performance Matters, NWEA MAP, Google Sheets
- Required data columns documentation
- Contact support information

## Data Model

### Core Types

- **Student**: ID, first name, last name, grade
- **MapRResult**: Student ID, term, RIT score, achievement percentile, performance band
- **Term**: Fall, Winter, Spring
- **Band**: Red, Orange, Yellow, Green, Blue
- **Program**: MAP_R, MCAP

### Performance Bands

- **Blue** (95th+ percentile): Advanced
- **Green** (75th-94th percentile): Proficient  
- **Yellow** (50th-74th percentile): Average
- **Orange** (25th-49th percentile): Below Average
- **Red** (Below 25th percentile): Needs Support

## Development Guidelines

### Design Principles

1. **Non-technical friendly**: Large buttons, clear labels, minimal jargon
2. **Card-based UI**: Consistent use of cards for content grouping
3. **Helpful explanations**: "What does this mean?" micro-help text
4. **Clean and simple**: No complex animations or interactions
5. **Accessible**: Good color contrast, readable fonts

### Code Standards

- TypeScript strict mode enabled
- Component-based architecture
- Server Components by default (use `'use client'` only when needed)
- Consistent file naming (PascalCase for components)
- No external UI libraries (custom components only)

## Future Enhancements (Not in v0)

- API integration for real data
- File parsing and column mapping
- User authentication
- Database integration
- Data export functionality
- Advanced filtering and sorting
- Chart visualizations (currently using tables)

## Scope Limitations (v0)

The following features are **NOT implemented** in version 0:

- User authentication/authorization
- Database persistence
- API endpoints
- File parsing logic
- Multi-tenant settings
- AI features
- Payment integration
- SSO (Single Sign-On)

## Support

For questions or issues, contact support at support@example.com

## License

See LICENSE file for details.
