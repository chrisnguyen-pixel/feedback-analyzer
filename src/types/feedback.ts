export interface FeedbackEntry {
  feedback_text: string;
  nps_score: number;
  age?: string;
  location?: string;
  device_type?: string;
  user_segment?: string;
  date?: string;
  [key: string]: string | number | undefined;
}

export interface Theme {
  name: string;
  count: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  quotes: string[];
  description: string;
}

export interface NpsBreakdown {
  promoters: number;
  passives: number;
  detractors: number;
  promotersPercent: number;
  passivesPercent: number;
  detractorsPercent: number;
  overallNps: number;
}

export interface SentimentMetrics {
  positive: number;
  neutral: number;
  negative: number;
  positivePercent: number;
  neutralPercent: number;
  negativePercent: number;
}

export interface DemographicData {
  [demographic: string]: {
    [value: string]: {
      count: number;
      avgNps: number;
      sentiment: SentimentMetrics;
    };
  };
}

export interface TrendData {
  date: string;
  nps: number;
  sentiment: SentimentMetrics;
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  feedbackCount: number;
  themes: Theme[];
  nps: NpsBreakdown;
  sentiment: SentimentMetrics;
  demographics: DemographicData;
  trends: TrendData[];
  insights: string[];
  rawData: FeedbackEntry[];
}

export interface AnalysisSession {
  id: string;
  name: string;
  created: number;
  feedbackCount: number;
  npsScore: number;
  result: AnalysisResult;
}
