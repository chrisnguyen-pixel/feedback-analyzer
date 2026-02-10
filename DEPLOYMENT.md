# Deployment Guide

Complete step-by-step guide to deploy your UX Feedback Analyzer to the web.

## Prerequisites

- OpenRouter API key (you have this)
- A public folder/repo location (GitHub recommended)
- About 10 minutes

## Method 1: Deploy to Vercel (Easiest for Non-Engineers)

### Step 1: Prepare Your Code

If you haven't already, initialize Git:

```bash
cd feedback-analyzer
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Create GitHub Repository

1. Go to **github.com**
2. Log in (create account if needed)
3. Click **"+" > "New repository"**
4. Name: `feedback-analyzer`
5. Description: "AI-powered UX feedback analyzer"
6. Click **"Create repository"**
7. Follow the instructions to push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/feedback-analyzer.git
git branch -M main
git push -u origin main
```

### Step 3: Connect to Vercel

1. Go to **vercel.com**
2. Click **"Sign up"** (choose "GitHub" option)
3. Authorize GitHub access
4. Click **"Import Project"**
5. Select your `feedback-analyzer` repository
6. Click **"Import"**

### Step 4: Configure Environment Variables

1. After import, go to **"Environment Variables"** section
2. Click **"Add New"**
3. Add this variable:
   - **Name**: `VITE_OPENROUTER_API_KEY`
   - **Value**: Your OpenRouter API key
   - **Select scope**: Production
4. Click **"Save"**

### Step 5: Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (2-3 minutes)
3. You'll see a green checkmark when done
4. Click **"Visit"** to see your live app!

### Step 6: Get Your URL

Your app is now live at: `https://your-project-name.vercel.app`

**Share this URL with your team!**

---

## Method 2: Deploy to Netlify

### Step 1-2: Same as Vercel
Push your code to GitHub first (see Vercel steps 1-2)

### Step 3: Connect to Netlify

1. Go to **netlify.com**
2. Click **"Sign up"** (choose "GitHub" option)
3. Click **"New site from Git"**
4. Select GitHub and choose your repository
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Click **"Deploy"**

### Step 4: Add Environment Variable

1. Go to **"Site settings"**
2. Click **"Build & deploy"** > **"Environment"**
3. Click **"Edit variables"**
4. Add:
   - `VITE_OPENROUTER_API_KEY`: Your OpenRouter API key
5. Trigger redeploy

---

## Method 3: Run Locally (Without Deployment)

For testing or personal use:

```bash
# Install dependencies
npm install

# Create .env file
echo "VITE_OPENROUTER_API_KEY=your_key_here" > .env

# Start development server
npm run dev

# Open http://localhost:5173
```

Press **Ctrl+C** to stop the server.

---

## Making Updates After Deployment

### Vercel/Netlify Auto-Deploy

Once deployed to Vercel/Netlify, any changes you push to GitHub automatically redeploy:

```bash
# Make changes to files
# Then...
git add .
git commit -m "Update: description"
git push
```

Your live app updates automatically in 1-2 minutes!

---

## Verify Deployment

After deployment:

1. Open your live URL
2. Upload test feedback CSV
3. Click "Analyze"
4. Verify results appear

If you see "API key not configured" error:
- Check environment variable is set in Vercel/Netlify
- Make sure variable name is exactly: `VITE_OPENROUTER_API_KEY`

---

## Custom Domain (Optional)

If you want a custom domain (e.g., `feedback.mycompany.com`):

### Vercel Custom Domain

1. Go to Vercel project settings
2. Click "Domains"
3. Enter your domain
4. Follow DNS setup instructions
5. Done!

### Netlify Custom Domain

1. Go to Site settings
2. Click "Domain settings"
3. Click "Add custom domain"
4. Follow instructions

---

## Troubleshooting Deployment

### Build Fails

Check console output for errors. Common issues:

- **Node version**: Vercel uses Node 18+
- **Dependencies**: Make sure `npm install` completes locally
- **TypeScript errors**: Fix with `npm run build` locally first

### App Shows Blank Page

1. Check browser console (F12) for errors
2. Verify environment variable is set
3. Clear browser cache and reload

### API Not Working

1. Verify `VITE_OPENROUTER_API_KEY` is set
2. Check API key is valid in OpenRouter dashboard
3. Ensure CORS not blocking requests

### Slow Analysis

Large datasets (1000+ entries) may take 1-2 minutes. This is normal.

---

## Monitoring

### Vercel Analytics

1. Go to Vercel project
2. Click "Analytics"
3. View traffic and performance

### OpenRouter Usage

1. Go to openrouter.ai dashboard
2. Click "Usage"
3. Monitor API costs

---

## Rollback Changes

If something breaks, rollback to previous version:

```bash
git log                    # See previous commits
git revert <commit-hash>   # Undo specific commit
git push                   # Push rollback
```

---

## Production Checklist

Before sharing widely:

- [ ] Test analysis with sample data
- [ ] Verify export functions work
- [ ] Check mobile responsiveness
- [ ] Test with 100+ feedback entries
- [ ] Verify API key not exposed
- [ ] Share URL with team

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Vite Docs**: https://vitejs.dev
- **React Docs**: https://react.dev

---

## That's It!

Your UX Feedback Analyzer is now live and ready for your team to use.

Questions? Check the main README.md or QUICKSTART.md for more info.
