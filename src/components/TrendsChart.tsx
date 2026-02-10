import { TrendData } from '../types/feedback';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './TrendsChart.css';

interface TrendsChartProps {
  trends: TrendData[];
}

export default function TrendsChart({ trends }: TrendsChartProps) {
  return (
    <div className="trends-card card">
      <h2>Trends Over Time</h2>

      <div className="trends-chart">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="nps"
              stroke="#0066cc"
              strokeWidth={2}
              dot={{ fill: '#0066cc', r: 4 }}
              activeDot={{ r: 6 }}
              name="NPS Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="trends-stats">
        {trends.length > 0 && (
          <>
            <div className="stat">
              <span className="label">Latest NPS</span>
              <span className="value">{trends[trends.length - 1].nps}</span>
            </div>
            {trends.length > 1 && (
              <div className="stat">
                <span className="label">Change</span>
                <span className={`value ${trends[trends.length - 1].nps >= trends[0].nps ? 'positive' : 'negative'}`}>
                  {trends[trends.length - 1].nps >= trends[0].nps ? '+' : ''}
                  {trends[trends.length - 1].nps - trends[0].nps}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
