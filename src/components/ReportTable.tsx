import { useMemo, useState } from 'react';
import type { FileReport, LineResult } from '../lib/types';
import './ReportTable.css';

type Filter = 'all' | 'passed' | 'failed';

interface ReportTableProps {
  report: FileReport;
}

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

  return (
    <div className="report">
      <div className="report__filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({report.totalLines})
        </button>
        <button
          className={filter === 'failed' ? 'active' : ''}
          onClick={() => setFilter('failed')}
        >
          Failed ({report.failed})
        </button>
        <button
          className={filter === 'passed' ? 'active' : ''}
          onClick={() => setFilter('passed')}
        >
          Passed ({report.passed})
        </button>
      </div>

      <table className="report__table">
        <thead>
          <tr>
            <th style={{ width: 64 }}>Line</th>
            <th style={{ width: 96 }}>Type</th>
            <th style={{ width: 96 }}>Status</th>
            <th>Errors</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const isExpanded = expanded.has(r.lineNumber);
            const hasContent = !r.passed || r.raw.length > 0;
            return (
              <tr
                key={r.lineNumber}
                className={`report__row ${r.passed ? 'ok' : 'fail'}`}
                onClick={() => hasContent && toggle(r.lineNumber)}
              >
                <td className="num">{r.lineNumber}</td>
                <td>
                  <span className={`badge badge--${r.recordType.toLowerCase()}`}>
                    {r.rawRecordType || '(empty)'}
                  </span>
                </td>
                <td>
                  <span className={`status ${r.passed ? 'status--ok' : 'status--fail'}`}>
                    {r.passed ? 'PASS' : 'FAIL'}
                  </span>
                </td>
                <td>
                  {r.passed ? (
                    <span className="muted">—</span>
                  ) : (
                    <ul className="report__errors">
                      {r.errors.map((e, i) => (
                        <li key={i}>{e.message}</li>
                      ))}
                    </ul>
                  )}
                  {isExpanded && (
                    <pre className="report__raw" onClick={(e) => e.stopPropagation()}>
                      {r.raw}
                    </pre>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {rows.length === 0 && <div className="report__empty">No lines match this filter.</div>}
    </div>
  );
}
