import { useState } from 'react';
import './ColumnSelector.css';

interface ColumnSelectorProps {
  columns: string[];
  sampleData: Record<string, string>[];
  onConfirm: (selectedColumns: string[]) => void;
  onBack: () => void;
}

export default function ColumnSelector({ columns, sampleData, onConfirm, onBack }: ColumnSelectorProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(columns));

  const toggleColumn = (col: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(col)) {
      newSelected.delete(col);
    } else {
      newSelected.add(col);
    }
    setSelected(newSelected);
  };

  const selectAll = () => {
    setSelected(new Set(columns));
  };

  const clearAll = () => {
    setSelected(new Set());
  };

  const handleConfirm = () => {
    if (selected.size === 0) {
      alert('Please select at least one column to analyze');
      return;
    }
    onConfirm(Array.from(selected));
  };

  return (
    <div className="column-selector-container">
      <div className="selector-card">
        <h2>Select Columns to Analyze</h2>
        <p className="selector-info">Choose which columns contain the feedback/text you want analyzed:</p>

        <div className="columns-grid">
          {columns.map((col) => (
            <div key={col} className="column-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selected.has(col)}
                  onChange={() => toggleColumn(col)}
                />
                <span className="checkbox-text">{col}</span>
              </label>
              <div className="sample-data">
                {sampleData.slice(0, 2).map((row, i) => (
                  <div key={i} className="sample-value">
                    {String(row[col] || '').substring(0, 80)}
                    {String(row[col] || '').length > 80 ? '...' : ''}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="selector-footer">
          <div className="footer-buttons">
            <button className="btn-secondary" onClick={selectAll}>
              Select All
            </button>
            <button className="btn-secondary" onClick={clearAll}>
              Clear All
            </button>
          </div>
          <div className="action-buttons">
            <button className="btn-secondary" onClick={onBack}>
              Back
            </button>
            <button className="btn-primary" onClick={handleConfirm}>
              Analyze Selected ({selected.size})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
