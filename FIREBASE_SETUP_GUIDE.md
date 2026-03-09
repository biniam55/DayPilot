# 🔥 Firebase Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create Firebase Project

1. **Go to** [Firebase Console](https://console.firebase.google.com/)
2. **Click** "Add project" or "Create a project"
3. **Enter** project name: `DayPilot` (or any name you prefer)
4. **Click** "Continue"
5. **Disable** Google Analytics (optional, not needed for this app)
6. **Click** "Create project"
7. **Wait** for project creation (30 seconds)
8. **Click** "Continue"

### Step 2: Enable Email/Password Authentication

1. In the left sidebar, click **"Authentication"**
2. Click **"Get started"** button
3. Click **"Sign-in method"** tab
4. Click **"Email/Password"**
5. **Toggle ON** the first switch (Email/Password)
6. **Click** "Save"

### Step 3: Get Firebase Configuration

1. Click the **gear icon** (⚙️) next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** (`</>`)
5. Enter app nickname: `DayPilot Web`
6. **DO NOT** check "Also set up Firebase Hosting"
7. Click **"Register app"**
8. You'll see a code snippet with `firebaseConfig`

### Step 4: Copy Configuration Values

You'll see something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAbc123def456ghi789jkl012mno345pqr",
  authDomain: "daypilot-12345.firebaseapp.com",
  projectId: "daypilot-12345",
  storageBucket: "daypilot-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789"
};
```

### Step 5: Update .env File

Open your `.env` file and replace the placeholder values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbc123def456ghi789jkl012mno345pqr
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=daypilot-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=daypilot-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=daypilot-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789
```

### Step 6: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### Step 7: Test Authentication

1. Open http://localhost:9002
2. You should see the login page
3. Click "Don't have an account? Register"
4. Enter:
   - Name: Your Name
   - Email: test@example.com
   - Password: test123 (min 6 characters)
5. Click "Create Account"
6. You should be redirected to the dashboard!

## Troubleshooting

### "API key not valid"
- Make sure you copied the EXACT values from Firebase Console
- Check for extra spaces or quotes
- Ensure all values start with `NEXT_PUBLIC_`
- Restart dev server after changing .env

### "Email already in use"
- Go to Firebase Console → Authentication → Users
- Delete the test user
- Try registering again

### "Password should be at least 6 characters"
- Firebase requires minimum 6 characters
- Use a longer password

### "Too many requests"
- Firebase has rate limits
- Wait a few minutes
- Try again

## For Vercel Deployment

After setting up Firebase locally, add the same environment variables to Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
5. Select all environments (Production, Preview, Development)
6. Click "Save"
7. Redeploy your app

## Security Notes

- ✅ API keys in `.env` are safe for client-side use
- ✅ Firebase API keys are not secret (they're meant to be public)
- ✅ Security is enforced by Firebase Authentication rules
- ✅ Each user can only access their own data
- ⚠️ Never commit `.env` to git (it's in .gitignore)
- ⚠️ For production, use Vercel environment variables

## What You Get

After setup, your app will have:
- ✅ User registration with email/password
- ✅ User login
- ✅ Secure session management
- ✅ User-specific data storage
- ✅ Logout functionality
- ✅ Protected routes

## Need Help?

If you encounter issues:
1. Check Firebase Console for error messages
2. Check browser console (F12) for errors
3. Verify all environment variables are set correctly
4. Make sure Authentication is enabled in Firebase
5. Restart dev server after changing .env

## Alternative: Use Demo Mode (Temporary)

If you want to test without Firebase setup, I can create a demo mode that uses localStorage only (no authentication). Let me know if you'd prefer this approach!
