import { AnalysisResult } from '../types/feedback';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import './SentimentOverview.css';

interface SentimentOverviewProps {
  result: AnalysisResult;
}

export default function SentimentOverview({ result }: SentimentOverviewProps) {
  const data = [
    { name: 'Positive', value: result.sentiment.positive },
    { name: 'Neutral', value: result.sentiment.neutral },
    { name: 'Negative', value: result.sentiment.negative },
  ];

  const COLORS = ['#4caf50', '#90a4ae', '#f44336'];

  return (
    <div className="sentiment-card card">
      <h2>Sentiment Overview</h2>

      <div className="sentiment-display">
        <div className="sentiment-metrics">
          <div className="metric positive">
            <span className="label">Positive</span>
            <span className="value">{result.sentiment.positivePercent}%</span>
          </div>
          <div className="metric neutral">
            <span className="label">Neutral</span>
            <span className="value">{result.sentiment.neutralPercent}%</span>
          </div>
          <div className="metric negative">
            <span className="label">Negative</span>
            <span className="value">{result.sentiment.negativePercent}%</span>
          </div>
        </div>
      </div>

      <div className="sentiment-chart">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
