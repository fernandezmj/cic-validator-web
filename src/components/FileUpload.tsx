import { useCallback, useRef, useState } from 'react';
import './FileUpload.css';

interface FileUploadProps {
  onFile: (file: File) => void;
}

export default function FileUpload({ onFile }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) onFile(file);
    },
    [onFile],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div
      className={`drop ${dragOver ? 'drop-active' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <div className="drop-grid" aria-hidden />

      <div className="drop-body">
        <div className="drop-icon-ring" aria-hidden>
          <div className="drop-icon">
            <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M16 22V6" strokeLinecap="round" />
              <path d="M9 13l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 26h22" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <h2 className="drop-title">
          Drop your submission file
          <span className="drop-title-or"> — or click to browse</span>
        </h2>
        <p className="drop-hint">
          <code>.txt</code>, pipe-delimited, one <code>HD</code> header followed by{' '}
          <code>ID</code> rows.
        </p>

        <div className="drop-checks" aria-label="What we check">
          <div className="check">
            <span className="check-mark" aria-hidden>
              <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 6.5l2.5 2.5L10 3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="check-body">
              <span className="check-title">Schema</span>
              <span className="check-sub">Field count, types, fixed values, lengths</span>
            </div>
          </div>
          <div className="check">
            <span className="check-mark" aria-hidden>
              <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 6.5l2.5 2.5L10 3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="check-body">
              <span className="check-title">Domains</span>
              <span className="check-sub">ISO country &amp; currency, PSIC, enumerations</span>
            </div>
          </div>
          <div className="check">
            <span className="check-mark" aria-hidden>
              <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 6.5l2.5 2.5L10 3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="check-body">
              <span className="check-title">Cross-field</span>
              <span className="check-sub">Address logic, paired fields, age, ref-date</span>
            </div>
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".txt,text/plain"
        hidden
        onChange={handleChange}
      />
    </div>
  );
}
