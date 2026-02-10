# Quick Start Guide

Get your UX Feedback Analyzer running in 5 minutes!

## 1. Create Your Data File

Create a CSV file named `feedback.csv`:

```csv
feedback_text,nps_score,age,location,device_type,user_segment
"Love the new design!",10,25-34,USA,iOS,Enterprise
"Dashboard is confusing",4,35-44,UK,Web,SMB
"Fast and reliable",9,18-24,Canada,Android,Startup
"Fix the mobile bug",2,45-54,USA,iOS,Enterprise
"Could use better onboarding",6,55-64,Australia,Web,SMB
```

Or create a **Google Sheet** with the same columns and make it public.

## 2. Deploy to Vercel (Choose One)

### Option A: GitHub + Vercel (Recommended for Non-Engineers)

1. **Create GitHub Account** (if needed)
   - Go to github.com
   - Sign up

2. **Create Repository**
   - Click "+" > "New repository"
   - Name: `feedback-analyzer`
   - Add this code to it

3. **Connect to Vercel**
   - Go to vercel.com
   - Sign in with GitHub
   - Click "Import Project"
   - Select your repository
   - Click "Import"

4. **Add API Key**
   - Go to Vercel project settings
   - Click "Environment Variables"
   - Add: `VITE_OPENROUTER_API_KEY` = your OpenRouter key
   - Click "Deploy"

5. **Get Your URL**
   - Wait for build (2-3 minutes)
   - Click "Visit" to see your live app!

### Option B: Local Development

```bash
# Install dependencies
npm install

# Create .env file with your API key
echo "VITE_OPENROUTER_API_KEY=your_key_here" > .env

# Start dev server
npm run dev

# Open http://localhost:5173
```

## 3. Use Your App

1. **Upload Feedback**
   - Click "Choose CSV File" or paste Google Sheets link
   - Click "Load Sheet"

2. **Review Data**
   - Check the preview
   - Click "Analyze with Claude AI"

3. **View Results**
   - See NPS score, themes, sentiment
   - Export as JSON or PDF

## Example Workflow

```
1. Prepare feedback data (CSV or Google Sheet)
   ↓
2. Open your app URL
   ↓
3. Upload/paste data
   ↓
4. Click "Analyze"
   ↓
5. Get instant insights (2-3 minutes for 100 entries)
   ↓
6. Export results for team
```

## What You'll Get

✅ NPS Score with Promoter/Passive/Detractor breakdown  
✅ Themes detected from feedback  
✅ Sentiment analysis (positive/neutral/negative)  
✅ Key quotes per theme  
✅ Demographics breakdown  
✅ Trends over time (if you have dates)  
✅ Exportable reports (JSON/PDF)  

## CSV Column Reference

| Column | Required | Example | Notes |
|--------|----------|---------|-------|
| feedback_text | ✅ | "Great app!" | User's feedback |
| nps_score | ✅ | 9 | 0-10 scale |
| age | Optional | 25-34 | Age group |
| location | Optional | USA | Country/region |
| device_type | Optional | iOS | Device platform |
| user_segment | Optional | Enterprise | User type |
| date | Optional | 2024-01-15 | For trend analysis |

## Troubleshooting

**"API key not found"**
- Add `VITE_OPENROUTER_API_KEY` to Vercel environment variables

**"Analysis stuck"**
- Large datasets (1000+ entries) take 2-3 minutes
- Check your internet connection

**"CSV parsing failed"**
- Make sure column names are exactly: `feedback_text`, `nps_score`
- No extra spaces or different capitalization

**"Google Sheets not loading"**
- Make sure sheet is public (Share > Anyone with link)
- Use full URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`

## Next Steps

- Save your app URL and bookmark it
- Share the URL with your team
- Export analyses to share results
- Run new analyses weekly to track trends

## Support

- Full docs: See `README.md`
- Issues? Check troubleshooting section above
