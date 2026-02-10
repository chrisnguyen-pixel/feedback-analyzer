import { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import DataPreview from './components/DataPreview';
import AnalysisProgress from './components/AnalysisProgress';
import Dashboard from './components/Dashboard';
import AnalysisHistory from './components/AnalysisHistory';
import { FeedbackEntry, AnalysisResult } from './types/feedback';
import { analyzeFeedback } from './services/claudeAnalyzer';
import { saveAnalysis } from './services/storage';
import './App.css';

type AppState = 'upload' | 'preview' | 'analyzing' | 'dashboard' | 'history';

function App() {
  const [state, setState] = useState<AppState>('upload');
  const [feedbackData, setFeedbackData] = useState<FeedbackEntry[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileLoaded = (data: FeedbackEntry[]) => {
    setFeedbackData(data);
    setError(null);
    setState('preview');
  };

  const handleAnalyze = async () => {
    if (feedbackData.length === 0) {
      setError('No feedback data to analyze');
      return;
    }

    setState('analyzing');
    setLoading(true);
    setError(null);

    try {
      const result = await analyzeFeedback(feedbackData);
      setAnalysisResult(result);
      saveAnalysis(result);
      setState('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setState('preview');
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setFeedbackData([]);
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
          <DataPreview
            data={feedbackData}
            onAnalyze={handleAnalyze}
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
    </div>
  );
}

export default App;
