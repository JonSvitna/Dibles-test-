# Acceptance Tests - K-12 Assessment Platform

This document provides manual acceptance tests for each phase. Tests should be executed before marking a phase as complete.

---

## Test Execution Guidelines

- **Environment**: Use production-like environment (Vercel preview or production)
- **Browser**: Test on Chrome (primary), Firefox, Safari, Edge
- **Data**: Use realistic test data (anonymized if real)
- **Recording**: Take screenshots of each step for documentation
- **Pass Criteria**: All steps complete without errors; UI behaves as expected

---

## Phase 0: Foundation ✅

### Test 0.1: Navigation
1. Visit home page
2. Click on each navigation link (Home, Import, Reports, Students, Help)
3. Verify each page loads without errors
4. **Pass**: All routes accessible

### Test 0.2: Demo Data Display
1. Go to Reports page
2. Verify demo data shows: band distribution, grade averages
3. **Pass**: Data displays correctly

### Test 0.3: Build & Deploy
1. Run `npm run build` locally
2. Verify build succeeds (no errors)
3. Check Vercel deployment URL
4. **Pass**: Build green, site accessible

---

## Phase 1: Core UI & Demo Flows ✅

### Test 1.1: Student Search
1. Go to Students page
2. Type "Emma" in search box
3. Verify results filter to students with "Emma" in name
4. Click on a student
5. **Pass**: Student profile loads

### Test 1.2: Student Profile
1. On student profile, verify:
   - Student ID displayed
   - Grade displayed
   - Growth (Spring-Fall) calculated
   - MAP-R results table shows Fall, Winter, Spring
2. **Pass**: All data present

### Test 1.3: Reports - Term Switching
1. Go to Reports page
2. Click "Fall", "Winter", "Spring" buttons
3. Verify band distribution changes with each term
4. **Pass**: Data updates correctly

### Test 1.4: Reports - By Grade
1. Go to Reports page, click "By Grade" tab
2. Select Grade 3
3. Verify grade-specific data shows
4. **Pass**: Grade filtering works

---

## Phase 2: Real Data Import ✅

### Test 2.1: CSV Import - Complete Flow
1. Prepare CSV file with 10 students, columns: Student ID, First Name, Last Name, Grade, Term, RIT, Percentile
2. Go to Import page
3. **Step 1**: Select MAP-R program → Click Next
4. **Step 2**: Upload CSV file → Verify "File parsed successfully! Found 10 rows" message
5. **Step 3**: Review preview → Verify first 10 rows display correctly
6. **Step 4**: Review column mapping → Verify all fields auto-matched
7. **Step 5**: Review validation → Verify "All Checks Passed" message
8. **Step 6**: Click "Complete" → Verify import completes
9. Go to Reports page → Verify data mode shows "Live Mode"
10. **Pass**: CSV import complete, data shows in reports

### Test 2.2: XLSX Import
1. Prepare XLSX file with same data as CSV
2. Go to Import page
3. Complete steps 1-6 (same as Test 2.1)
4. **Pass**: XLSX import works same as CSV

### Test 2.3: Column Auto-Matching
1. Create CSV with columns: "ID", "First", "Last", "Gr", "Testing Term", "Score", "%ile"
2. Import file
3. **Step 4**: Verify column mapping auto-matches:
   - "ID" → student_id
   - "First" → first_name
   - "Last" → last_name
   - "Gr" → grade
   - "Testing Term" → term
   - "Score" → rit
   - "%ile" → percentile
4. **Pass**: Auto-matching works for variations

### Test 2.4: Manual Column Mapping
1. Import CSV with unmapped columns
2. **Step 4**: Click "Adjust Column Mapping"
3. Modal opens with "Map Columns" tab
4. Manually select correct column for each field
5. Click "Apply Mapping"
6. **Pass**: Manual mapping persists, allows proceeding

