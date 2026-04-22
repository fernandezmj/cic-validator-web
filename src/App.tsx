import { useMemo, useState } from 'react';
import { validateFile } from './lib/validator';
import type { FileReport } from './lib/types';
import FileUpload from './components/FileUpload';
import Summary from './components/Summary';
import ReportTable from './components/ReportTable';
import './App.css';

function formatToday(): string {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export default function App() {
  const [report, setReport] = useState<FileReport | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const today = useMemo(formatToday, []);

  const handleFile = async (file: File) => {
    const text = await file.text();
    const t0 = performance.now();
    const r = validateFile(text.replace(/^﻿/, ''));
    const t1 = performance.now();
    setReport(r);
    setElapsedMs(Math.max(1, Math.round(t1 - t0)));
    setFileName(file.name);
  };

  const reset = () => {
    setReport(null);
    setFileName('');
    setElapsedMs(0);
  };

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden>
            <svg viewBox="0 0 28 28" width="24" height="24" fill="none">
              <circle cx="14" cy="14" r="11.5" stroke="currentColor" strokeWidth="1.2" />
              <path
                d="M3 16 Q 8 13, 14 16 T 25 16"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M5 19 Q 10 16.5, 14 19 T 23 19"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
                opacity="0.55"
              />
            </svg>
          </span>
          <span className="brand-lockup">
            <span className="brand-name">ICS</span>
            <span className="brand-sep" aria-hidden>
              /
            </span>
            <span className="brand-product">Submission Validator</span>
          </span>
        </div>

        <div className="status-strip" aria-label="Status">
          <span className="status-pill">
            <span className="status-dot" aria-hidden />
            <span>Local-only</span>
          </span>
          <span className="status-pill status-pill-ghost">
            <span>No data leaves your browser</span>
          </span>
        </div>

        <div className="topbar-meta">
          <span className="topbar-date">{today}</span>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-kicker">
            <span className="hero-kicker-dot" aria-hidden />
            Submission Pre-flight · v1.0
          </div>
          <h1 className="hero-title">
            Check your CIC file <span className="hero-title-accent">before</span>
            <br />
            you submit it.
          </h1>
          <p className="hero-sub">
            Real-time, line-by-line validation of pipe-delimited HD / ID submission
            files against the Credit Information Corporation's record schema.
            <span className="hero-sub-dim">
              {' '}
              Runs entirely in your browser — no upload, no network.
            </span>
          </p>

          <div className="hero-metrics" aria-label="At a glance">
            <div className="metric">
              <span className="metric-val">120+</span>
              <span className="metric-label">Rules enforced</span>
            </div>
            <div className="metric">
              <span className="metric-val">
                {report ? `${elapsedMs}ms` : '<1s'}
              </span>
              <span className="metric-label">
                {report ? 'Validated in' : 'Typical run'}
              </span>
            </div>
            <div className="metric">
              <span className="metric-val">100%</span>
              <span className="metric-label">Local execution</span>
            </div>
            <div className="metric metric-accent">
              <span className="metric-val">
                {report ? report.totalLines : '—'}
              </span>
              <span className="metric-label">Lines {report ? 'seen' : 'pending'}</span>
            </div>
          </div>
        </section>

        {!report && (
          <section className="stage">
            <FileUpload onFile={handleFile} />
          </section>
        )}

        {report && (
          <>
            <section className="filebar" aria-label="Current file">
              <div className="filebar-left">
                <span className="filebar-icon" aria-hidden>
                  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M4 2h8l4 4v12H4z" strokeLinejoin="round" />
                    <path d="M12 2v4h4" strokeLinejoin="round" />
                  </svg>
                </span>
                <div className="filebar-name-block">
                  <span className="filebar-label">File under audit</span>
                  <span className="filebar-name">{fileName}</span>
                </div>
              </div>
              <div className="filebar-timing">
                <span className="filebar-label">Completed in</span>
                <span className="filebar-elapsed">
                  {elapsedMs}<span className="filebar-elapsed-unit">ms</span>
                </span>
              </div>
              <button type="button" className="btn-ghost" onClick={reset}>
                Run another file
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </section>

            <Summary report={report} />
            <ReportTable report={report} />
          </>
        )}
      </main>

      <footer className="colophon">
        <div className="colophon-line">
          <span>
            Engine mirrors <code>cic-validator-cli</code> · pure TypeScript, zero
            network
          </span>
          <span className="colophon-dot" aria-hidden>
            ●
          </span>
          <span>
            Set in Hanken Grotesk &amp; JetBrains Mono
          </span>
        </div>
      </footer>
    </div>
  );
}
