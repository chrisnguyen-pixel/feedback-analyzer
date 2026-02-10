import { AnalysisResult } from '../types/feedback';
import NpsCard from './NpsCard';
import ThemesPanel from './ThemesPanel';
import SentimentOverview from './SentimentOverview';
import DemographicsBreakdown from './DemographicsBreakdown';
import TrendsChart from './TrendsChart';
import InsightsPanel from './InsightsPanel';
import ExportOptions from './ExportOptions';
import './Dashboard.css';

interface DashboardProps {
  result: AnalysisResult;
  onNewAnalysis: () => void;
}

export default function Dashboard({ result, onNewAnalysis }: DashboardProps) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-info">
          <h2>Analysis Results</h2>
          <p className="timestamp">
            {new Date(result.timestamp).toLocaleString()} · {result.feedbackCount} entries analyzed
          </p>
        </div>
        <ExportOptions result={result} />
      </div>

      {/* Main Metrics Row */}
      <div className="grid-2">
        <NpsCard result={result} />
        <SentimentOverview result={result} />
      </div>

      {/* Themes */}
      <ThemesPanel result={result} />

      {/* Demographics */}
      {Object.keys(result.demographics).length > 0 && (
        <DemographicsBreakdown demographics={result.demographics} />
      )}

      {/* Trends */}
      {result.trends.length > 0 && (
        <TrendsChart trends={result.trends} />
      )}

      {/* Insights */}
      <InsightsPanel insights={result.insights} />

      {/* New Analysis Button */}
      <div className="dashboard-footer">
        <button className="btn-primary" onClick={onNewAnalysis}>
          Analyze New Feedback
        </button>
      </div>
    </div>
  );
}