### Test 2.5: Mapping Profile Save/Load
1. Complete manual column mapping
2. Enter profile name "District Export Format"
3. Click "Save"
4. Verify "Mapping profile saved!" message
5. Start new import with same CSV
6. **Step 4**: Click "Adjust Column Mapping" → "Saved Profiles" tab
7. Verify "District Export Format" profile is listed
8. Click "Use This Profile"
9. Verify mapping applied, modal closes
10. **Pass**: Profile saves and loads correctly

### Test 2.6: Validation - Errors
1. Create CSV with intentional errors:
   - Row 2: Missing Student ID
   - Row 3: Duplicate Student ID (same as Row 1)
   - Row 4: Grade = 15 (invalid)
   - Row 5: Percentile = 150 (invalid)
   - Row 6: RIT = 50 (warning)
2. Import file
3. **Step 5**: Verify validation shows:
   - 4 errors (missing ID, duplicate ID, invalid grade, invalid percentile)
   - 1 warning (RIT unusual)
   - Plain English messages with "How to fix" suggestions
4. Verify "Next" button is disabled (errors prevent import)
5. **Pass**: Validation catches errors, blocks import

### Test 2.7: Validation - Pass
1. Import clean CSV (no errors)
2. **Step 5**: Verify "All Checks Passed" message
3. Verify green checkmark icon
4. Verify "Next" button is enabled
5. **Pass**: Validation passes for clean data

### Test 2.8: Reports - Program Switching
1. Complete import of MAP-R data
2. Go to Reports page
3. Verify "Program" selector shows MAP-R and MCAP options
4. Click "MAP-R" → Verify MAP-R reports show
5. Click "MCAP" → Verify MCAP reports show (empty if no MCAP data)
6. **Pass**: Program switcher works

### Test 2.9: Student Profile - Multiple Programs
1. Import MAP-R data
2. Import MCAP data (same students)
3. Go to Students page, search for a student
4. Open student profile
5. Verify both MAP-R and MCAP sections display
6. **Pass**: Both programs show on profile

### Test 2.10: Reset Data
1. Import custom data (Live Mode active)
2. Go to Reports page
3. Verify "Data Mode: Live Mode" badge shows
4. Click "Reset Data" button
5. Confirm dialog
6. Verify page reloads
7. Verify "Data Mode: Demo Mode" badge shows
8. Verify demo data (200 students) is back
9. **Pass**: Reset returns to demo mode

### Test 2.11: Term Selection (Missing Term Column)
1. Create CSV without "Term" column
2. Import file
3. **Step 4**: Verify yellow warning: "Your file doesn't have a term column. Please select which term this data is for:"
4. Verify term selector (Fall/Winter/Spring) displays
5. Select "Fall"
6. Proceed to validation and import
7. Go to Reports, select Fall term
8. Verify imported data shows in Fall
9. **Pass**: Term selection works when column missing

---

## Phase 3: Testing & Quality Assurance 🟡 NEXT

### Test 3.1: Browser Compatibility
1. Test all Phase 2 flows on:
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)
   - Edge (latest)
2. **Pass**: All features work on all browsers

### Test 3.2: Tablet Responsiveness
1. Open site on iPad (or Chrome DevTools with iPad size)
2. Navigate through all pages
3. Test import wizard on tablet
4. **Pass**: UI is usable on tablet (no horizontal scroll, buttons accessible)

### Test 3.3: Performance - Large Dataset
1. Create CSV with 1000 students
2. Import file
3. Measure time for:
   - File parsing: <5 seconds
   - Preview rendering: <3 seconds
   - Validation: <10 seconds
   - Import completion: <10 seconds
4. Go to Reports page
5. Measure page load time: <3 seconds
6. **Pass**: Performance acceptable

### Test 3.4: Error Handling - Corrupted File
1. Create corrupted CSV (invalid UTF-8, missing quotes)
2. Upload file
3. Verify clear error message shows
4. **Pass**: Error handled gracefully, no crash

### Test 3.5: Error Handling - Wrong File Type
1. Upload .pdf file
2. Verify error: "Unsupported file type"
3. **Pass**: Validates file type

