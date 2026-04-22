import { useMemo, useState } from 'react';
import type { FileReport, LineResult } from '../lib/types';
import './ReportTable.css';

type Filter = 'all' | 'passed' | 'failed';

interface ReportTableProps {
  report: FileReport;
}

const FILTER_LABELS: Record<Filter, string> = {
  all: 'All',
  failed: 'Flagged',
  passed: 'Passing',
};

export default function ReportTable({ report }: ReportTableProps) {
  const [filter, setFilter] = useState<Filter>('failed');
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const rows: LineResult[] = useMemo(() => {
    if (filter === 'passed') return report.lines.filter((l) => l.passed);
    if (filter === 'failed') return report.lines.filter((l) => !l.passed);
    return report.lines;
  }, [report, filter]);

  const toggle = (n: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  };

  const counts: Record<Filter, number> = {
    all: report.totalLines,
    failed: report.failed,
    passed: report.passed,
  };

  return (
    <section className="report" aria-label="Line-by-line report">
      <header className="report-head">
        <div className="report-head-left">
          <span className="report-tag">Log</span>
          <h2 className="report-title">Line-by-line</h2>
        </div>

        <nav className="report-tabs" role="tablist" aria-label="Filter rows">
          {(Object.keys(FILTER_LABELS) as Filter[]).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={filter === key}
              className={`tab${filter === key ? ' tab-active' : ''}`}
              onClick={() => setFilter(key)}
            >
              <span>{FILTER_LABELS[key]}</span>
              <span className="tab-count">{counts[key]}</span>
            </button>
          ))}
        </nav>
      </header>

      <div className="report-tablewrap">
        <table className="report-table">
          <thead>
            <tr>
              <th scope="col" className="c-line">Line</th>
              <th scope="col" className="c-type">Type</th>
              <th scope="col" className="c-status">Status</th>
              <th scope="col" className="c-notes">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => {
              const isExpanded = expanded.has(r.lineNumber);
              const hasContent = !r.passed || r.raw.length > 0;
              const recType = r.recordType.toLowerCase();
              return (
                <tr
                  key={r.lineNumber}
                  className={`row row-${r.passed ? 'ok' : 'fail'}`}
                  onClick={() => hasContent && toggle(r.lineNumber)}
                  style={{ animationDelay: `${Math.min(idx, 18) * 16}ms` }}
                >
                  <td className="c-line">{r.lineNumber}</td>
                  <td className="c-type">
                    <span className={`tag tag-${recType}`}>
                      {r.rawRecordType || '—'}
                    </span>
                  </td>
                  <td className="c-status">
                    <span className={`st st-${r.passed ? 'ok' : 'fail'}`}>
                      <span className="st-dot" aria-hidden />
                      {r.passed ? 'pass' : 'fail'}
                    </span>
                  </td>
                  <td className="c-notes">
                    {r.passed ? (
                      <span className="quiet">No issues — record conforms.</span>
                    ) : (
                      <ul className="notes">
                        {r.errors.map((e, i) => (
                          <li key={i}>
                            <span className="notes-bullet" aria-hidden>
                              ›
                            </span>
                            <span>{e.message}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {isExpanded && (
                      <pre
                        className="raw"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {r.raw}
                      </pre>
                    )}
                    {hasContent && (
                      <span className="expand-hint" aria-hidden>
                        {isExpanded ? (
                          <>− hide source line</>
                        ) : (
                          <>+ view source line</>
                        )}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <div className="report-empty">
          <div className="empty-ring" aria-hidden>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" />
              <path d="M8 12h8" strokeLinecap="round" />
            </svg>
          </div>
          <span>No entries match this filter.</span>
        </div>
      )}
    </section>
  );
}
