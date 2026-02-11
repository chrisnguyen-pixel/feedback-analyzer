import Papa from 'papaparse';
import { FeedbackEntry } from '../types/feedback';

export interface ParseResult {
  success: boolean;
  data: FeedbackEntry[];
  error?: string;
  requiredFields: string[];
  foundFields: string[];
}

const RECOGNIZED_FIELDS = ['feedback_text', 'nps_score', 'age', 'location', 'device_type', 'user_segment', 'date'];

export function parseCSV(csvContent: string): ParseResult {
  try {
    const result = Papa.parse(csvContent, {
      header: true,
      dynamicTyping: false, // Keep as strings to handle any format
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, '_'),
    });

    if (result.errors.length > 0) {
      return {
        success: false,
        data: [],
        error: `CSV parsing error: ${result.errors[0].message}`,
        requiredFields: [],
        foundFields: [],
      };
    }

    const data = result.data as Array<Record<string, unknown>>;
    if (data.length === 0) {
      return {
        success: false,
        data: [],
        error: 'No data found in CSV',
        requiredFields: [],
        foundFields: [],
      };
    }

    // Get all headers
    const firstRow = data[0];
    const headers = Object.keys(firstRow);
    const foundFields = headers.filter(h => RECOGNIZED_FIELDS.includes(h));

    // Transform data - accept any format, use all columns
    const validatedData: FeedbackEntry[] = [];
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      // Start with basic entry - accept any data
      const entry: FeedbackEntry = {
        feedback_text: '',
        nps_score: 0,
      };

      // Try to find feedback text in any column
      const feedbackCol = headers.find(h => 
        h.includes('feedback') || h.includes('comment') || h.includes('text') || h === 'message'
      );
      if (feedbackCol && row[feedbackCol]) {
        entry.feedback_text = String(row[feedbackCol]).trim();
      }

      // Try to find NPS score in any numeric column
      const npsCol = headers.find(h => 
        h.includes('nps') || h.includes('score') || h.includes('rating')
      );
      if (npsCol && row[npsCol]) {
        const score = Number(row[npsCol]);
        if (!isNaN(score) && score >= 0 && score <= 10) {
          entry.nps_score = score;
        }
      }

      // Skip if no feedback text or invalid NPS
      if (!entry.feedback_text && !entry.nps_score) {
        continue;
      }

      // Add recognized optional fields if present
      if (row.age !== undefined && row.age !== null && row.age !== '') {
        entry.age = String(row.age).trim();
      }
      if (row.location !== undefined && row.location !== null && row.location !== '') {
        entry.location = String(row.location).trim();
      }
      if (row.device_type !== undefined && row.device_type !== null && row.device_type !== '') {
        entry.device_type = String(row.device_type).trim();
      }
      if (row.user_segment !== undefined && row.user_segment !== null && row.user_segment !== '') {
        entry.user_segment = String(row.user_segment).trim();
      }
      if (row.date !== undefined && row.date !== null && row.date !== '') {
        entry.date = String(row.date).trim();
      }

      validatedData.push(entry);
    }

    if (validatedData.length === 0) {
      return {
        success: false,
        data: [],
        error: 'No valid data found. Make sure your CSV has at least some feedback entries.',
        requiredFields: [],
        foundFields: headers,
      };
    }

    return {
      success: true,
      data: validatedData,
      requiredFields: [],
      foundFields: headers,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: `Error parsing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`,
      requiredFields: REQUIRED_FIELDS,
      foundFields: [],
    };
  }
}

export async function fetchGoogleSheetAsCSV(sheetUrl: string): Promise<string> {
  try {
    // Extract spreadsheet ID from URL
    const urlPattern = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
    const match = sheetUrl.match(urlPattern);
    
    if (!match) {
      throw new Error('Invalid Google Sheets URL');
    }

    const spreadsheetId = match[1];
    const gid = new URL(sheetUrl).hash.split('=')[1] || '0';

    // Convert to CSV export URL
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;

    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch Google Sheet: ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    throw new Error(`Error fetching Google Sheet: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
