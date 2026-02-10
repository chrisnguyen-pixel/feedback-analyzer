# Code Structure Explained (Simple)

This guide explains what each file does without technical jargon.

---

## 📂 Folder Organization

```
src/
├── components/    ← UI screens and displays
├── services/      ← Behind-the-scenes logic
├── types/         ← Data structure definitions
├── App.tsx        ← Main app connector
└── main.tsx       ← Starts the app
```

---

## 🖼️ Components (The Screens You See)

Each component is a screen or section. They have:
- `.tsx` file - The HTML/content
- `.css` file - The styling

### Main Components

**Header.tsx** (`src/components/Header.tsx`)
- Top navigation bar
- Title "UX Feedback Analyzer"
- Navigation buttons (New Analysis, History)

**FileUpload.tsx**
- First screen you see
- Upload CSV file button
- Paste Google Sheets URL box
- Instructions and tips

**DataPreview.tsx**
- Shows your data in a table
- First 5 rows preview
- Summary stats (total entries, NPS, etc.)
- "Analyze" button to start

**AnalysisProgress.tsx**
- Loading screen while Claude analyzes
- Shows spinning animation
- Encouraging messages

**Dashboard.tsx** (Main Results Screen)
- Organizes all the charts and reports
- Calls other components to display:
  - NPS Card
  - Sentiment Chart
  - Themes Panel
  - Demographics
  - Trends
  - Insights
  - Export buttons

**Sub-Components** (Parts of Dashboard)

- **NpsCard.tsx** - Shows NPS score (big number) + pie chart
- **SentimentOverview.tsx** - Shows positive/neutral/negative breakdown
- **ThemesPanel.tsx** - Lists themes with quotes and sentiment bars
- **DemographicsBreakdown.tsx** - Shows data by age, location, device, segment
- **TrendsChart.tsx** - Line chart showing NPS over time
- **InsightsPanel.tsx** - List of key findings
- **ExportOptions.tsx** - Dropdown with JSON/CSV/PDF export buttons

**AnalysisHistory.tsx**
- Shows list of previous analyses
- View or delete each one

---

## ⚙️ Services (The Brain)

These files contain the logic that does actual work:

### csvParser.ts
**What it does**: Reads and validates CSV files

**Key functions**:
- `parseCSV(csvContent)` - Takes raw CSV text, returns clean data
- `fetchGoogleSheetAsCSV(sheetUrl)` - Converts Google Sheets link to CSV and fetches it

**Why it matters**: Makes sure your data is valid before sending to Claude

### claudeAnalyzer.ts
**What it does**: Sends your feedback to Claude AI and gets back analysis

**Key functions**:
- `analyzeFeedback(feedbackData)` - Main function that orchestrates everything
- `callClaude(batch)` - Sends one batch (40 entries) to Claude
- `aggregateResults(results)` - Combines all batch results

**How it works**:
1. Takes your feedback list
2. Splits into batches of 40
3. Sends each batch to Claude
4. Claude returns themes, sentiment, NPS breakdown
5. Combines all results into one final analysis
6. Returns nicely formatted data

**Token optimization**:
- Batches 40 entries per call (not 1 at a time)
- Uses single prompt that extracts everything
- Costs only $0.01-0.30 per analysis

### storage.ts
**What it does**: Saves and retrieves analyses from browser memory

**Key functions**:
- `saveAnalysis(result)` - Save to localStorage
- `getAllAnalyses()` - Get all saved analyses
- `deleteAnalysis(id)` - Remove an analysis
- `downloadJSON(result)` - Download as JSON file
- `downloadCSV(result)` - Download as CSV file

**Why localStorage?**
- Data stays on YOUR computer
- No server needed
- Fast access
- Private

---

## 📋 Types (Data Structures)

**feedback.ts** defines what your data looks like:

```typescript
FeedbackEntry {
  feedback_text: string          // "Great app!"
  nps_score: number             // 9
  age?: string                  // Optional: "25-34"
  location?: string             // Optional: "USA"
  device_type?: string          // Optional: "iOS"
  user_segment?: string         // Optional: "Enterprise"
  date?: string                 // Optional: "2024-01-15"
}

AnalysisResult {
  nps: {...}                    // NPS metrics
  sentiment: {...}              // Positive/neutral/negative counts
  themes: [Theme, ...]          // List of themes found
  demographics: {...}           // Breakdown by age/location/etc
  trends: [TrendData, ...]      // NPS over time
  insights: ["insight1", ...]   // Key findings
}

Theme {
  name: string                  // "Usability Issues"
  count: number                 // How many times mentioned
  sentiment: {...}              // Positive/neutral/negative split
  quotes: [string, ...]         // Sample quotes
  description: string           // Explanation
}
```

