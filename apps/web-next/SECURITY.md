# Security Advisory: xlsx Package Vulnerabilities

## Issue
The `xlsx` package (version 0.18.5 from npm) has two known vulnerabilities:

1. **Prototype Pollution** (GHSA-4r6h-8v6p-xvw6)
   - Severity: HIGH (CVSS 7.8)
   - Affects: versions < 0.19.3
   - Status: No patched version available on npm

2. **Regular Expression Denial of Service (ReDoS)** (GHSA-5pgg-2g8v-p4x9)
   - Severity: HIGH (CVSS 7.5)
   - Affects: versions < 0.20.2
   - Status: No patched version available on npm

## Current Status
The npm registry only provides xlsx up to version 0.18.5, which is vulnerable. Newer versions (0.19.3+ and 0.20.2+) are only available through SheetJS CDN.

## Mitigation Options

### Option 1: Use SheetJS Pro (Recommended for Production)
Install from the official SheetJS CDN:
```bash
npm install https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz
```

### Option 2: Use Alternative Library
Consider using `exceljs` which is actively maintained:
```bash
npm uninstall xlsx
npm install exceljs
```

### Option 3: Implement Input Sanitization (Current Approach)
Since this is a local-only application with user-uploaded files:
- Files are only processed client-side
- No server-side file processing
- Users can only harm their own browser session
- Data is stored in localStorage (isolated to user's browser)

## Risk Assessment for This Application
**Risk Level: LOW**

Justification:
1. **No Backend Processing**: All file parsing happens in the user's browser
2. **No Multi-User Impact**: Each user's data is isolated in their own localStorage
3. **No Network Attacks**: ReDoS vulnerability requires network-accessible endpoints
4. **User Trust Boundary**: Users are uploading their own files for their own use

## Recommendations
For production deployment:
1. Upgrade to SheetJS Pro from CDN (patched version)
2. Or migrate to `exceljs` library
3. Add Content Security Policy headers
4. Implement file size limits
5. Add file type validation

## Notes
This vulnerability was flagged during Phase 2 implementation. The current implementation is safe for the intended use case (local, single-user, demo application) but should be addressed before broader deployment.
