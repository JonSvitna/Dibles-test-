# Scope Guardrails - K-12 Assessment Platform

This document defines strict boundaries for what is **IN SCOPE** and **OUT OF SCOPE** for the v0-v1 product. Any feature request not listed as "In Scope" must go through change control and be assigned to a future phase.

---

## Core Principle

**This is a data import and visualization tool for school assessment coordinators.** It is NOT a comprehensive SIS, NOT a marketplace, NOT a parent communication tool.

---

## IN SCOPE (v0 - v1.0)

### Data Import
✅ CSV file import  
✅ XLSX file import  
✅ Column mapping with auto-match  
✅ Mapping profile save/load  
✅ Data validation with plain English errors  
✅ Manual data entry (MCAP rubric scores)  
⚪ Google Sheets export parsing (Phase 5)

### Assessment Programs
✅ MAP-R (RIT scores, percentiles, bands)  
✅ MCAP Writing (rubric scores)  
⚪ DIBELS (Phase 6)

### Reporting
✅ Band distribution by term  
✅ Average RIT by grade  
✅ Growth tracking (Fall to Spring)  
✅ MCAP category averages  
✅ Completion tracking  
✅ Program switching (MAP-R/MCAP)  
✅ Term switching (Fall/Winter/Spring)  
⚪ District-level aggregations (Phase 5)  
⚪ Custom report builder (Phase 6)

### User Interface
✅ Non-technical user language  
✅ Big buttons, short labels  
✅ Plain English error messages  
✅ "What this means" on all reports  
✅ "How to fix" on validation errors  
✅ Visual indicators (✅, ⚠️, ❌)  
✅ Responsive design (desktop, tablet)  
⚪ Mobile app (Phase 7)

### Data Storage
✅ localStorage (Phase 0-2)  
⚪ Backend database (Phase 4+)  
⚪ Multi-tenancy (Phase 5)

### Security & Privacy
✅ No third-party data sharing  
✅ Client-side only processing (Phase 0-2)  
✅ FERPA-aligned data handling  
✅ Zero vulnerable dependencies  
⚪ Data encryption at rest (Phase 4+)  
⚪ SSO/SAML (Phase 7)  
⚪ SOC 2 compliance (Phase 7)

### Deployment
✅ Vercel (frontend)  
⚪ Railway (backend, Phase 4+)  
⚪ CDN for static assets (Phase 5)

---

## OUT OF SCOPE (v0 - v1.0)

### ❌ Payments & Billing
- No in-app purchases
- No subscription management
- No payment processing
- No invoicing
- **Reason**: Schools operate on annual contracts negotiated offline

### ❌ Marketplace & Third-Party Add-Ons
- No plugin marketplace
- No third-party app integrations (beyond API in Phase 7)
- No custom add-on purchases
- **Reason**: Scope creep, security complexity

### ❌ AI & Machine Learning
- No AI-powered insights
- No predictive analytics
- No automated scoring
- No recommendation engine
- **Reason**: Complexity, inaccuracy risk, regulatory concerns

### ❌ Authentication (Phase 0-3)
- No login system in early phases
- No password management
- No user accounts
- **Reason**: Demo mode first, auth in Phase 4+

### ❌ Single Sign-On (SSO/SAML)
- No Google Workspace SSO
- No Microsoft 365 SSO
- No Clever integration
- No SAML federation
- **Reason**: Enterprise feature, deferred to Phase 7

### ❌ SIS Integrations
- No PowerSchool sync
- No Infinite Campus sync
- No Skyward integration
- No automatic rostering import
- **Reason**: Complex, vendor-specific, deferred to Phase 7

### ❌ Parent & Student Portals
- No parent access
- No student self-view
- No parent notifications
- **Reason**: Out of scope for educator tool, possible future phase

### ❌ Mobile Applications
- No iOS app
- No Android app
- No mobile-native features (camera, push notifications)
- **Reason**: Web-first, deferred to Phase 7

### ❌ Automated Communications
- No email campaigns
- No SMS notifications
- No automated alerts
- No scheduled reminders
- **Reason**: Not core to data visualization, privacy concerns

### ❌ Collaboration Features
- No real-time co-editing
- No commenting system (early phases)
- No team workspaces
- **Reason**: Single-user focus for v1

### ❌ Advanced Data Science
- No cohort analysis (beyond simple grouping)
- No statistical significance testing
- No z-scores or standard deviations (unless required by assessment)
- No growth models (beyond simple difference)
- **Reason**: Requires statistical expertise, accuracy liability

### ❌ Custom Assessment Builder
- No custom test creation
- No question bank
- No rubric builder (uses predefined rubrics)
- **Reason**: Outside core mission

### ❌ District Billing & Licensing
- No per-school billing
- No usage-based pricing
- No seat management
- **Reason**: Contract-based, handled offline

### ❌ Advanced Permissions
- No fine-grained permissions (early phases)
- No custom roles (beyond district admin, school admin)
- No teacher-level access controls (early phases)
- **Reason**: Complexity, deferred to Phase 5+

### ❌ Data Marketplace
- No selling anonymized data
- No data sharing with researchers
- No public datasets
- **Reason**: Privacy violation, ethical concerns

