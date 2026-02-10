# UX Feedback Analyzer

An AI-powered tool that analyzes UX feedback from CSV files or Google Sheets using Claude AI to extract themes, sentiment analysis, NPS metrics, and visualize trends.

## Features

- 📊 **Upload Feedback Data**: Support for CSV files and public Google Sheets
- 🤖 **AI Analysis**: Claude AI powered analysis of feedback themes and sentiment
- 📈 **NPS Metrics**: Calculate and visualize NPS scores and breakdowns
- 💭 **Sentiment Analysis**: Classify feedback as positive, neutral, or negative
- 🎯 **Theme Detection**: Automatically extract key themes from feedback
- 📍 **Demographics**: Analyze feedback by age, location, device type, and user segment
- 📉 **Trends**: Track NPS and sentiment changes over time
- 💾 **Export**: Download analyses as JSON, CSV, or PDF
- 📱 **Responsive**: Works on desktop and mobile devices

## Setup (Non-Engineer Friendly)

### Prerequisites

1. **OpenRouter API Key** (you already have this!)
2. **GitHub Account** (free at github.com)
3. **Vercel Account** (free at vercel.com)

### Step 1: Prepare Your Data

Create a CSV file or Google Sheet with your UX feedback. Required columns:

- `feedback_text` - The user's feedback
- `nps_score` - NPS score (0-10)

Optional columns for demographics:

- `age` - User's age group
- `location` - User's location
- `device_type` - Device used (e.g., iOS, Android, Web)
- `user_segment` - User segment/cohort
- `date` - Date of feedback (for trend analysis)

**Example CSV:**
```
feedback_text,nps_score,age,location,device_type,user_segment
"Great app!",9,25-34,USA,iOS,Enterprise
"Bug on login",3,35-44,UK,Web,SMB
```

**For Google Sheets:**
- Make the sheet public (Share > Anyone with link can view)
- Copy the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`

### Step 2: Deploy to Vercel

1. **Fork/Clone this repository**
   - Go to the project folder
   - Open terminal

2. **Initialize Git** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Create GitHub Repository**
   - Go to github.com
   - Click "New repository"
   - Name it `feedback-analyzer`
   - Push your local code to GitHub

4. **Connect to Vercel**
   - Go to vercel.com
   - Sign in with GitHub
   - Click "Import Project"
   - Select your `feedback-analyzer` repository
   - Click "Import"

5. **Add Environment Variables**
   - In Vercel project settings:
   - Click "Environment Variables"
   - Add:
     - **Key**: `VITE_OPENROUTER_API_KEY`
     - **Value**: Your OpenRouter API key
   - Click "Save"

6. **Deploy**
   - Click "Deploy" button
   - Wait for build to complete
   - You'll get a live URL like `https://your-app.vercel.app`

### Step 3: Use the App

1. Open your Vercel URL in browser
2. Upload CSV file OR paste Google Sheets link
3. Click "Analyze with Claude AI"
4. Wait for analysis to complete
5. View results and export as needed

## Local Development

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

## File Structure

```
src/
├── components/          # React components
│   ├── FileUpload.tsx
│   ├── DataPreview.tsx
│   ├── Dashboard.tsx
│   ├── NpsCard.tsx
│   ├── ThemesPanel.tsx
│   ├── SentimentOverview.tsx
│   ├── DemographicsBreakdown.tsx
│   ├── TrendsChart.tsx
│   ├── InsightsPanel.tsx
│   ├── ExportOptions.tsx
│   ├── AnalysisHistory.tsx
│   └── [component].css
├── services/           # Business logic
│   ├── csvParser.ts   # Parse CSV and Google Sheets
│   ├── claudeAnalyzer.ts  # AI analysis
│   └── storage.ts     # LocalStorage management
├── types/             # TypeScript interfaces
│   └── feedback.ts
├── App.tsx           # Main component
└── main.tsx          # Entry point
```

## How It Works

### Data Processing

1. **Upload**: User uploads CSV or pastes Google Sheets link
2. **Parse**: App parses CSV data and validates required fields
3. **Preview**: Shows first 5 rows for user confirmation
4. **Analyze**: Sends batches of feedback to Claude AI via OpenRouter

### Claude Analysis

- Batches feedback in groups of 40 entries (token-efficient)
- Extracts themes, sentiment, NPS breakdown, and quotes
- Aggregates results into single analysis
- Generates insights and trends

### Storage

- Results stored in browser's `localStorage`
- Can view/compare previous analyses
- Export to JSON or CSV for external use

## Token Usage

Approximate token costs per analysis:

| Feedback Count | Tokens | Cost |
|---|---|---|
| 50 | 1,500-2,000 | $0.01-0.02 |
| 100 | 2,500-3,500 | $0.02-0.03 |
| 500 | 10,000-15,000 | $0.10-0.15 |
| 1,000 | 18,000-25,000 | $0.18-0.25 |

## Troubleshooting

### "API key not configured"
- Make sure you added `VITE_OPENROUTER_API_KEY` to Vercel environment variables
- In local development, check `.env` file exists with your API key

### "Invalid Google Sheets URL"
- Use the full URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`
- Make sure sheet is set to "Anyone with link can view"

### "Missing required fields"
- CSV must have `feedback_text` and `nps_score` columns
- Check column names match exactly (case-sensitive)

### Analysis takes too long
- Larger datasets (1000+ entries) may take 1-2 minutes
- This is normal due to API processing time

## Support

For issues or feature requests:
- Check the troubleshooting section above
- Review the [OpenCode documentation](https://opencode.ai/docs)

## Privacy

- Data stays on your machine (browser storage)
- Only feedback text is sent to Claude AI
- No data is stored on Vercel servers
- Each analysis is independent

## Export & Sharing

### Share Results with Team

**Option 1: Share Vercel URL**
- Generate a new analysis
- Share your app URL with team
- They can view the dashboard in browser

**Option 2: Export & Download**
- Click "Export" button
- Download as JSON or PDF
- Share the file with team

**Option 3: Print to PDF**
- Click "Export" > "Print / Save as PDF"
- Browser print dialog opens
- Save as PDF and share

## Updates & Deployment

After making changes:

```bash
git add .
git commit -m "Update: description of changes"
git push
```

Vercel automatically deploys the latest code.

## License

MIT

## Notes

- All times are stored in browser (localStorage)
- Maximum 10 analyses stored (oldest auto-deleted)
- Clear browser cache to reset data
- Works offline except for analysis (needs internet for API)
