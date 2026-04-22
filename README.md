# CIC Submission File Validator — Web

Vite + React + TypeScript UI for validating CIC submission files. Shares its validation logic with the companion `cic-validator-cli` repository.

## Quick start

```bash
npm install
npm run dev
```

Then open the printed URL (default `http://localhost:5173`) and drop in `test-submit-data.txt`.

## Build

```bash
npm run build
npm run preview
```

## What's inside

| Path | Purpose |
|---|---|
| `src/lib/` | Framework-agnostic validator — **identical source as the CLI repo's `src/`** |
| `src/components/FileUpload.tsx` | Drag-drop + click-to-browse uploader |
| `src/components/Summary.tsx` | Pass/fail/total count cards |
| `src/components/ReportTable.tsx` | Per-line report with filter tabs and expandable raw line |
| `src/App.tsx` | Composition + state |

## Design notes

- **Validation runs entirely in the browser.** `File.text()` → `validateFile()`. No server, no upload, file never leaves the device.
- **Pure validator.** `src/lib/validator.ts` imports nothing from React or the DOM. It is the same module shipped in the CLI repo; you could `npm pack` it as a shared library if you needed to.
- **Large files.** For the 101-line test file, validation is instantaneous. For files in the millions of records, you'd move validation to a Web Worker — the pure module ports cleanly.

## Known limitations

These are conscious scope decisions, documented so reviewers can see what's in and out.

- **MFI vs non-MFI provider gating is not enforced.** The spec gates several fields (Address 2 mandatoriness, ID34 StreetNo, ID36 Subdivision, Contact mandatoriness) on whether the provider is a Microfinance Institution. MFI status is not present in the file itself, so it cannot be determined from the data alone. A production build would take this as a per-provider configuration input.
- **HD3 File Reference Date is compared only to ID4 Subject Reference Date.** The spec states HD3 must be "≥ all other Reference Dates in the file," but other D-typed fields (DOB, ID issue/expiry, hire dates, occupied-since) are not business "reference dates" in the submission sense — they're historical facts. Only the pairing with Subject Ref Date is validated.
- **Country domain is a condensed ISO 3166-1 alpha-2 subset** (~200 codes, covers all countries in the test data). A production build should use a canonical list such as `i18n-iso-countries`.
- **Currency domain is a common subset** including PHP, USD, EUR, JPY, etc. Same caveat — a production build should integrate an authoritative reference.
- **PSIC (ID85) and PSOC (ID92) domains are not enforced.** Their reference tables are not included in the rules summary provided.
- **`File.text()` buffers the whole file into memory.** Acceptable for the 100 KB test file. For multi-megabyte files, move to `FileReader` streaming or a Web Worker.
- **Table is not virtualized.** Fine for hundreds of rows; for 10k+ rows you'd want `react-virtuoso` or similar.
- **No unit tests.** Validator logic is covered end-to-end by the CLI repo running against the provided `test-submit-data.txt`.