### ❌ Offline Mode (Desktop App)
- No Electron app
- No offline data sync
- **Reason**: Web-first, complex sync logic

---

## CHANGE CONTROL PROCESS

Any feature request not listed as "In Scope" must follow this process:

1. **Submission**: Feature request submitted via GitHub issue or internal tracker
2. **Classification**: Assign to OUT OF SCOPE category
3. **Phase Assignment**: Determine which future phase (if any) the feature belongs to
4. **Stakeholder Review**: Product owner reviews and approves/rejects
5. **Roadmap Update**: If approved, add to future phase in PHASES.md
6. **Communication**: Notify requester of decision and timeline

### Change Control Rules

- ❌ **No mid-phase additions**: Features cannot be added to an in-progress phase
- ✅ **Inter-phase additions**: Features can be added to future phases between phase gates
- ❌ **No scope creep**: "Small asks" must still go through change control
- ✅ **Bug fixes allowed**: Fixing broken functionality is not a scope change
- ✅ **Technical debt reduction**: Refactoring for maintainability is allowed within reason

---

## EXCEPTION PROCESS

In rare cases, a feature may be deemed critical mid-phase. This requires:

1. **Executive Sponsor Approval**: Product owner or executive must approve
2. **Impact Assessment**: Document impact on timeline, quality, and other work
3. **Trade-Off Decision**: Identify what will be delayed or cut to accommodate
4. **Documentation Update**: Update ROADMAP.md and PHASES.md immediately
5. **Team Communication**: Notify all stakeholders of scope change

**Criteria for Exception**:
- Legal/compliance requirement (e.g., FERPA violation discovered)
- Security vulnerability (e.g., zero-day exploit)
- Pilot school blocker (e.g., data format incompatibility)

---

## SCOPE VIOLATION EXAMPLES

### Example 1: "Can we add parent email notifications?"
- **Answer**: No, this is OUT OF SCOPE (automated communications)
- **Assigned To**: Phase 7 backlog (if ever)
- **Rationale**: Not core to educator tool, privacy concerns, complexity

### Example 2: "Can we support Google Sheets import?"
- **Answer**: Yes, but not now
- **Assigned To**: Phase 5 (district scale)
- **Rationale**: Common export format, but backend needed for OAuth

### Example 3: "Can we add AI-powered reading level predictions?"
- **Answer**: No, this is OUT OF SCOPE (AI features)
- **Assigned To**: Not planned
- **Rationale**: Accuracy liability, outside core competency, regulatory risk

### Example 4: "Can we fix the CSV parser to handle UTF-8 BOM?"
- **Answer**: Yes, this is a bug fix, not a scope change
- **Process**: Create bug ticket, prioritize, fix in current phase

---

## SCOPE EXPANSION CRITERIA

For a feature to be added to v2.0 or beyond, it must meet ALL of these criteria:

1. **Aligns with Core Mission**: Supports assessment data import/visualization
2. **Educator Value**: Directly helps school assessment coordinators or teachers
3. **Technically Feasible**: Can be built with existing tech stack
4. **Low Regulatory Risk**: Does not introduce FERPA, COPPA, or GDPR violations
5. **Sustainable**: Can be maintained with available team resources
6. **Differentiated**: Not easily solved by Excel or existing SIS tools

---

## SCOPE REDUCTION CRITERIA

A planned feature may be CUT from a phase if:

1. **Complexity Underestimated**: Taking 3x longer than planned
2. **Low Usage**: User research shows minimal value
3. **Regulatory Risk**: Legal/compliance team flags concern
4. **Technical Debt**: Would compromise system stability
5. **Resource Constraints**: Team capacity insufficient

**Process**: Document decision in ROADMAP.md, communicate to stakeholders, re-prioritize

---

## SCOPE REVIEW SCHEDULE

- **Weekly**: During active development (Phase 2-5)
- **Monthly**: During planning phases
- **Ad-Hoc**: When major feature request arrives

**Responsible**: Product owner, technical lead, project manager

---

## APPENDIX: COMMONLY REQUESTED FEATURES & RESPONSES

| Feature Request | In Scope? | Phase | Reason |
|-----------------|-----------|-------|--------|
| CSV import | ✅ Yes | Phase 2 | Core functionality |
| XLSX import | ✅ Yes | Phase 2 | Common format |
| Google Sheets import | ⚪ Future | Phase 5 | Requires OAuth, backend |
| PDF export | ⚪ Future | Phase 6 | Nice-to-have |
| Email reports | ❌ No | Never | Out of scope (automated comms) |
| Parent portal | ❌ No | Never (maybe Phase 8+) | Out of scope for v1 |
| AI insights | ❌ No | Never | Regulatory risk |
| Mobile app | ⚪ Future | Phase 7 | Enterprise feature |
| SSO | ⚪ Future | Phase 7 | Enterprise feature |
| SIS sync | ⚪ Future | Phase 7 | Complex, vendor-specific |
| Custom rubrics | ❌ No | TBD | Outside core mission |
| Intervention planning | ⚪ Future | Backlog | Adjacent feature |

---

**Last Updated**: 2026-02-16  
**Next Review**: After Phase 3 completion
