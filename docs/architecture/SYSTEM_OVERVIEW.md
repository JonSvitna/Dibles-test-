# System Overview - K-12 Assessment Platform

## High-Level Architecture

This platform is a **client-first, progressive web application** for K-12 school assessment data management. It prioritizes educator usability, data privacy, and incremental complexity.

---

## Architecture Evolution

### Phase 0-2: Client-Side Only (Current)
```
┌─────────────────────────────────────────┐
│         User Browser (Client)           │
│  ┌──────────────────────────────────┐   │
│  │   Next.js App (Vercel)           │   │
│  │   - React Components             │   │
│  │   - Client-side routing           │   │
│  │   - localStorage (data)           │   │
│  │   - CSV/XLSX parsing              │   │
│  │   - Validation logic              │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Characteristics**:
- ✅ Fast development (no backend)
- ✅ Zero server costs (Phase 0-2)
- ✅ High privacy (no data leaves client)
- ❌ No multi-user collaboration
- ❌ Data limited to localStorage (5-10MB)

---

### Phase 4+: Client-Server Architecture (Planned)
```
┌───────────────────────┐       ┌───────────────────────┐
│   User Browser        │       │   Backend (Railway)   │
│  ┌─────────────────┐  │       │  ┌─────────────────┐  │
│  │ Next.js (Vercel)│◄─┼───────┼─►│  Node.js API    │  │
│  │ - UI Components │  │ HTTPS │  │  - Express      │  │
│  │ - State Mgmt    │  │       │  │  - Auth         │  │
│  └─────────────────┘  │       │  │  - Business     │  │
└───────────────────────┘       │  │    Logic        │  │
                                │  └────────┬────────┘  │
                                │           │           │
                                │  ┌────────▼────────┐  │
                                │  │  PostgreSQL DB  │  │
                                │  │  - Students     │  │
                                │  │  - Results      │  │
                                │  │  - Tenants      │  │
                                │  └─────────────────┘  │
                                └───────────────────────┘
```

**New Capabilities (Phase 4+)**:
- ✅ Multi-user support (school admin, teachers)
- ✅ Data persistence beyond localStorage
- ✅ Backend validation (defense in depth)
- ✅ Audit logging
- ✅ Backups and disaster recovery

---

### Phase 5+: Multi-Tenant Architecture (Planned)
```
┌───────────────────────┐       ┌───────────────────────────────────┐
│   District Admin      │       │   Backend (Railway)               │
│  ┌─────────────────┐  │       │  ┌─────────────────────────────┐  │
│  │  Next.js        │◄─┼───────┼─►│  API Layer                  │  │
│  │  - District UI  │  │       │  │  - Multi-tenant routing     │  │
│  └─────────────────┘  │       │  │  - RBAC middleware          │  │
└───────────────────────┘       │  └──────────────┬──────────────┘  │
                                │                 │                  │
┌───────────────────────┐       │  ┌──────────────▼──────────────┐  │
│   School A Admin      │       │  │  PostgreSQL                 │  │
│  ┌─────────────────┐  │       │  │  - Row-level security       │  │
│  │  Next.js        │◄─┼───────┼─►│  - Tenant isolation         │  │
│  │  - School UI    │  │       │  │  - Indexes for scale        │  │
│  └─────────────────┘  │       │  └─────────────────────────────┘  │
└───────────────────────┘       │                                    │
                                └────────────────────────────────────┘
