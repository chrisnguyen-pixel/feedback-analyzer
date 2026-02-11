import { AnalysisResult } from '../types/feedback';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import './NpsCard.css';

interface NpsCardProps {
  result: AnalysisResult;
}

export default function NpsCard({ result }: NpsCardProps) {
  // Don't show NPS card if there's no NPS data (survey analysis)
  if (!result.nps || (result.nps.promoters === 0 && result.nps.passives === 0 && result.nps.detractors === 0)) {
    return null;
  }

  const data = [
    { name: 'Promoters (9-10)', value: result.nps.promoters },
    { name: 'Passives (7-8)', value: result.nps.passives },
    { name: 'Detractors (0-6)', value: result.nps.detractors },
  ];

  const COLORS = ['#4caf50', '#ffc107', '#f44336'];

  return (
    <div className="nps-card card">
      <h2>NPS Score</h2>
      
      <div className="nps-display">
        <div className="nps-score">{result.nps.overallNps}</div>
        <div className="nps-breakdown">
          <div className="breakdown-item">
            <span className="label">Promoters</span>
            <span className="percentage">{result.nps.promotersPercent}%</span>
          </div>
          <div className="breakdown-item">
            <span className="label">Passives</span>
            <span className="percentage">{result.nps.passivesPercent}%</span>
          </div>
          <div className="breakdown-item">
            <span className="label">Detractors</span>
            <span className="percentage">{result.nps.detractorsPercent}%</span>
          </div>
        </div>
      </div>

      <div className="nps-chart">
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
