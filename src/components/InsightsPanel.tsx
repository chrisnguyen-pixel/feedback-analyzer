import './InsightsPanel.css';

interface InsightsPanelProps {
  insights: string[];
}

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <div className="insights-card card">
      <h2>Key Insights</h2>

      {insights.length === 0 ? (
        <p className="no-insights">No insights generated</p>
      ) : (
        <ul className="insights-list">
          {insights.map((insight, index) => (
            <li key={index} className="insight-item">
              {insight}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