```

**New Capabilities (Phase 5+)**:
- ✅ District-level reporting
- ✅ School comparison views
- ✅ Data isolation (tenant A cannot see tenant B)
- ✅ Performance at scale (10K+ students)

---

## Technology Stack

### Frontend (All Phases)
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS
- **State**: React hooks (useState, useEffect)
- **Routing**: Next.js App Router (file-based)
- **Deployment**: Vercel

**Why Next.js**:
- Server-side rendering (SEO, performance)
- File-based routing (simple)
- TypeScript support (type safety)
- Vercel deployment (zero-config)

### Data Parsing (Phase 2+)
- **CSV**: papaparse v5.4.1
- **XLSX**: exceljs v4.4.0 (secure, no vulnerabilities)

**Why These Libraries**:
- papaparse: Robust CSV parsing, handles edge cases
- exceljs: Secure alternative to xlsx, actively maintained

### Data Storage
- **Phase 0-2**: localStorage (5-10MB limit)
- **Phase 4+**: PostgreSQL (relational, ACID-compliant)

**Why PostgreSQL**:
- ACID guarantees (data integrity)
- Row-level security (multi-tenancy)
- JSON support (flexible schemas)
- Railway has excellent Postgres support

### Backend (Phase 4+)
- **Framework**: Node.js + Express
- **Auth**: Simple API keys (Phase 4), OAuth (Phase 7)
- **ORM**: Prisma (type-safe, migrations)
- **Deployment**: Railway

**Why Railway**:
- Simple monorepo deployment
- Built-in PostgreSQL
- Environment variable management
- Affordable for startups

---

## Data Flow

### Phase 0-2: Client-Side Only
```
1. User uploads CSV/XLSX
2. Browser parses file (papaparse/exceljs)
3. Column mapping applied (auto-match or manual)
4. Data validated (client-side)
5. Data saved to localStorage
6. Reports query localStorage
```

### Phase 4+: Client-Server
```
1. User uploads CSV/XLSX
2. Browser parses file
3. Column mapping applied
4. Data validated (client-side)
5. Data POSTed to backend API
6. Backend re-validates (defense in depth)
7. Backend saves to PostgreSQL
8. Frontend queries API for reports
```

---

## Data Model

### Core Entities (Phase 4+)

**Tenant** (Phase 5+)
- `id` (UUID)
- `name` (e.g., "Green Valley School District")
- `created_at`

**School** (Phase 5+)
- `id` (UUID)
- `tenant_id` (FK to Tenant)
- `name` (e.g., "Lincoln Elementary")
- `created_at`

**Student**
- `id` (UUID)
- `school_id` (FK to School, nullable in Phase 0-3)
- `student_id` (string, unique per school)
- `first_name`
- `last_name`
- `grade` (0-12)
- `created_at`
- `updated_at`

**AssessmentEvent** (Future)
- `id` (UUID)
- `school_id` (FK to School)
- `program` (MAP_R, MCAP, DIBELS)
- `term` (Fall, Winter, Spring)
- `date`
- `created_at`

**AssessmentRecord** (MAP-R)
- `id` (UUID)
- `student_id` (FK to Student)
- `event_id` (FK to AssessmentEvent, nullable)
- `program` (MAP_R)
- `term` (Fall, Winter, Spring)
- `rit` (integer, 100-300)
- `percentile` (integer, 1-99)
- `band` (Red, Orange, Yellow, Green, Blue)
- `created_at`

**AssessmentRecord** (MCAP)
- `id` (UUID)
- `student_id` (FK to Student)
- `event_id` (FK to AssessmentEvent, nullable)
- `program` (MCAP)
- `season` (Fall, Winter, Spring)
- `organization_purpose` (0-4, nullable)
- `evidence_elaboration` (0-4, nullable)
- `conventions` (0-4, nullable)
- `total_score` (0-12, nullable)
- `performance_label` (string, nullable)
- `created_at`

**MappingProfile**
- `id` (UUID)
- `school_id` (FK to School, nullable in Phase 0-3)
- `name` (string, e.g., "District Export")
- `program` (MAP_R, MCAP)
- `mapping` (JSON: {field: column_name})
- `created_at`

**ImportMetadata**
- `id` (UUID)
- `school_id` (FK to School, nullable)
- `user_id` (FK to User, nullable)
- `file_name`
- `program`
- `term_or_season`
- `row_count`
- `validation_passed` (boolean)
- `mapping_profile_id` (FK to MappingProfile, nullable)
- `created_at`

---

## Security Architecture

### Privacy-by-Design (All Phases)

**FERPA Alignment**:
- ✅ No third-party data sharing
- ✅ Minimal data collection (only assessment data)
- ✅ No tracking or analytics (privacy-safe only)
- ✅ Data retention policies (configurable)
- ✅ Audit logging (Phase 5+)

**Client-Side Security (Phase 0-2)**:
- ✅ No server uploads (data never leaves browser)
- ✅ localStorage isolated per user/browser
- ✅ No third-party scripts (except Next.js, React)
- ✅ Content Security Policy (CSP) headers

**Backend Security (Phase 4+)**:
- ✅ API authentication (API keys, later OAuth)
- ✅ Rate limiting (prevent abuse)
- ✅ Input validation (server-side re-validation)
- ✅ SQL injection prevention (Prisma ORM)
- ✅ Encryption at rest (PostgreSQL)
- ✅ Encryption in transit (HTTPS)
- ✅ Row-level security (multi-tenancy)

**Dependency Security (All Phases)**:
- ✅ Weekly `npm audit`
- ✅ Automated dependency updates (Dependabot)
- ✅ Zero tolerance for HIGH/CRITICAL vulnerabilities

---

## Template-Driven Rules Engine (Future)

**Vision**: Allow districts to configure custom percentile norms, band cutoffs, and scoring rubrics without code changes.

**Architecture**:
```
┌───────────────────────┐
│   District Admin      │
│  - Upload norm tables │
│  - Configure bands    │
│  - Set cutoffs        │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│   Rules Engine        │
│  - JSON templates     │
│  - Band calc          │
│  - Percentile lookup  │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│   Assessment Records  │
│  - Apply rules        │
│  - Compute bands      │
└───────────────────────┘
```

**Example Template** (JSON):
```json
{
  "program": "MAP_R",
  "grade": 3,
  "term": "Fall",
  "percentile_norms": [
    {"rit": 170, "percentile": 50},
    {"rit": 180, "percentile": 65},
    ...
  ],
  "band_cutoffs": {
    "blue": 95,
    "green": 75,
    "yellow": 50,
    "orange": 25,
    "red": 0
  }
}
```

---

## Deployment Architecture

### Phase 0-2: Vercel Only
- Frontend: Vercel (Next.js)
- Data: localStorage (browser)
- Cost: Free (Hobby plan)

### Phase 4+: Vercel + Railway
- Frontend: Vercel (Next.js)
- Backend: Railway (Node.js + PostgreSQL)
- Cost: ~$20-50/month (Railway Starter + Postgres)

### Phase 5+: Production Scale
- Frontend: Vercel (Pro plan)
- Backend: Railway (Team plan)
- Database: PostgreSQL (scaled instance)
- CDN: Vercel Edge Network
- Monitoring: Sentry, Datadog, or similar
- Cost: ~$200-500/month

---

## Future Considerations

### API Layer (Phase 7)
- RESTful API for third-party integrations
- Webhooks for event notifications
- OAuth 2.0 for auth
- Rate limiting (per school/district)
- API documentation (OpenAPI/Swagger)

### Mobile App (Phase 7)
- React Native (code sharing with web)
- Offline mode (SQLite cache)
- Push notifications (opt-in)

### Advanced Analytics (Phase 6+)
- Cohort analysis
- Year-over-year trends
- Growth models (value-added)
- Intervention recommendations

---

**Last Updated**: 2026-02-16  
**Next Review**: After Phase 4 (backend launch)
