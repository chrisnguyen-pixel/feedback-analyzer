import { DemographicData } from '../types/feedback';
import './DemographicsBreakdown.css';

interface DemographicsBreakdownProps {
  demographics: DemographicData;
}

export default function DemographicsBreakdown({ demographics }: DemographicsBreakdownProps) {
  return (
    <div className="demographics-card card">
      <h2>Demographics Breakdown</h2>

      <div className="demographics-grid">
        {Object.entries(demographics).map(([demographic, values]) => (
          <div key={demographic} className="demographic-section">
            <h3>{demographic.replace(/_/g, ' ').toUpperCase()}</h3>
            <div className="demographic-table">
              <div className="table-header">
                <span className="col-value">Value</span>
                <span className="col-count">Count</span>
              </div>
              {Object.entries(values).map(([value, data]) => (
                <div key={value} className="table-row">
                  <span className="col-value">{value}</span>
                  <span className="col-count">{data.count}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
