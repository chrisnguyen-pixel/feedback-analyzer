import { FeedbackEntry, AnalysisResult, Theme, NpsBreakdown, SentimentMetrics, DemographicData, TrendData } from '../types/feedback';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/messages';
const BATCH_SIZE = 40; // Process 40 entries per API call

interface ClaudeResponse {
  themes: Array<{
    name: string;
    count: number;
    sentiment: { positive: number; neutral: number; negative: number };
    quotes: string[];
    description: string;
  }>;
  nps: {
    promoters: number;
    passives: number;
    detractors: number;
  };
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  insights: string[];
  feedbackSentiments: Array<{ sentiment: 'positive' | 'neutral' | 'negative' }>;
}

export async function analyzeFeedback(feedbackData: FeedbackEntry[]): Promise<AnalysisResult> {
  if (!API_KEY) {
    throw new Error('OpenRouter API key not configured. Set VITE_OPENROUTER_API_KEY in .env');
  }

  if (feedbackData.length === 0) {
    throw new Error('No feedback data to analyze');
  }

  // Process in batches
  const batches = [];
  for (let i = 0; i < feedbackData.length; i += BATCH_SIZE) {
    batches.push(feedbackData.slice(i, i + BATCH_SIZE));
  }

  console.log(`Analyzing ${feedbackData.length} feedback entries in ${batches.length} batch(es)...`);

  const allResults: ClaudeResponse[] = [];
  const feedbackSentiments: Array<{ sentiment: 'positive' | 'neutral' | 'negative' }> = [];

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    console.log(`Processing batch ${batchIndex + 1}/${batches.length}...`);

    const result = await callClaude(batch, batchIndex, batches.length);
    allResults.push(result);
    feedbackSentiments.push(...result.feedbackSentiments);
  }

  // Aggregate results
  const aggregatedResult = aggregateResults(allResults, feedbackData);
  aggregatedResult.rawData = feedbackData;

  return aggregatedResult;
}

