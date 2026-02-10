import { AnalysisResult } from '../types/feedback';
import { downloadJSON, downloadCSV } from '../services/storage';
import './ExportOptions.css';

interface ExportOptionsProps {
  result: AnalysisResult;
}

export default function ExportOptions({ result }: ExportOptionsProps) {
  const handleExportJSON = () => {
    downloadJSON(result);
  };

  const handleExportCSV = () => {
    downloadCSV(result);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="export-options">
      <div className="export-dropdown">
        <button className="btn-secondary export-btn">
          ⬇ Export
        </button>
        <div className="export-menu">
          <button onClick={handleExportJSON} className="export-item">
            📄 Export as JSON
          </button>
          <button onClick={handleExportCSV} className="export-item">
            📊 Export as CSV
          </button>
          <button onClick={handlePrint} className="export-item">
            🖨️ Print / Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
