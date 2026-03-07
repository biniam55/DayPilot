# 🔐 Environment Variables Setup for Vercel

## ⚠️ IMPORTANT: Don't Skip This!

Your app uses API keys that need to be configured in Vercel. These are NOT pushed to GitHub for security reasons.

## Step 1: Prepare Your Environment Variables

You have these variables in your `.env` file:

```env
GEMINI_API_KEY=AIzaSyAF2dnXuixsmMqAYirvZvjySnA5sJVvhUo
GOOGLE_GENAI_API_KEY=AIzaSyAF2dnXuixsmMqAYirvZvjySnA5sJVvhUo
```

**Firebase variables (if you're using Firebase):**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 2: Add to Vercel (During Deployment)

### Option A: During Initial Deployment

When you click "Deploy" on Vercel:

1. **Before clicking "Deploy"**, scroll down to **"Environment Variables"**
2. Click **"Add"** for each variable:

   **Variable 1:**
   - Name: `GEMINI_API_KEY`
   - Value: `AIzaSyAF2dnXuixsmMqAYirvZvjySnA5sJVvhUo`
   - Environment: Select all (Production, Preview, Development)

   **Variable 2:**
   - Name: `GOOGLE_GENAI_API_KEY`
   - Value: `AIzaSyAF2dnXuixsmMqAYirvZvjySnA5sJVvhUo`
   - Environment: Select all

3. **If using Firebase**, add all 6 Firebase variables the same way

4. Click **"Deploy"**

### Option B: After Deployment

If you already deployed without adding variables:

1. Go to your project dashboard: https://vercel.com/dashboard
2. Click on your **"DayPilot"** project
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in the left sidebar
5. Add each variable:
   - Click **"Add New"**
   - Enter **Name** and **Value**
   - Select environments (Production, Preview, Development)
   - Click **"Save"**

6. **Redeploy** your app:
   - Go to **"Deployments"** tab
   - Click the **"..."** menu on the latest deployment
   - Click **"Redeploy"**

## Step 3: Verify Environment Variables

After deployment, check if they're working:

1. Open your deployed app
2. Open browser console (F12)
3. Check for any API errors
4. If you see "API key missing" errors, the variables weren't added correctly

## Quick Copy-Paste Format for Vercel

Copy this and paste into Vercel's environment variables section:

```
GEMINI_API_KEY=AIzaSyAF2dnXuixsmMqAYirvZvjySnA5sJVvhUo
GOOGLE_GENAI_API_KEY=AIzaSyAF2dnXuixsmMqAYirvZvjySnA5sJVvhUo
```

**If using Firebase, also add:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Security Notes

### ✅ Safe to Expose (NEXT_PUBLIC_*)
Variables starting with `NEXT_PUBLIC_` are safe to expose in the browser:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- etc.

These are meant to be public and are protected by Firebase security rules.

### 🔒 Keep Secret (No NEXT_PUBLIC_)
Variables without `NEXT_PUBLIC_` are server-side only:
- `GEMINI_API_KEY`
- `GOOGLE_GENAI_API_KEY`

These are never exposed to the browser.

## Troubleshooting

### "API Key Not Found" Error

**Solution:**
1. Check if variables are added in Vercel
2. Make sure variable names match exactly (case-sensitive)
3. Redeploy after adding variables

### Firebase Not Working

**Solution:**
1. Make sure all 6 Firebase variables are added
2. Check Firebase Console for correct values
3. Ensure Firebase project is active
4. Check Firebase security rules

### Variables Not Updating

**Solution:**
1. After changing variables in Vercel
2. You MUST redeploy for changes to take effect
3. Go to Deployments → Redeploy

## Alternative: Use Vercel CLI

If you prefer command line:

```bash
# Install Vercel CLI
npm install -g vercel

# Add environment variables
vercel env add GEMINI_API_KEY
# Paste your key when prompted

vercel env add GOOGLE_GENAI_API_KEY
# Paste your key when prompted

# Deploy
vercel --prod
```

## Firebase Setup (If Needed)

If you haven't set up Firebase yet:

1. Go to: https://console.firebase.google.com/
2. Create a new project or select existing
3. Go to Project Settings (gear icon)
4. Scroll to "Your apps" section
5. Click "Web" icon (</>)
6. Copy the config values
7. Add them to Vercel as environment variables

## Summary Checklist

- [ ] Copy your API keys from `.env` file
- [ ] Go to Vercel project settings
- [ ] Add all environment variables
- [ ] Select all environments (Production, Preview, Development)
- [ ] Save variables
- [ ] Redeploy your app
- [ ] Test the deployed app
- [ ] Check browser console for errors

---

**Important:** Never commit `.env` files to GitHub! They're already in `.gitignore`.

Your API keys are safe in Vercel's encrypted environment variable storage. 🔐
