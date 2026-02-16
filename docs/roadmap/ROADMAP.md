# K-12 Assessment Platform - Project Roadmap

## Executive Summary

This platform provides K-12 schools with a streamlined system for managing and analyzing MAP-R (MAP Reading), MCAP (Maryland Comprehensive Assessment Program), and DIBELS assessment data. The platform focuses on data import, visualization, and actionable insights for educators.

**Core Value Proposition**: Simple, privacy-focused assessment data management for schools without complex integrations or payment systems.

## Key Principles

- **No Payment System**: Schools operate on annual contracts; no in-app purchases or marketplace
- **Privacy-First**: FERPA-aligned data handling, no third-party data sharing
- **Educator-Focused**: Non-technical UI with plain English terminology
- **Lightweight Integration**: CSV/XLSX imports, no complex SIS integrations required

## Phase Overview

### Phase 0: Foundation (COMPLETE)
**Status**: ✅ Complete  
**Duration**: 1 week  
**Outcome**: Basic Next.js app deployed with demo data and navigation structure

**Deliverables**:
- Next.js 14+ App Router setup
- Basic navigation (Home, Import, Reports, Students, Help)
- Demo mode with 200 dummy students
- MAP-R dummy data (3 terms, realistic distributions)
- Vercel deployment working

**Exit Criteria**:
- All routes accessible
- Demo data displays correctly
- TypeScript compilation passes
- Build succeeds

**Not Included**: Real imports, authentication, backend

---

### Phase 1: Core UI & Demo Flows (COMPLETE)
**Status**: ✅ Complete  
**Duration**: 1 week  
**Outcome**: Polished demo experience with complete UI workflows

**Deliverables**:
- Student search and profile pages
- Reports with band distributions and grade averages
- Growth tracking (Fall to Spring)
- Responsive design for tablets
- Help documentation

**Exit Criteria**:
- All menu items have content
- Reports show aggregated data from demo dataset
- Student profiles display term-by-term results
- UI is non-technical-user friendly

**Not Included**: Real file parsing, data persistence, column mapping

---

### Phase 2: Real Data Import (MAJOR - COMPLETE)
**Status**: ✅ Complete  
**Duration**: 2 weeks  
**Outcome**: Production-ready import system with validation and persistence

**Deliverables**:
- Real CSV parsing (papaparse)
- Real XLSX parsing (exceljs - secure, no vulnerabilities)
- 6-step import wizard:
  1. Program selection (MAP-R/MCAP)
  2. File upload with parsing
  3. Data preview (first 10 rows)
  4. Column mapping with auto-match
  5. Validation with plain English errors
  6. Import completion
- Mapping profile save/load (localStorage)
- Data validation with "How to fix" suggestions
- localStorage persistence
- Demo Mode / Live Mode toggle
- MCAP program support (writing rubric)
- Program switching in reports

**Exit Criteria**: ✅ All Complete
- ✅ Upload CSV with 200 students → parses successfully
- ✅ Upload XLSX → parses successfully
- ✅ Column auto-matching works for common patterns
- ✅ Mapping profiles save and load
- ✅ Validation catches errors (duplicate IDs, invalid ranges)
- ✅ Reports display imported data
- ✅ Student profiles show imported results
- ✅ Reset Data returns to demo mode
- ✅ Zero security vulnerabilities

**Not Included**: Backend storage, multi-user support, authentication, API

---

### Phase 3: Testing & Quality Assurance (NEXT)
**Status**: 🟡 Pending  
**Duration**: 1 week  
**Outcome**: Production-ready quality with comprehensive testing

**Gate**: Cannot begin until Phase 2 is 100% complete (✅ PASSED)

**Deliverables**:
- Manual acceptance test execution
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile/tablet responsiveness testing
- Performance testing (1000+ students)
- Security audit (dependency checks, CSP headers)
- Accessibility audit (WCAG 2.1 AA basics)
- Error handling testing (corrupted files, missing columns)
- Documentation review and updates

**Exit Criteria**:
- All acceptance tests pass
- No critical bugs
- Performance acceptable (<3s page loads)
- Security audit clean
- Documentation complete

**Not Included**: Automated test suite, load testing, penetration testing

---

### Phase 4: Pilot Readiness
**Status**: ⚪ Not Started  
**Duration**: 1 week  
**Outcome**: Ready for 1-3 pilot schools

**Deliverables**:
- Onboarding documentation for schools
- Data export templates (MAP-R, MCAP formats)
- Admin guide (import, troubleshooting)
- Feedback collection system
- Analytics (usage tracking - privacy-safe)
- Railway backend deployment (basic API)
- Environment variable management
- Backup/restore procedures

**Exit Criteria**:
- Pilot school can import their own data
- Documentation is sufficient for non-technical users
- Support process established
- Data backup verified

**Not Included**: Multi-tenancy, SSO, SIS integration

---

### Phase 5: District Scale
**Status**: ⚪ Not Started  
**Duration**: 2-3 weeks  
**Outcome**: Multi-school district support

**Deliverables**:
- Multi-tenant data isolation
- District-level reporting
- School admin role
- Bulk student import (district-wide)
- Data retention policies
- Audit logging
- Performance optimization for 10K+ students
- Template-driven rules engine (custom percentile norms)

**Exit Criteria**:
- District with 3+ schools can use platform
- District admin can view cross-school reports
- Performance acceptable with 10K+ students
- Data isolation verified

**Not Included**: Payments, SIS sync, mobile app, parent portal

---

## Future Phases (Post-v1)

### Phase 6: Advanced Features (Backlog)
- DIBELS-specific workflows
- Custom report builder
- Data export to CSV/PDF
- Email notifications (opt-in)
- Rostering import

### Phase 7: Enterprise Features (Backlog)
- SSO/SAML integration
- API for third-party tools
- Webhooks
- Advanced role-based access control
- Compliance certifications (SOC 2)

---

## Timeline Summary

| Phase | Duration | Status | Start | End |
|-------|----------|--------|-------|-----|
| Phase 0 | 1 week | ✅ Complete | - | - |
| Phase 1 | 1 week | ✅ Complete | - | - |
| Phase 2 | 2 weeks | ✅ Complete | - | 2026-02-16 |
| Phase 3 | 1 week | 🟡 Next | TBD | TBD |
| Phase 4 | 1 week | ⚪ Planned | TBD | TBD |
| Phase 5 | 2-3 weeks | ⚪ Planned | TBD | TBD |

**Total to v1.0**: ~7-8 weeks

---

## Success Metrics

### Phase 2 (Current)
- ✅ CSV/XLSX import success rate: 100%
- ✅ Zero critical security vulnerabilities
- ✅ Build time: <60 seconds
- ✅ TypeScript errors: 0

### Phase 3 (Target)
- All acceptance tests pass
- No P0/P1 bugs
- Page load <3 seconds
- Accessibility score >85

### Phase 4 (Target)
- Pilot school onboarding time <30 minutes
- Support tickets <5 per week per school
- Data import success rate >95%

### Phase 5 (Target)
- District onboarding time <2 hours
- Cross-school report generation <10 seconds
- Data isolation verified (0 leaks)
- Performance with 10K students <5s page loads

---

## Contact & Governance

**Project Owner**: TBD  
**Technical Lead**: TBD  
**Roadmap Updates**: Monthly or after major phase completion  
**Change Control**: See SCOPE_GUARDRAILS.md
