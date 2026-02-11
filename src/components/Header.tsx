import './Header.css';

interface HeaderProps {
  currentState: string;
  onNewAnalysis: () => void;
  onViewHistory: () => void;
  onOpenSettings: () => void;
}

export default function Header({ currentState, onNewAnalysis, onViewHistory, onOpenSettings }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-title">
          <h1>UX Feedback Analyzer</h1>
          <p>Powered by Claude AI</p>
        </div>
        <nav className="header-nav">
          <button className="btn-secondary" onClick={onOpenSettings} title="API Key Settings">
            ⚙️
          </button>
          {currentState !== 'upload' && (
            <button className="btn-secondary" onClick={onNewAnalysis}>
              New Analysis
            </button>
          )}
          {currentState !== 'history' && currentState !== 'upload' && (
            <button className="btn-secondary" onClick={onViewHistory}>
              History
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
