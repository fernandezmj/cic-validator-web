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

- **MFI vs non-MFI provider gating is not enforced.** The spec gates several fields (Address 2 mandatoriness, ID34 StreetNo, ID36 Subdivision, Contact mandatoriness) on whether the provider is a Microfinance Institution. MFI status is not a field in the submission file — it is determined by the provider's registration with CIC. A production deployment would accept this as a per-provider configuration input. See the [CIC submitting-entities list](https://www.creditinfo.gov.ph/list-submitting-entities-production).
- **HD3 File Reference Date is compared only to ID4 Subject Reference Date.** The spec states HD3 must be "≥ all other Reference Dates in the file," but other D-typed fields (DOB, ID issue/expiry, hire dates, occupied-since) are historical facts, not business "reference dates." Only the pairing with Subject Ref Date is validated.
- **PSOC (ID92 — Occupation) is format-validated only.** The field is checked for digits-only and max length 4. PSOC 2012 has 456 unit groups under 43 sub-major groups that broadly align with ISCO-08; we have not been able to confirm a complete Philippine-specific sub-major list against an authoritative PSA publication, so we do not reject at the sub-major level to avoid false positives against legitimate Philippine codes. See the [PSA PSOC page](https://psa.gov.ph/classification/psoc).
- **Sole Trader cross-field rules (ID93–ID123) are not enforced.** The spec states rules "similar to Address 1" apply to Sole Trader addresses and that at least one Sole Trader Identification should be TIN when any are provided. Pair/length/domain validation on the individual fields still runs, but the cross-field logic mirror is not implemented.
- **`File.text()` buffers the whole file into memory.** Acceptable for the 100 KB test file. For multi-megabyte files, move to `FileReader` streaming or a Web Worker.
- **Table is not virtualized.** Fine for hundreds of rows; for 10k+ rows you'd want `react-virtuoso` or similar.
- **No unit tests.** Validator logic is covered end-to-end by the CLI repo running against the provided `test-submit-data.txt`.

### What was tightened in this revision

- **Country domain** now covers the complete ISO 3166-1 alpha-2 list (249 codes).
- **Currency domain** now covers the full set of active ISO 4217 national currencies (~152 codes).
- **PSIC (ID85)** now validates against the 88 real [PSIC 2009 divisions](https://psa.gov.ph/classification/psic) at the 2-digit prefix level. Higher-precision codes are accepted under any valid division.
