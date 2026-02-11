import { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import DataPreview from './components/DataPreview';
import ColumnSelector from './components/ColumnSelector';
import AnalysisProgress from './components/AnalysisProgress';
import Dashboard from './components/Dashboard';
import AnalysisHistory from './components/AnalysisHistory';
import ApiKeySettings from './components/ApiKeySettings';
import { FeedbackEntry, AnalysisResult } from './types/feedback';
import { analyzeFeedback } from './services/claudeAnalyzer';
import { saveAnalysis } from './services/storage';
import './App.css';

type AppState = 'upload' | 'preview' | 'select-columns' | 'analyzing' | 'dashboard' | 'history';

function App() {
  const [state, setState] = useState<AppState>('upload');
  const [feedbackData, setFeedbackData] = useState<FeedbackEntry[]>([]);
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleFileLoaded = (data: FeedbackEntry[], columns: string[]) => {
    setFeedbackData(data);
    setCsvColumns(columns);
    setError(null);
    setState('preview');
  };

  const handleSelectColumns = (columns: string[]) => {
    setSelectedColumns(columns);
    setState('analyzing');
    handleAnalyzeWithColumns(columns);
  };

  const handleAnalyzeWithColumns = async (columns: string[]) => {
    setLoading(true);
    setError(null);

    try {
      // Filter feedback data to only selected columns
      const filteredData = feedbackData.map(entry => ({
        ...entry,
        feedback_text: columns
          .map(col => entry[col])
          .filter(val => val)
          .join(' | '),
      }));

      const result = await analyzeFeedback(filteredData);
      setAnalysisResult(result);
      saveAnalysis(result);
      setState('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setState('select-columns');
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setFeedbackData([]);
    setSelectedColumns([]);
    setAnalysisResult(null);
    setError(null);
    setState('upload');
  };

  const handleViewHistory = () => {
    setState('history');
  };

  const handleHistorySelect = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setState('dashboard');
  };

  return (
    <div className="app">
      <Header 
        currentState={state}
        onNewAnalysis={handleNewAnalysis}
        onViewHistory={handleViewHistory}
        onOpenSettings={() => setShowSettings(true)}
      />
      
      <main className="main-content">
        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {state === 'upload' && (
          <FileUpload onFileLoaded={handleFileLoaded} />
        )}

        {state === 'preview' && (
          <ColumnSelector
            columns={csvColumns}
            sampleData={feedbackData.slice(0, 3)}
            onConfirm={handleSelectColumns}
            onBack={handleNewAnalysis}
          />
        )}

        {state === 'select-columns' && (
          <ColumnSelector
            columns={csvColumns}
            sampleData={feedbackData.slice(0, 3)}
            onConfirm={handleSelectColumns}
            onBack={handleNewAnalysis}
          />
        )}

        {state === 'analyzing' && (
          <AnalysisProgress loading={loading} feedbackCount={feedbackData.length} />
        )}

        {state === 'dashboard' && analysisResult && (
          <Dashboard result={analysisResult} onNewAnalysis={handleNewAnalysis} />
        )}

        {state === 'history' && (
          <AnalysisHistory
            onSelectAnalysis={handleHistorySelect}
            onBack={handleNewAnalysis}
          />
        )}
      </main>

      {showSettings && (
        <ApiKeySettings onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

export default App;