### Test 3.6: Accessibility - Keyboard Navigation
1. Use Tab key to navigate import wizard
2. Verify all buttons, inputs, dropdowns are keyboard-accessible
3. Test form submission with Enter key
4. **Pass**: No keyboard traps, all features accessible

### Test 3.7: Accessibility - Screen Reader (Basic)
1. Use screen reader (NVDA, JAWS, VoiceOver)
2. Navigate Reports page
3. Verify tables are announced correctly
4. Verify buttons have clear labels
5. **Pass**: Basic screen reader compatibility

### Test 3.8: Security - Dependency Audit
1. Run `npm audit` in /apps/web-next
2. Verify output: "found 0 vulnerabilities"
3. **Pass**: No vulnerabilities

### Test 3.9: Security - No Exposed Secrets
1. Search codebase for:
   - API keys
   - Passwords
   - Tokens
2. Verify none found
3. **Pass**: No secrets committed

### Test 3.10: Security - localStorage Isolation
1. Import data in Browser A
2. Open site in Browser B (different browser or incognito)
3. Verify Browser B shows demo data (not Browser A's data)
4. **Pass**: Data isolated per browser

---

## Phase 4: Pilot Readiness ⚪

### Test 4.1: School Onboarding
1. Give onboarding guide to pilot school contact
2. Time how long it takes to complete first import
3. Target: <30 minutes
4. **Pass**: School successfully imports their data in <30 minutes

### Test 4.2: Data Export Template
1. Download MAP-R export template
2. Fill in with test data
3. Import template
4. **Pass**: Template imports without errors

### Test 4.3: Backend API - Health Check
1. Visit `/api/health` endpoint (Railway backend)
2. Verify response: `{"status":"ok"}`
3. **Pass**: Backend is up

### Test 4.4: Backend API - Data Persistence
1. Import data via frontend (connected to backend)
2. Close browser
3. Reopen browser, go to Reports
4. Verify data persists (from database, not localStorage)
5. **Pass**: Backend persistence working

### Test 4.5: Backup/Restore
1. Export all data via admin panel
2. Delete database
3. Restore from backup
4. Verify all data returns
5. **Pass**: Backup/restore works

---

## Phase 5: District Scale ⚪

### Test 5.1: Multi-Tenancy - Data Isolation
1. Log in as School A admin
2. Import data for School A
3. Log in as School B admin
4. Verify School B cannot see School A's data
5. **Pass**: Data isolation verified

### Test 5.2: District Reports
1. Log in as district admin
2. View district-level report
3. Verify aggregates from all schools
4. **Pass**: District reports work

### Test 5.3: Performance - 10K Students
1. Import 10,000 students (district-wide)
2. Measure Reports page load time: <5 seconds
3. Measure search time: <2 seconds
4. **Pass**: Performance acceptable at scale

### Test 5.4: Audit Logging
1. Perform admin action (import data, view student)
2. Check audit log
3. Verify action is logged with user, timestamp, details
4. **Pass**: Audit logging works

---

## Test Failure Protocol

If a test fails:
1. **Log Issue**: Create GitHub issue with:
   - Test ID and name
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/videos
   - Browser/environment details
2. **Prioritize**: Assign severity (P0-P3)
   - P0: Blocks import, data loss risk → Fix immediately
   - P1: Major feature broken → Fix before phase exit
   - P2: Minor bug, workaround exists → Fix in next sprint
   - P3: Polish, edge case → Fix in future phase
3. **Fix**: Developer assigned, fix implemented
4. **Retest**: Tester verifies fix, marks test as passed
5. **Document**: Update test if needed, document known limitations

---

## Test Sign-Off

Each phase requires sign-off from:
- **Tech Lead**: All technical tests pass
- **Product Owner**: All user-facing tests pass
- **QA Lead**: No P0/P1 bugs remaining

**Phase 2 Sign-Off** ✅:
- Tech Lead: Signed (2026-02-16)
- Product Owner: Signed (2026-02-16)
- QA Lead: Signed (2026-02-16)

---

**Last Updated**: 2026-02-16  
**Next Update**: After Phase 3 completion
