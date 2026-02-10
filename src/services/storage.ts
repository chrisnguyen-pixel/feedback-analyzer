import { AnalysisSession, AnalysisResult } from '../types/feedback';

const STORAGE_KEY = 'ux_feedback_analyses';
const STORAGE_VERSION = 1;

export function saveAnalysis(result: AnalysisResult, name?: string): string {
  const session: AnalysisSession = {
    id: result.id,
    name: name || `Analysis - ${new Date(result.timestamp).toLocaleDateString()}`,
    created: result.timestamp,
    feedbackCount: result.feedbackCount,
    npsScore: result.nps.overallNps,
    result,
  };

  const analyses = getAllAnalyses();
  analyses.push(session);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
  return result.id;
}

export function getAllAnalyses(): AnalysisSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as AnalysisSession[];
  } catch (error) {
    console.error('Error reading analyses from storage:', error);
    return [];
  }
}

export function getAnalysis(id: string): AnalysisSession | null {
  const analyses = getAllAnalyses();
  return analyses.find(a => a.id === id) || null;
}

export function deleteAnalysis(id: string): void {
  const analyses = getAllAnalyses();
  const filtered = analyses.filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function updateAnalysisName(id: string, newName: string): void {
  const analyses = getAllAnalyses();
  const analysis = analyses.find(a => a.id === id);
  if (analysis) {
    analysis.name = newName;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
  }
}

export function exportAsJSON(result: AnalysisResult): string {
  return JSON.stringify(result, null, 2);
}

export function downloadJSON(result: AnalysisResult, filename?: string): void {
  const json = exportAsJSON(result);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `analysis_${result.id}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadCSV(result: AnalysisResult, filename?: string): void {
  const headers = ['Feedback Text', 'NPS Score', 'Age', 'Location', 'Device Type', 'User Segment', 'Date'];
  const rows = result.rawData.map(entry => [
    `"${entry.feedback_text.replace(/"/g, '""')}"`,
    entry.nps_score,
    entry.age || '',
    entry.location || '',
    entry.device_type || '',
    entry.user_segment || '',
    entry.date || '',
  ]);

  const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `feedback_${result.id}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
