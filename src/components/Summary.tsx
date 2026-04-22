import type { FileReport } from '../lib/types';
import './Summary.css';

interface SummaryProps {
  report: FileReport;
}

export default function Summary({ report }: SummaryProps) {
  const passRate = report.totalLines === 0 ? 0 : (report.passed / report.totalLines) * 100;

  return (
    <div className="summary">
      <div className="summary__card">
        <div className="summary__label">Total</div>
        <div className="summary__value">{report.totalLines}</div>
      </div>
      <div className="summary__card summary__card--green">
        <div className="summary__label">Passed</div>
        <div className="summary__value">{report.passed}</div>
      </div>
      <div className="summary__card summary__card--red">
        <div className="summary__label">Failed</div>
        <div className="summary__value">{report.failed}</div>
      </div>
      <div className="summary__card">
        <div className="summary__label">Pass rate</div>
        <div className="summary__value">{passRate.toFixed(1)}%</div>
      </div>
    </div>
  );
}
