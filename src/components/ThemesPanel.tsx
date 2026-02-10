import { AnalysisResult } from '../types/feedback';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './ThemesPanel.css';

interface ThemesPanelProps {
  result: AnalysisResult;
}

export default function ThemesPanel({ result }: ThemesPanelProps) {
  const chartData = result.themes.map(t => ({
    name: t.name,
    count: t.count,
  }));

  const COLORS = ['#0066cc', '#00b4d8', '#00d4ff', '#48cae4', '#90e0ef'];

  return (
    <div className="themes-card card">
      <h2>Feedback Themes</h2>

      <div className="themes-chart">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#0066cc" radius={[8, 8, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="themes-list">
        {result.themes.map((theme, index) => (
          <div key={index} className="theme-item">
            <div className="theme-header">
              <h3>{theme.name}</h3>
              <span className="count">{theme.count} mentions</span>
            </div>

            <div className="sentiment-breakdown">
              <div className="sentiment-bar">
                {theme.sentiment.positive > 0 && (
                  <div
                    className="bar-segment positive"
                    style={{
                      width: `${(theme.sentiment.positive / theme.count) * 100}%`,
                    }}
                    title={`${theme.sentiment.positive} positive`}
                  />
                )}
                {theme.sentiment.neutral > 0 && (
                  <div
                    className="bar-segment neutral"
                    style={{
                      width: `${(theme.sentiment.neutral / theme.count) * 100}%`,
                    }}
                    title={`${theme.sentiment.neutral} neutral`}
                  />
                )}
                {theme.sentiment.negative > 0 && (
                  <div
                    className="bar-segment negative"
                    style={{
                      width: `${(theme.sentiment.negative / theme.count) * 100}%`,
                    }}
                    title={`${theme.sentiment.negative} negative`}
                  />
                )}
              </div>
              <span className="sentiment-text">
                {theme.sentiment.positive} positive • {theme.sentiment.neutral} neutral •{' '}
                {theme.sentiment.negative} negative
              </span>
            </div>

            <p className="description">{theme.description}</p>

            <div className="quotes">
              <span className="quotes-label">Key quotes:</span>
              <ul>
                {theme.quotes.map((quote, i) => (
                  <li key={i}>"{quote}"</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
