# Data Model - K-12 Assessment Platform

This document defines the normalized data entities and their relationships.

---

## Entity Relationship Diagram

```
┌─────────────┐
│   Tenant    │ (Phase 5+)
│  (District) │
└──────┬──────┘
       │ 1
       │
       │ *
┌──────▼──────┐
│   School    │ (Phase 5+)
└──────┬──────┘
       │ 1
       │
       │ *
┌──────▼──────────┐       ┌────────────────────┐
│    Student      │◄──────│  AssessmentRecord  │
│                 │ 1   * │  (MAP-R, MCAP)     │
└─────────────────┘       └────────────────────┘
       │ 1
       │
       │ *
┌──────▼──────────┐
│ ImportMetadata  │
└─────────────────┘

┌──────────────────┐
│ MappingProfile   │ (standalone)
└──────────────────┘
```

---

## Core Entities

### Tenant (Phase 5+)
Represents a school district or educational organization.

**Fields**:
```typescript
{
  id: string; // UUID
  name: string; // e.g., "Green Valley School District"
  slug: string; // e.g., "green-valley-sd" (for URLs)
  settings: {
    timezone: string;
    demo_mode_enabled: boolean;
    custom_norms: boolean; // template-driven rules
  };
  created_at: Date;
  updated_at: Date;
}
```

**JSON Example**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Green Valley School District",
  "slug": "green-valley-sd",
  "settings": {
    "timezone": "America/New_York",
    "demo_mode_enabled": false,
    "custom_norms": false
  },
  "created_at": "2026-01-15T08:00:00Z",
  "updated_at": "2026-01-15T08:00:00Z"
}
```

---

### School (Phase 5+)
Represents an individual school within a district.

**Fields**:
```typescript
{
  id: string; // UUID
  tenant_id: string; // FK to Tenant (nullable in Phase 0-4)
  name: string; // e.g., "Lincoln Elementary"
  slug: string; // e.g., "lincoln-elementary"
  address: string | null;
  grades_served: number[]; // e.g., [0, 1, 2, 3, 4, 5]
  created_at: Date;
  updated_at: Date;
}
```

**JSON Example**:
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Lincoln Elementary",
  "slug": "lincoln-elementary",
  "address": "123 School St, Green Valley, MD 20000",
  "grades_served": [0, 1, 2, 3, 4, 5],
  "created_at": "2026-01-15T08:30:00Z",
  "updated_at": "2026-01-15T08:30:00Z"
}
```

---

### Student
Represents a K-12 student with assessment data.

**Fields**:
```typescript
{
  id: string; // UUID (internal)
  school_id: string | null; // FK to School (nullable in Phase 0-4)
  student_id: string; // School-provided ID (e.g., "STU00123")
  first_name: string;
  last_name: string;
  grade: number; // 0-12 (0 = Kindergarten)
  created_at: Date;
  updated_at: Date;
}
```

**Constraints**:
- `student_id` must be unique per school (Phase 5+)
- `grade` must be 0-12

**JSON Example**:
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "school_id": "660e8400-e29b-41d4-a716-446655440001",
  "student_id": "STU00123",
  "first_name": "Emma",
  "last_name": "Smith",
  "grade": 3,
  "created_at": "2026-02-01T09:00:00Z",
  "updated_at": "2026-02-01T09:00:00Z"
}
```

---

### AssessmentRecord (MAP-R)
Represents a single MAP Reading assessment result.

**Fields**:
```typescript
{
  id: string; // UUID
  student_id: string; // FK to Student
  program: "MAP_R";
  term: "Fall" | "Winter" | "Spring";
  rit: number; // 100-300
  ach_pct: number; // Achievement percentile, 1-99
  band: "Red" | "Orange" | "Yellow" | "Green" | "Blue";
  assessed_date: Date | null; // Optional
  created_at: Date;
  updated_at: Date;
}
```

**Band Calculation** (default):
- Blue: 81-99 percentile
- Green: 61-80 percentile
- Yellow: 41-60 percentile
- Orange: 21-40 percentile
- Red: 1-20 percentile

**JSON Example**:
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "student_id": "770e8400-e29b-41d4-a716-446655440002",
  "program": "MAP_R",
  "term": "Fall",
  "rit": 185,
  "ach_pct": 55,
  "band": "Yellow",
  "assessed_date": "2026-09-15",
  "created_at": "2026-09-16T10:00:00Z",
  "updated_at": "2026-09-16T10:00:00Z"
}
```

---

### AssessmentRecord (MCAP Writing)
Represents a Maryland Comprehensive Assessment Program writing rubric result.

**Fields**:
```typescript
{
  id: string; // UUID
  student_id: string; // FK to Student
  program: "MCAP";
  season: "Fall" | "Winter" | "Spring";
  organization_purpose: number | null; // 0-4 rubric score
  evidence_elaboration: number | null; // 0-4 rubric score
  conventions: number | null; // 0-4 rubric score
  total_score: number | null; // Sum of above (0-12)
  performance_label: string | null; // e.g., "Proficient"
  assessed_date: Date | null;
  created_at: Date;
  updated_at: Date;
}
```

