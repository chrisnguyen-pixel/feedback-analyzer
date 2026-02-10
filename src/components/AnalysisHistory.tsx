import { useState } from 'react';
import { getAllAnalyses, deleteAnalysis } from '../services/storage';
import { AnalysisResult } from '../types/feedback';
import './AnalysisHistory.css';

interface AnalysisHistoryProps {
  onSelectAnalysis: (result: AnalysisResult) => void;
  onBack: () => void;
}

export default function AnalysisHistory({ onSelectAnalysis, onBack }: AnalysisHistoryProps) {
  const [sessions] = useState(() => getAllAnalyses().reverse());

  const handleDelete = (id: string) => {
    if (confirm('Delete this analysis?')) {
      deleteAnalysis(id);
      window.location.reload();
    }
  };

  return (
    <div className="history-container">
      <div className="history-card">
        <div className="history-header">
          <h2>Analysis History</h2>
          <button className="btn-secondary" onClick={onBack}>
            Back
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="empty-state">
            <p>No analyses saved yet</p>
            <button className="btn-primary" onClick={onBack}>
              Create New Analysis
            </button>
          </div>
        ) : (
          <div className="history-list">
            {sessions.map((session) => (
              <div key={session.id} className="history-item">
                <div className="item-info">
                  <h3>{session.name}</h3>
                  <p className="item-meta">
                    {new Date(session.created).toLocaleString()} · {session.feedbackCount} entries
                  </p>
                </div>
                <div className="item-score">
                  <span className="nps-badge">{session.npsScore}</span>
                </div>
                <div className="item-actions">
                  <button
                    className="btn-primary"
                    onClick={() => onSelectAnalysis(session.result)}
                  >
                    View
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(session.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
