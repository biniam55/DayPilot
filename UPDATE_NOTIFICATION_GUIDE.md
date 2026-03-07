# 🔔 Update Notification System

## How It Works

Your DayPilot app now automatically notifies users when a new version is available!

## Features

### 1. **Update Banner**
- Appears at the top of the screen when an update is available
- Shows "Update Available" message
- Has "Update Now" button to reload the app
- Can be dismissed with X button

### 2. **Notification Center**
- Update notification appears in the bell icon (🔔)
- Shows as unread with a red dot
- Clicking the notification reloads the app
- Includes "Update Now" action button

### 3. **Toast Notification**
- Brief popup notification when update is detected
- Directs users to check notifications

## How to Deploy Updates

### Step 1: Update Version Number

Edit `src/hooks/useVersionCheck.ts`:

```typescript
const APP_VERSION = '1.0.2'; // Change this number
```

Version format: `MAJOR.MINOR.PATCH`
- **MAJOR**: Breaking changes (1.0.0 → 2.0.0)
- **MINOR**: New features (1.0.0 → 1.1.0)
- **PATCH**: Bug fixes (1.0.0 → 1.0.1)

### Step 2: Commit and Push

```bash
git add .
git commit -m "Release v1.0.2 - Add new feature"
git push origin main
```

### Step 3: Vercel Auto-Deploys

Vercel automatically builds and deploys your update (1-2 minutes)

### Step 4: Users Get Notified

When users open the app:
1. ✅ Version check runs automatically
2. ✅ Detects new version
3. ✅ Shows update banner
4. ✅ Adds notification to bell icon
5. ✅ Shows toast message

## Update Detection Methods

### Method 1: Version Number (Primary)
- Compares stored version with current version
- Triggers on first load after update
- Most reliable method

### Method 2: Page Modified Check
- Checks `Last-Modified` header every 10 minutes
- Detects when page content changes
- Works even if version number isn't updated

### Method 3: Service Worker (Future)
- Will work with PWA service workers
- Instant update detection
- Requires service worker setup

## User Experience

### On Desktop:
```
┌─────────────────────────────────────┐
│ 🔄 Update Available                 │
│ A new version of DayPilot is ready  │
│                    [Update Now] [X] │
└─────────────────────────────────────┘
```

### On Mobile:
- Banner appears at top
- Notification badge on bell icon
- Tap notification to update
- Smooth reload experience

## Configuration

### Check Frequency

Edit `src/hooks/useVersionCheck.ts`:

```typescript
// Check every 10 minutes (default)
const interval = setInterval(checkVersion, 10 * 60 * 1000);

// Change to 5 minutes:
const interval = setInterval(checkVersion, 5 * 60 * 1000);

// Change to 30 minutes:
const interval = setInterval(checkVersion, 30 * 60 * 1000);
```

### Disable Auto-Check

To disable automatic checks, comment out the interval:

```typescript
// const interval = setInterval(checkVersion, 10 * 60 * 1000);
```

## Testing Updates

### Test Locally:

1. **Change version number:**
   ```typescript
   const APP_VERSION = '1.0.2';
   ```

2. **Run dev server:**
   ```bash
   npm run dev
   ```

3. **Open app in browser**

4. **Change version again:**
   ```typescript
   const APP_VERSION = '1.0.3';
   ```

5. **Refresh page** - Update notification should appear!

### Test on Production:

1. Deploy with version `1.0.1`
2. Wait for deployment to complete
3. Open app on your phone
4. Deploy again with version `1.0.2`
5. Wait 10 minutes or refresh app
6. Update notification appears!

## Customization

### Change Banner Colors

Edit `src/components/UpdateBanner.tsx`:

```typescript
// Current: Primary color
className="bg-primary text-primary-foreground"

// Change to green:
className="bg-green-600 text-white"

// Change to blue:
className="bg-blue-600 text-white"
```

### Change Notification Message

Edit `src/hooks/useDashboardState.ts`:

```typescript
const updateNotification: Notification = {
  id: 'update-available',
  title: '🎉 Update Available',  // Change this
  description: 'A new version of DayPilot is ready. Tap to update now!',  // Change this
  time: 'Just now',
  isRead: false,
  type: 'update',
  action: reloadApp,
  actionLabel: 'Update Now'  // Change this
};
```

### Add Release Notes

You can add release notes to the notification:

```typescript
description: 'v1.0.2: Fixed task persistence bug and improved performance!',
```

## Best Practices

### 1. **Version Numbering**
- Always increment version on each deployment
- Use semantic versioning (MAJOR.MINOR.PATCH)
- Document changes in commit messages

### 2. **Update Frequency**
- Don't update too frequently (annoys users)
- Batch small fixes into one update
- Major features deserve immediate updates

### 3. **User Communication**
- Keep update messages clear and brief
- Mention key improvements
- Don't force updates (let users choose when)

### 4. **Testing**
- Test updates on staging first
- Verify notification appears correctly
- Check on both mobile and desktop

## Troubleshooting

### Update Notification Not Appearing

**Check 1: Version Number**
- Ensure version was actually changed
- Check localStorage: `localStorage.getItem('app-version')`

**Check 2: Cache**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Close and reopen app

**Check 3: Timing**
- Wait 10 minutes for automatic check
- Or manually refresh the page

### Banner Not Dismissing

**Solution:**
- Check browser console for errors
- Ensure `dismissUpdate` function is working
- Try clearing localStorage

### Multiple Notifications

**Solution:**
- Clear localStorage: `localStorage.clear()`
- Refresh app
- Should only show one notification

## Future Enhancements

### Planned Features:
- [ ] Service Worker integration for instant updates
- [ ] Update changelog display
- [ ] Optional auto-update (no user action needed)
- [ ] Update download progress indicator
- [ ] Rollback to previous version option
- [ ] A/B testing for updates

## Summary

✅ Automatic update detection
✅ User-friendly notifications
✅ Multiple notification methods
✅ Easy version management
✅ Customizable messages
✅ Works on mobile and desktop

**Your users will always know when a new version is available!** 🎉
