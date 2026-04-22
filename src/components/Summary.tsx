import { useEffect, useState } from 'react';
import type { FileReport } from '../lib/types';
import './Summary.css';

interface SummaryProps {
  report: FileReport;
}

function useCountUp(target: number, duration = 640): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export default function Summary({ report }: SummaryProps) {
  const rate = report.totalLines === 0 ? 0 : (report.passed / report.totalLines) * 100;
  const total = useCountUp(report.totalLines);
  const passed = useCountUp(report.passed);
  const failed = useCountUp(report.failed);
  const rateShown = useCountUp(Math.round(rate * 10)) / 10;

  const status =
    rate === 100
      ? 'ready to ship'
      : rate >= 90
      ? 'minor cleanup'
      : rate >= 70
      ? 'needs review'
      : rate >= 40
      ? 'substantial rework'
      : 'significant remediation';

  const statusTone =
    rate === 100 ? 'ok' : rate >= 90 ? 'watch' : rate >= 70 ? 'warn' : 'alert';

  return (
    <section className="summary" aria-label="Validation summary">
      <div className="summary-head">
        <div className="summary-head-left">
          <span className="summary-tag">Report</span>
          <h2 className="summary-title">Validation summary</h2>
        </div>
        <div className={`summary-verdict summary-verdict-${statusTone}`}>
          <span className="verdict-dot" aria-hidden />
          <span className="verdict-label">{status}</span>
        </div>
      </div>

      <div className="summary-grid">
        <article className="stat">
          <div className="stat-top">
            <span className="stat-label">Total lines</span>
          </div>
          <div className="stat-val">{total}</div>
          <div className="stat-sub">records processed</div>
        </article>

        <article className="stat stat-pass">
          <div className="stat-top">
            <span className="stat-label">
              <span className="stat-dot stat-dot-pass" aria-hidden />
              Passing
            </span>
            <span className="stat-share">{rate.toFixed(0)}%</span>
          </div>
          <div className="stat-val">{passed}</div>
          <div className="stat-bar" aria-hidden>
            <div
              className="stat-bar-fill stat-bar-pass"
              style={{ width: `${rate}%` }}
            />
          </div>
        </article>

        <article className="stat stat-fail">
          <div className="stat-top">
            <span className="stat-label">
              <span className="stat-dot stat-dot-fail" aria-hidden />
              Flagged
            </span>
            <span className="stat-share">{(100 - rate).toFixed(0)}%</span>
          </div>
          <div className="stat-val">{failed}</div>
          <div className="stat-bar" aria-hidden>
            <div
              className="stat-bar-fill stat-bar-fail"
              style={{ width: `${100 - rate}%` }}
            />
          </div>
        </article>

        <article className="stat stat-rate">
          <div className="stat-top">
            <span className="stat-label">Pass rate</span>
          </div>
          <div className="stat-val stat-val-accent">
            {rateShown.toFixed(1)}
            <span className="stat-val-unit">%</span>
          </div>
          <div className="stat-sub">compliance score</div>
        </article>
      </div>
    </section>
  );
}
