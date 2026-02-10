import { FeedbackEntry } from '../types/feedback';
import './DataPreview.css';

interface DataPreviewProps {
  data: FeedbackEntry[];
  onAnalyze: () => void;
  onBack: () => void;
}

export default function DataPreview({ data, onAnalyze, onBack }: DataPreviewProps) {
  const columns = data.length > 0 
    ? Object.keys(data[0]) 
    : [];

  const previewRows = data.slice(0, 5);

  return (
    <div className="data-preview-container">
      <div className="preview-card">
        <h2>Data Preview</h2>
        <p className="preview-info">{data.length} feedback entries ready to analyze</p>

        <div className="preview-table">
          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={`${i}-${col}`} className="cell">
                      <span title={String(row[col as keyof FeedbackEntry] || '')}>
                        {row[col as keyof FeedbackEntry] || '—'}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.length > 5 && (
          <p className="more-rows">... and {data.length - 5} more rows</p>
        )}

        <div className="action-buttons">
          <button className="btn-secondary" onClick={onBack}>
            Change Data
          </button>
          <button className="btn-primary" onClick={onAnalyze}>
            Analyze with Claude AI
          </button>
        </div>
      </div>

      <div className="stats-card">
        <h3>Dataset Summary</h3>
        <div className="stat">
          <span className="label">Total Entries</span>
          <span className="value">{data.length}</span>
        </div>

        {(() => {
          const npsScores = data.map(d => d.nps_score);
          const avgNps = Math.round(npsScores.reduce((a, b) => a + b, 0) / npsScores.length);
          const promoters = data.filter(d => d.nps_score >= 9).length;
          const passives = data.filter(d => d.nps_score >= 7 && d.nps_score <= 8).length;
          const detractors = data.filter(d => d.nps_score <= 6).length;

          return (
            <>
              <div className="stat">
                <span className="label">Average NPS</span>
                <span className="value">{avgNps}</span>
              </div>
              <div className="stat">
                <span className="label">Promoters</span>
                <span className="value">{promoters}</span>
              </div>
              <div className="stat">
                <span className="label">Passives</span>
                <span className="value">{passives}</span>
              </div>
              <div className="stat">
                <span className="label">Detractors</span>
                <span className="value">{detractors}</span>
              </div>
            </>
          );
        })()}

        {data.some(d => d.age) && (
          <div className="stat">
            <span className="label">Has Age Data</span>
            <span className="value">✓</span>
          </div>
        )}

        {data.some(d => d.location) && (
          <div className="stat">
            <span className="label">Has Location Data</span>
            <span className="value">✓</span>
          </div>
        )}

        {data.some(d => d.device_type) && (
          <div className="stat">
            <span className="label">Has Device Type</span>
            <span className="value">✓</span>
          </div>
        )}

        {data.some(d => d.user_segment) && (
          <div className="stat">
            <span className="label">Has User Segment</span>
            <span className="value">✓</span>
          </div>
        )}

        {data.some(d => d.date) && (
          <div className="stat">
            <span className="label">Has Date Data</span>
            <span className="value">✓</span>
          </div>
        )}
      </div>
    </div>
  );
}