async function callClaude(batch: FeedbackEntry[], batchIndex: number, totalBatches: number): Promise<ClaudeResponse> {
  const feedbackText = batch
    .map((entry, i) => `[${i + 1}] NPS: ${entry.nps_score} | "${entry.feedback_text}"`)
    .join('\n');

  const prompt = `You are a UX analyst. Analyze this batch of user feedback (batch ${batchIndex + 1}/${totalBatches}).

FEEDBACK DATA:
${feedbackText}

Extract the following in valid JSON format:

1. For EACH feedback entry, determine sentiment: "positive", "neutral", or "negative"
2. Identify themes (Usability Issues, Feature Requests, Onboarding/Learning Curve, Visual/Design, Bugs/Technical, Other)
3. Count each theme and calculate sentiment breakdown per theme
4. Extract NPS breakdown (count of promoters 9-10, passives 7-8, detractors 0-6)
5. Calculate overall sentiment distribution
6. Identify 2-3 best representative quotes per theme
7. Provide 2-3 key insights

Return ONLY valid JSON (no markdown, no code blocks) with this structure:
{
  "themes": [
    {
      "name": "Theme Name",
      "count": number,
      "sentiment": { "positive": number, "neutral": number, "negative": number },
      "quotes": ["quote1", "quote2"],
      "description": "Brief description"
    }
  ],
  "nps": { "promoters": number, "passives": number, "detractors": number },
  "sentiment": { "positive": number, "neutral": number, "negative": number },
  "insights": ["insight1", "insight2"],
  "feedbackSentiments": [
    { "sentiment": "positive" | "neutral" | "negative" }
  ]
}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 1,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const content = data.content[0]?.text;

    if (!content) {
      throw new Error('No response from Claude');
    }

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from Claude response');
    }

    const parsed = JSON.parse(jsonMatch[0]) as ClaudeResponse;
    return parsed;
  } catch (error) {
    throw new Error(`Claude API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function aggregateResults(results: ClaudeResponse[], feedbackData: FeedbackEntry[]): AnalysisResult {
  const themes = new Map<string, Theme>();
  let totalPromoters = 0;
  let totalPassives = 0;
  let totalDetractors = 0;
  let totalPositive = 0;
  let totalNeutral = 0;
  let totalNegative = 0;
  const allInsights: string[] = [];

  // Aggregate themes and sentiment
  for (const result of results) {
    // Aggregate themes
    for (const theme of result.themes) {
      if (themes.has(theme.name)) {
        const existing = themes.get(theme.name)!;
        existing.count += theme.count;
        existing.sentiment.positive += theme.sentiment.positive;
        existing.sentiment.neutral += theme.sentiment.neutral;
        existing.sentiment.negative += theme.sentiment.negative;
        // Combine quotes
        const allQuotes = new Set([...existing.quotes, ...theme.quotes]);
        existing.quotes = Array.from(allQuotes).slice(0, 3);
      } else {
        themes.set(theme.name, { ...theme });
      }
    }

    // Aggregate NPS
    totalPromoters += result.nps.promoters;
    totalPassives += result.nps.passives;
    totalDetractors += result.nps.detractors;

    // Aggregate sentiment
    totalPositive += result.sentiment.positive;
    totalNeutral += result.sentiment.neutral;
    totalNegative += result.sentiment.negative;

    // Collect insights
    allInsights.push(...result.insights);
  }

  // Calculate NPS score
  const totalNps = totalPromoters + totalPassives + totalDetractors;
  const npsScore = totalNps > 0 ? Math.round(((totalPromoters - totalDetractors) / totalNps) * 100) : 0;

  // Build demographics breakdown
  const demographics = buildDemographicsBreakdown(feedbackData);

  // Build trends
  const trends = buildTrends(feedbackData);

  const analysis: AnalysisResult = {
    id: `analysis_${Date.now()}`,
    timestamp: Date.now(),
    feedbackCount: feedbackData.length,
    themes: Array.from(themes.values()).sort((a, b) => b.count - a.count),
    nps: {
      promoters: totalPromoters,
      passives: totalPassives,
      detractors: totalDetractors,
      promotersPercent: totalNps > 0 ? Math.round((totalPromoters / totalNps) * 100) : 0,
      passivesPercent: totalNps > 0 ? Math.round((totalPassives / totalNps) * 100) : 0,
      detractorsPercent: totalNps > 0 ? Math.round((totalDetractors / totalNps) * 100) : 0,
      overallNps: npsScore,
    },
    sentiment: {
      positive: totalPositive,
      neutral: totalNeutral,
      negative: totalNegative,
      positivePercent: totalNps > 0 ? Math.round((totalPositive / totalNps) * 100) : 0,
      neutralPercent: totalNps > 0 ? Math.round((totalNeutral / totalNps) * 100) : 0,
      negativePercent: totalNps > 0 ? Math.round((totalNegative / totalNps) * 100) : 0,
    },
    demographics,
    trends,
    insights: [...new Set(allInsights)].slice(0, 5), // Deduplicate and limit
    rawData: [],
  };

  return analysis;
}

function buildDemographicsBreakdown(feedbackData: FeedbackEntry[]): DemographicData {
  const demographics: DemographicData = {};
  const demographicFields = ['age', 'location', 'device_type', 'user_segment'];

  for (const field of demographicFields) {
    if (!feedbackData.some(f => f[field as keyof FeedbackEntry])) {
      continue; // Skip if field not present in data
    }

    demographics[field] = {};

    for (const entry of feedbackData) {
      const value = entry[field as keyof FeedbackEntry];
      if (value) {
        const valueStr = String(value);
        if (!demographics[field][valueStr]) {
          demographics[field][valueStr] = {
            count: 0,
            avgNps: 0,
            sentiment: { positive: 0, neutral: 0, negative: 0, positivePercent: 0, neutralPercent: 0, negativePercent: 0 },
          };
        }

        demographics[field][valueStr].count += 1;
        // NPS average will be calculated later
      }
    }
  }

  return demographics;
}

function buildTrends(feedbackData: FeedbackEntry[]): TrendData[] {
  const trends: TrendData[] = [];

  // Check if date field exists
  if (!feedbackData.some(f => f.date)) {
    return trends;
  }

  // Group by date
  const dateGroups = new Map<string, FeedbackEntry[]>();
  for (const entry of feedbackData) {
    if (entry.date) {
      const date = String(entry.date);
      if (!dateGroups.has(date)) {
        dateGroups.set(date, []);
      }
      dateGroups.get(date)!.push(entry);
    }
  }

  // Calculate metrics per date
  for (const [date, entries] of dateGroups.entries()) {
    const avgNps = Math.round(entries.reduce((sum, e) => sum + e.nps_score, 0) / entries.length);
    const positiveCount = entries.filter(e => e.nps_score >= 7).length;
    const neutralCount = entries.filter(e => e.nps_score === 6).length;
    const negativeCount = entries.filter(e => e.nps_score <= 5).length;
    const total = entries.length;

    trends.push({
      date,
      nps: avgNps,
      sentiment: {
        positive: positiveCount,
        neutral: neutralCount,
        negative: negativeCount,
        positivePercent: Math.round((positiveCount / total) * 100),
        neutralPercent: Math.round((neutralCount / total) * 100),
        negativePercent: Math.round((negativeCount / total) * 100),
      },
    });
  }

  // Sort by date
  trends.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return trends;
}
