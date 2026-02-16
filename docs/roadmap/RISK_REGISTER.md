# Risk Register - K-12 Assessment Platform

This document tracks known risks, their potential impact, and mitigation strategies.

---

## Risk Assessment Matrix

**Impact Scale**: Low (1) | Medium (2) | High (3) | Critical (4)  
**Likelihood Scale**: Low (1) | Medium (2) | High (3) | Very High (4)  
**Priority**: Impact × Likelihood

---

## Active Risks

| ID | Risk | Impact | Likelihood | Priority | Mitigation | Owner | Status |
|----|------|--------|------------|----------|------------|-------|--------|
| R001 | Student data privacy breach | 4 | 2 | 8 | Client-side only (Phase 0-2), encryption at rest (Phase 4+), FERPA-aligned policies, regular security audits | Tech Lead | 🟢 Mitigated |
| R002 | Inaccurate percentile norms | 3 | 2 | 6 | Use official MAP-R/MCAP documentation, validate with real data, clear disclaimers that norms are estimates | Product Owner | 🟡 Monitoring |
| R003 | IP/Licensing violations (DIBELS/MAP/MCAP) | 4 | 1 | 4 | Legal review of trademarked terms, use generic terminology, no proprietary scoring algorithms, obtain licenses if needed | Legal | 🟢 Mitigated |
| R004 | Railway deployment failures | 2 | 3 | 6 | Force RAILPACK builder (railway.json), test builds before merging, maintain Vercel fallback, document rollback procedure | DevOps | 🟢 Mitigated |
| R005 | Template variability (schools use different export formats) | 3 | 4 | 12 | Column auto-matching with 90%+ accuracy, mapping profiles, clear import wizard, comprehensive help docs | Product Owner | 🟡 Monitoring |
| R006 | Scope creep (feature requests mid-phase) | 3 | 3 | 9 | Strict change control process (SCOPE_GUARDRAILS.md), weekly scope reviews, stakeholder communication | PM | 🟢 Mitigated |
| R007 | Performance degradation (1000+ students) | 3 | 2 | 6 | Pagination, lazy loading, database indexing (Phase 4+), React.memo optimization, load testing | Tech Lead | 🟡 Monitoring |
| R008 | Browser compatibility issues | 2 | 2 | 4 | Test on Chrome, Firefox, Safari, Edge, polyfills for older browsers, fallback UI | Frontend Dev | 🟢 Mitigated |
| R009 | Dependency vulnerabilities (security) | 4 | 2 | 8 | Weekly `npm audit`, automated dependency updates (Dependabot), replace vulnerable packages immediately | Tech Lead | 🟢 Mitigated |
| R010 | Pilot school abandonment (poor UX) | 3 | 2 | 6 | User testing before Phase 4, onboarding wizard, comprehensive help docs, responsive support | Product Owner | 🟡 Monitoring |
| R011 | Data loss (no backups in Phase 0-3) | 3 | 2 | 6 | localStorage warnings, export data functionality, backend backups in Phase 4+ | Tech Lead | 🟡 Monitoring |
| R012 | Incorrect band calculations | 3 | 1 | 3 | Unit tests for band logic, validate against official norms, peer review calculations | Tech Lead | 🟢 Mitigated |
| R013 | Vercel deployment limits (bandwidth/build minutes) | 2 | 1 | 2 | Monitor usage, optimize assets, upgrade plan if needed | DevOps | 🟢 Mitigated |
| R014 | LocalStorage size limits (5-10MB) | 2 | 3 | 6 | Warn users at 80% capacity, compress data, backend migration in Phase 4+ | Tech Lead | 🟡 Monitoring |
| R015 | Unclear error messages (user confusion) | 2 | 2 | 4 | Plain English validation, "How to fix" suggestions, contextual help, user testing | UX Lead | 🟢 Mitigated |

---

## Retired Risks

| ID | Risk | Resolution | Date Closed |
|----|------|------------|-------------|
| R016 | xlsx package vulnerabilities (Prototype Pollution, ReDoS) | Replaced with exceljs v4.4.0, npm audit shows 0 vulnerabilities | 2026-02-16 |

---

## Risk Status Definitions

- 🟢 **Mitigated**: Controls in place, low residual risk
- 🟡 **Monitoring**: Mitigation in progress or requires ongoing attention
- 🔴 **Active**: High priority, immediate action required
- ⚪ **Retired**: No longer applicable

---

## Detailed Risk Analysis

### R001: Student Data Privacy Breach
**Description**: Unauthorized access to student assessment data (names, scores, IDs)

**Impact**: Legal liability, FERPA violation, reputational damage, loss of trust

**Likelihood**: Medium (client-side only in early phases reduces risk)