These definitions help TypeScript catch errors early.

---

## 🔄 How Data Flows

```
User uploads CSV/Sheets
         ↓
csvParser validates & cleans
         ↓
Show preview to user
         ↓
User clicks "Analyze"
         ↓
claudeAnalyzer.analyzeFeedback()
         ↓
Split into 40-entry batches
         ↓
For each batch: Send to Claude
         ↓
Claude returns: themes, sentiment, NPS, quotes
         ↓
Aggregate all results
         ↓
storage.saveAnalysis()
         ↓
Dashboard components display results
         ↓
User clicks "Export"
         ↓
Download JSON/CSV or Print PDF
```

---

## 🎨 App.tsx (The Controller)

This is the "main" file that coordinates everything:

```typescript
App() {
  State (what page are we on?):
  - 'upload'    → Show FileUpload
  - 'preview'   → Show DataPreview
  - 'analyzing' → Show AnalysisProgress
  - 'dashboard' → Show Dashboard
  - 'history'   → Show AnalysisHistory

  Functions (what happens?):
  - handleFileLoaded()  → User uploaded file
  - handleAnalyze()     → User clicked analyze
  - handleNewAnalysis() → Start over

  Think of it like a TV remote that switches between channels
}
```

---

## 🎯 Key Files Explained

| File | Purpose | Key Functions |
|------|---------|---|
| `csvParser.ts` | Read CSV/Sheets | `parseCSV()`, `fetchGoogleSheetAsCSV()` |
| `claudeAnalyzer.ts` | AI analysis | `analyzeFeedback()`, `callClaude()` |
| `storage.ts` | Save/Load data | `saveAnalysis()`, `downloadJSON()` |
| `App.tsx` | Control flow | State management, page switching |
| `Dashboard.tsx` | Show results | Displays all components |
| `FileUpload.tsx` | Get data | CSV upload, Google Sheets URL |
| `DataPreview.tsx` | Verify data | Show table, validate |
| `NpsCard.tsx` | NPS display | Shows NPS score + breakdown |
| `ThemesPanel.tsx` | Show themes | Lists all themes with details |

---

## 🔐 Security & Privacy

**Your data stays private:**

1. **Client-side processing** - Everything happens in YOUR browser
2. **No database** - Data never stored on servers
3. **API key safe** - Only used to call Claude, never exposed to clients
4. **CSV on your machine** - You upload, we process locally
5. **Export for sharing** - You decide what to share

**Only Claude sees your feedback text** (sent via API call).

---

## 🐛 Understanding Errors

If something breaks, check:

1. **Browser Console** (F12 > Console tab)
   - Shows JavaScript errors
   - Look for red error messages

2. **Network Tab** (F12 > Network tab)
   - Shows API calls to OpenRouter
   - Check if Claude API call failed

3. **Local Storage** (F12 > Application > Local Storage)
   - Shows saved analyses
   - Can view previous results

---

## 💡 Quick Reference

| Need | File | Function |
|------|------|----------|
| Add a button | Components/*.tsx | Just add `<button>` |
| Change colors | Components/*.css | Edit hex colors |
| Change Claude prompt | claudeAnalyzer.ts | Edit the prompt variable |
| Add a new visualization | components/*.tsx | Use Recharts library |
| Store more data | storage.ts | Modify localStorage logic |

---

## 🚀 Making Changes

To modify the app:

1. Find the file you want to change
2. Edit it
3. Save (Ctrl+S)
4. Refresh browser (F5)
5. See changes instantly (in dev mode)

Example: To change the title

```typescript
// In Header.tsx, line 1:
<h1>UX Feedback Analyzer</h1>

// Change to:
<h1>My Awesome Feedback Tool</h1>

// Save, refresh browser, done!
```

---

## 📖 Learning Resources

To understand the code better:

- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Recharts**: https://recharts.org
- **Vite**: https://vitejs.dev

---

## 🎓 Understanding the Tech

- **React** - Makes interactive UIs (like a game interface)
- **TypeScript** - JavaScript with safety checks (catches bugs early)
- **Vite** - Fast build tool (compiles code for browsers)
- **Recharts** - Makes charts and graphs
- **localStorage** - Browser's built-in storage (like a notepad)

---

## ✨ That's It!

You now understand how the code is organized and what each part does.

**Key Takeaway:**
- Components = Things you see (screens, buttons, charts)
- Services = Behind-the-scenes work (parsing, AI calls, storage)
- App.tsx = Controls which component to show

Start exploring the code! It's well-commented.
