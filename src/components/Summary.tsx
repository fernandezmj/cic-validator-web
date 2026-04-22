import type { FileReport } from '../lib/types';
import './Summary.css';

interface SummaryProps {
  report: FileReport;
}

export default function Summary({ report }: SummaryProps) {
  const passRate = report.totalLines === 0 ? 0 : (report.passed / report.totalLines) * 100;

  return (
    <div className="summary">
      <div className="summary-card">
        <div className="summary-label">Total</div>
        <div className="summary-value">{report.totalLines}</div>
      </div>
      <div className="summary-card summary-card--green">
        <div className="summary-label">Passed</div>
        <div className="summary-value">{report.passed}</div>
      </div>
      <div className="summary-card summary-card--red">
        <div className="summary-label">Failed</div>
        <div className="summary-value">{report.failed}</div>
      </div>
      <div className="summary-card">
        <div className="summary-label">Pass rate</div>
        <div className="summary-value">{passRate.toFixed(1)}%</div>
      </div>
    </div>
  );
}
