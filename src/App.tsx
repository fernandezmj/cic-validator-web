import { useState } from 'react';
import { validateFile } from './lib/validator';
import type { FileReport } from './lib/types';
import FileUpload from './components/FileUpload';
import Summary from './components/Summary';
import ReportTable from './components/ReportTable';
import './App.css';

export default function App() {
  const [report, setReport] = useState<FileReport | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFile = async (file: File) => {
    const text = await file.text();
    setReport(validateFile(text.replace(/^﻿/, '')));
    setFileName(file.name);
  };

  const reset = () => {
    setReport(null);
    setFileName('');
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>CIC Submission Validator</h1>
        <p className="app__sub">
          Validates pipe-delimited submission files against HD/ID record rules.
        </p>
      </header>

      {!report && <FileUpload onFile={handleFile} />}

      {report && (
        <>
          <div className="app__toolbar">
            <div className="app__filename">
              <span className="app__filename-icon">📄</span>
              <span>{fileName}</span>
            </div>
            <button onClick={reset}>Validate another file</button>
          </div>
          <Summary report={report} />
          <ReportTable report={report} />
        </>
      )}

      <footer className="app__footer">
        <p>
          Validator logic mirrors the companion <code>cic-validator-cli</code> repo —
          same pure TypeScript module, delivered via browser instead of stdin.
        </p>
      </footer>
    </div>
  );
}