**Mitigation**:
- Phase 0-3: Client-side only processing, no server uploads
- localStorage is isolated per user/browser
- No third-party analytics or tracking
- Phase 4+: Add encryption at rest, row-level security, audit logging
- FERPA-aligned data handling policies
- Regular security audits
- Clear privacy policy for schools

**Monitoring**: Security audit after each major phase

---

### R002: Inaccurate Percentile Norms
**Description**: Platform shows incorrect percentile-to-band mappings, leading to misidentification of student needs

**Impact**: Educational harm (students misclassified), loss of credibility

**Likelihood**: Medium (using unofficial norms as placeholder)

**Mitigation**:
- Use official NWEA MAP-R and MCAP documentation for norms
- Validate band calculations with real data samples
- Add disclaimers that norms are estimates (Phase 0-2)
- Allow district-configurable norms (Phase 5)
- Partner with assessment vendors for official norm data (future)

**Monitoring**: Validate against sample datasets from pilot schools

---

### R003: IP/Licensing Violations
**Description**: Unauthorized use of trademarked terms (DIBELS®, MAP®, MCAP®) or proprietary scoring algorithms

**Impact**: Cease-and-desist letter, legal fees, forced rebrand

**Likelihood**: Low (using generic terminology, no proprietary algorithms)

**Mitigation**:
- Legal review of all trademarked terms
- Use "MAP-R compatible" instead of "MAP-R assessment"
- No proprietary scoring algorithms (use public band cutoffs)
- Obtain licenses from assessment vendors if needed
- Clear attribution in documentation

**Monitoring**: Legal review before pilot launch

---

### R005: Template Variability
**Description**: Schools export data from different systems (NWEA, MAP Suite, district tools) with inconsistent column names and formats

**Impact**: Import failures, user frustration, support burden

**Likelihood**: Very High (every district is different)

**Mitigation**:
- Column auto-matching with 90%+ accuracy
- Mapping profiles save/load
- Preview step in import wizard
- Comprehensive help docs with examples
- Support for common export formats
- Feedback collection to improve auto-matching

**Monitoring**: Track import success rate, collect failure examples

---

### R006: Scope Creep
**Description**: Feature requests added mid-phase, delaying delivery and reducing quality

**Impact**: Missed deadlines, technical debt, burnout

**Likelihood**: High (stakeholders unaware of scope boundaries)

**Mitigation**:
- Strict change control process (SCOPE_GUARDRAILS.md)
- Weekly scope reviews
- Product owner has final say on scope
- Clear communication of phase goals
- Assign new requests to future phases
- Exception process for critical items only

**Monitoring**: Weekly scope review, phase exit criteria enforcement

---

### R009: Dependency Vulnerabilities
**Description**: npm packages have security vulnerabilities (e.g., xlsx Prototype Pollution)

**Impact**: Security breach, data exposure, compliance violation

**Likelihood**: Medium (common in JavaScript ecosystem)

**Mitigation**:
- Run `npm audit` weekly
- Automated dependency updates (Dependabot or Renovate)
- Replace vulnerable packages immediately (e.g., xlsx → exceljs)
- Pin versions to avoid breaking changes
- Review security advisories

**Monitoring**: Continuous (automated alerts)

**Recent Action**: Replaced xlsx v0.18.5 with exceljs v4.4.0 (2026-02-16)

---

### R014: LocalStorage Size Limits
**Description**: localStorage has 5-10MB limit, can be exceeded with large imports (1000+ students)

**Impact**: Import failures, data loss

**Likelihood**: Medium (likely with district-level imports)

**Mitigation**:
- Warn users at 80% capacity
- Compress data before storing
- Backend migration in Phase 4+ (no localStorage limits)
- Export data functionality (backup)
- Pagination for large datasets

**Monitoring**: Track localStorage usage, user feedback on import sizes

---

## Risk Response Strategies

### Avoidance
- Don't store sensitive data on client (use backend)
- Don't use proprietary algorithms (use public standards)

### Mitigation
- Column auto-matching reduces template variability
- Change control process prevents scope creep
- Security audits catch vulnerabilities early

### Transfer
- Legal review transfers IP risk to legal team
- School privacy policies transfer some liability to schools

### Acceptance
- Accept that some schools will have custom formats (niche edge cases)
- Accept that no system is 100% secure (residual risk)

---

## Risk Review Schedule

- **Weekly**: During active development (Phase 2-5)
- **Monthly**: During planning phases
- **Ad-Hoc**: When new risk identified

**Responsible**: Project Manager, Tech Lead, Product Owner

---

## Escalation Criteria

Escalate risk to executive sponsor if:
- Priority score > 12 (High × Very High)
- Mitigation requires >$10K spend
- Impacts pilot school launch date
- Legal or compliance concern

---

**Last Updated**: 2026-02-16  
**Next Review**: After Phase 3 completion or when new risk identified
