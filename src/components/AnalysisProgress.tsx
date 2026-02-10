import './AnalysisProgress.css';

interface AnalysisProgressProps {
  loading: boolean;
  feedbackCount: number;
}

export default function AnalysisProgress({ loading, feedbackCount }: AnalysisProgressProps) {
  const messages = [
    'Analyzing feedback themes...',
    'Extracting sentiment...',
    'Calculating NPS metrics...',
    'Identifying key quotes...',
    'Generating insights...',
    'Preparing visualizations...',
  ];

  const messageIndex = Math.floor(Date.now() / 3000) % messages.length;

  return (
    <div className="analysis-progress-container">
      <div className="progress-card">
        <div className="spinner"></div>
        <h2>Analyzing Feedback</h2>
        <p className="message">{messages[messageIndex]}</p>
        <p className="count">Processing {feedbackCount} feedback entries with Claude AI...</p>

        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  );
}
