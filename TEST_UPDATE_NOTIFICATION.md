# 🧪 How to Test Update Notifications

## Why You're Not Seeing It Yet

The update notification only appears when:
1. You had a previous version stored
2. A new version is deployed
3. You visit the app after the new deployment

Since this is your first deployment with the notification system, you won't see it until the NEXT update.

## How to Test It Now

### Method 1: Manual Test (Easiest)

1. **Open your app on Android/Desktop**

2. **Open browser console** (if on desktop):
   - Press F12
   - Go to Console tab

3. **Run this command in console:**
   ```javascript
   localStorage.setItem('app-version', '1.0.0');
   location.reload();
   ```

4. **You should see:**
   - Update banner at the top
   - Notification in bell icon
   - Toast message

### Method 2: Simulate Real Update

1. **Visit your app** (this stores version 1.0.2)

2. **Wait for Vercel to deploy** (1-2 minutes)

3. **I'll update the version to 1.0.3** and push

4. **Wait another 2 minutes** for deployment

5. **Refresh your app** - Update notification appears!

### Method 3: Test on Next Real Update

The notification will automatically work on your next deployment:

1. Make any change to your app
2. Commit and push
3. Update version number in `src/hooks/useVersionCheck.ts`:
   ```typescript
   const APP_VERSION = '1.0.3';
   ```
4. Also update in `src/app/api/version/route.ts`
5. Push to GitHub
6. Wait for deployment
7. Users who had the old version will see the notification!

## How It Works

### First Visit (Current State)
```
User visits app → Version 1.0.2 stored → No notification
```

### After Update (Next Deployment)
```
User visits app → Detects stored 1.0.2 ≠ current 1.0.3 → Shows notification!
```

### After User Updates
```
User clicks "Update Now" → Reloads → Stores 1.0.3 → Notification dismissed
```

## Testing Checklist

- [ ] Open app in browser
- [ ] Open console (F12)
- [ ] Run: `localStorage.setItem('app-version', '1.0.0')`
- [ ] Refresh page
- [ ] See update banner at top
- [ ] See notification in bell icon (🔔)
- [ ] Click "Update Now"
- [ ] Page reloads
- [ ] Notification disappears

## What You Should See

### Update Banner
```
┌─────────────────────────────────────────┐
│ 🔄 Update Available                     │
│ A new version of DayPilot is ready      │
│                      [Update Now] [X]   │
└─────────────────────────────────────────┘
```

### Notification Center
```
🔔 (with red dot)
├─ 🎉 Update Available
│  A new version of DayPilot is ready.
│  Tap to update now!
│  [Update Now]
└─ Just now
```

### Toast Message
```
┌─────────────────────────────┐
│ Update Available            │
│ A new version is ready.     │
│ Check notifications!        │
└─────────────────────────────┘
```

## Troubleshooting

### "I don't see any notification"

**Check 1: Version in localStorage**
```javascript
// In console
localStorage.getItem('app-version')
// Should return: "1.0.2"
```

**Check 2: Force old version**
```javascript
localStorage.setItem('app-version', '1.0.0');
location.reload();
```

**Check 3: Clear everything**
```javascript
localStorage.clear();
location.reload();
// Then set old version and reload again
```

### "Notification appears but won't dismiss"

**Solution:**
```javascript
localStorage.setItem('app-version', '1.0.2');
location.reload();
```

### "Multiple notifications"

**Solution:**
```javascript
localStorage.clear();
location.reload();
```

## For Future Updates

### When You Deploy a New Version:

1. **Update version number** in TWO places:
   
   **File 1:** `src/hooks/useVersionCheck.ts`
   ```typescript
   const APP_VERSION = '1.0.3'; // Increment this
   ```
   
   **File 2:** `src/app/api/version/route.ts`
   ```typescript
   const APP_VERSION = '1.0.3'; // Keep in sync
   ```

2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Release v1.0.3"
   git push origin main
   ```

3. **Users automatically get notified!**

## Automatic Detection

The system checks for updates:
- ✅ On page load
- ✅ Every 5 minutes
- ✅ When app comes back to foreground
- ✅ Via version API endpoint

## Quick Test Script

Copy and paste this in browser console:

```javascript
// Test update notification
console.log('Current version:', localStorage.getItem('app-version'));
localStorage.setItem('app-version', '1.0.0');
console.log('Set to old version, reloading...');
setTimeout(() => location.reload(), 1000);
```

## Expected Behavior

### Scenario 1: First Time User
- No notification (no previous version)
- Version 1.0.2 stored
- Ready for next update

### Scenario 2: Returning User (After Update)
- Detects version mismatch
- Shows notification immediately
- Stores new version after update

### Scenario 3: User Dismisses
- Notification hidden
- Version updated in storage
- Won't show again until next update

## Summary

✅ System is working correctly
✅ Will show on next deployment
✅ Can test manually with console commands
✅ Automatic detection every 5 minutes

**To see it now:** Use the manual test method above! 🚀
