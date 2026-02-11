import { useState, useRef } from 'react';
import { parseCSV, fetchGoogleSheetAsCSV } from '../services/csvParser';
import { FeedbackEntry } from '../types/feedback';
import './FileUpload.css';

interface FileUploadProps {
  onFileLoaded: (data: FeedbackEntry[], csvColumns: string[]) => void;
}

export default function FileUpload({ onFileLoaded }: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheetUrl, setSheetUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCSVUpload = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const content = await file.text();
      const result = parseCSV(content);

      if (!result.success) {
        setError(result.error || 'Failed to parse CSV');
        return;
      }

      onFileLoaded(result.data, result.csvColumns);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read file');
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCSVUpload(file);
    }
  };

  const handleGoogleSheetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheetUrl.trim()) {
      setError('Please enter a Google Sheets URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const csvContent = await fetchGoogleSheetAsCSV(sheetUrl);
      const result = parseCSV(csvContent);

      if (!result.success) {
        setError(result.error || 'Failed to parse Google Sheet');
        return;
      }

      onFileLoaded(result.data, result.csvColumns);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Google Sheet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <div className="upload-card">
        <h2>Upload Feedback Data</h2>
        <p className="subtitle">Analyze UX feedback to extract themes, sentiment, and insights</p>

        <div className="upload-methods">
          {/* CSV Upload */}
          <div className="method csv-method">
            <h3>📄 CSV File</h3>
            <p>Upload a CSV file with your feedback data</p>
            <div
              className="drop-zone"
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('drag-over');
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove('drag-over');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('drag-over');
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  handleCSVUpload(file);
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInputChange}
                disabled={loading}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="btn-primary upload-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Choose CSV File'}
              </button>
              <p className="drop-text">or drag and drop here</p>
            </div>
            <p className="requirements">
              Supports any CSV format. The app will automatically detect feedback text and scores.
              <br />
              Optional columns: <code>age</code>, <code>location</code>, <code>device_type</code>,
              <code>user_segment</code>, <code>date</code>
            </p>
          </div>

          {/* Google Sheets */}
          <div className="method sheets-method">
            <h3>📊 Google Sheets</h3>
            <p>Paste a public Google Sheets link</p>
            <form onSubmit={handleGoogleSheetSubmit}>
              <input
                type="text"
                placeholder="https://docs.google.com/spreadsheets/d/ABC123/..."
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                disabled={loading}
                className="sheet-input"
              />
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !sheetUrl.trim()}
              >
                {loading ? 'Loading...' : 'Load Sheet'}
              </button>
            </form>
            <p className="note">
              💡 Make sure the sheet is set to "Anyone with the link can view"
            </p>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
      </div>

      <div className="info-card">
        <h3>What to expect:</h3>
        <ul>
          <li>Extract UX themes from feedback</li>
          <li>Analyze sentiment (positive, neutral, negative)</li>
          <li>Calculate NPS metrics and breakdowns</li>
          <li>Identify key quotes and trends</li>
          <li>View data by demographics</li>
          <li>Export results as JSON or PDF</li>
        </ul>
      </div>
    </div>
  );
}
