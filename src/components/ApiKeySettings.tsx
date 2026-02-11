import { useState, useEffect } from 'react';
import './ApiKeySettings.css';

interface ApiKeySettingsProps {
  onClose: () => void;
}

export default function ApiKeySettings({ onClose }: ApiKeySettingsProps) {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load saved API key
    const saved = localStorage.getItem('openrouter_api_key');
    if (saved) {
      setApiKey('••••••••' + saved.slice(-8)); // Show last 8 chars for security
    }
  }, []);

  const handleSave = () => {
    if (apiKey && !apiKey.startsWith('•')) {
      localStorage.setItem('openrouter_api_key', apiKey);
      setApiKey('••••••••' + apiKey.slice(-8));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('openrouter_api_key');
    setApiKey('');
  };

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>API Key Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="settings-content">
          <p className="info-text">
            Enter your OpenRouter API key. It will be stored locally in your browser and never sent to any server.
          </p>

          <div className="form-group">
            <label htmlFor="apiKey">OpenRouter API Key</label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-or-v1-..."
              className="api-key-input"
            />
            <small className="help-text">
              Get your key from: <a href="https://openrouter.ai/" target="_blank" rel="noreferrer">openrouter.ai</a>
            </small>
          </div>

          {isSaved && (
            <div className="success-message">✓ API key saved successfully!</div>
          )}

          <div className="button-group">
            <button className="btn-primary" onClick={handleSave}>
              Save API Key
            </button>
            <button className="btn-secondary" onClick={handleClear}>
              Clear
            </button>
            <button className="btn-secondary" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