**Performance Labels** (district-configurable):
- Below Basic: 0-4
- Basic: 5-7
- Proficient: 8-10
- Advanced: 11-12

**JSON Example**:
```json
{
  "id": "990e8400-e29b-41d4-a716-446655440004",
  "student_id": "770e8400-e29b-41d4-a716-446655440002",
  "program": "MCAP",
  "season": "Spring",
  "organization_purpose": 3,
  "evidence_elaboration": 3,
  "conventions": 2,
  "total_score": 8,
  "performance_label": "Proficient",
  "assessed_date": "2026-04-10",
  "created_at": "2026-04-11T10:00:00Z",
  "updated_at": "2026-04-11T10:00:00Z"
}
```

---

### MappingProfile
Stores saved column mappings for reuse during imports.

**Fields**:
```typescript
{
  id: string; // UUID
  school_id: string | null; // FK to School (nullable in Phase 0-4)
  name: string; // e.g., "District MAP Export"
  program: "MAP_R" | "MCAP";
  mapping: {
    [key: string]: string; // e.g., {"student_id": "Student ID", "rit": "RIT Score"}
  };
  created_at: Date;
  updated_at: Date;
}
```

**JSON Example**:
```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440005",
  "school_id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "District MAP Export",
  "program": "MAP_R",
  "mapping": {
    "student_id": "Student ID",
    "first_name": "First Name",
    "last_name": "Last Name",
    "grade": "Grade",
    "term": "Testing Term",
    "rit": "RIT Score",
    "percentile": "Achievement %ile"
  },
  "created_at": "2026-02-10T11:00:00Z",
  "updated_at": "2026-02-10T11:00:00Z"
}
```

---

### ImportMetadata
Tracks import history for audit and troubleshooting.

**Fields**:
```typescript
{
  id: string; // UUID
  school_id: string | null; // FK to School
  user_id: string | null; // FK to User (Phase 4+)
  file_name: string;
  program: "MAP_R" | "MCAP";
  term_or_season: "Fall" | "Winter" | "Spring";
  row_count: number; // Number of rows imported
  validation_passed: boolean;
  mapping_profile_id: string | null; // FK to MappingProfile
  error_log: string | null; // JSON string of validation errors
  created_at: Date;
}
```

**JSON Example**:
```json
{
  "id": "bb0e8400-e29b-41d4-a716-446655440006",
  "school_id": "660e8400-e29b-41d4-a716-446655440001",
  "user_id": null,
  "file_name": "fall_2026_map_export.csv",
  "program": "MAP_R",
  "term_or_season": "Fall",
  "row_count": 250,
  "validation_passed": true,
  "mapping_profile_id": "aa0e8400-e29b-41d4-a716-446655440005",
  "error_log": null,
  "created_at": "2026-09-16T11:30:00Z"
}
```

---

## Relationships

### One-to-Many
- Tenant → Schools (Phase 5+)
- School → Students (Phase 5+)
- Student → AssessmentRecords
- School → MappingProfiles
- School → ImportMetadata

### Many-to-Many
- None (intentionally denormalized for simplicity)

---

## Indexes (Phase 4+)

**Students**:
- `(school_id, student_id)` - UNIQUE (Phase 5+)
- `school_id` - for queries
- `grade` - for reports

**AssessmentRecords**:
- `student_id` - for lookups
- `(program, term)` - for reports
- `(student_id, program, term)` - UNIQUE (prevent duplicates)

**MappingProfiles**:
- `school_id` - for queries
- `(school_id, program)` - for filtering

**ImportMetadata**:
- `school_id` - for audit logs
- `created_at` - for chronological queries

---

## Data Migration Strategy (Phase 3 → Phase 4)

**Goal**: Move from localStorage to PostgreSQL without data loss.

**Steps**:
1. Export localStorage data to JSON (frontend)
2. POST JSON to backend `/api/migrate` endpoint
3. Backend validates and inserts into database
4. Frontend switches to API mode (no more localStorage)
5. Verify data integrity (checksums)

**Rollback**: Keep localStorage as backup for 30 days

---

## Future Entities (Phase 6+)

### AssessmentEvent
Groups assessment records by event (e.g., "Fall 2026 MAP-R Testing Window").

**Fields**:
```typescript
{
  id: string;
  school_id: string;
  program: string;
  term: string;
  start_date: Date;
  end_date: Date;
  notes: string | null;
}
```

### User (Phase 4+)
Represents a school staff member with access.

**Fields**:
```typescript
{
  id: string;
  school_id: string;
  email: string;
  role: "district_admin" | "school_admin" | "teacher";
  created_at: Date;
}
```

### AuditLog (Phase 5+)
Tracks who did what, when.

**Fields**:
```typescript
{
  id: string;
  user_id: string;
  action: string; // e.g., "import_data", "view_student"
  entity_type: string; // e.g., "Student"
  entity_id: string;
  details: object; // JSON
  timestamp: Date;
}
```

---

**Last Updated**: 2026-02-16  
**Next Review**: Before Phase 4 backend implementation
