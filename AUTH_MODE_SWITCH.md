# 🔄 Authentication Mode Switch

## Current Mode: DEMO MODE ✅

Your app is currently running in **Demo Mode** which doesn't require Firebase setup. This is perfect for testing and development!

## Demo Mode Features

- ✅ Works immediately without Firebase setup
- ✅ Any email/password combination works
- ✅ User-specific data storage (using demo user ID)
- ✅ All authentication features work
- ✅ Perfect for testing and development
- ⚠️ Data stored in localStorage only
- ⚠️ No real authentication security

## How to Use Demo Mode

1. **Start the app**
   ```bash
   npm run dev
   ```

2. **Visit** http://localhost:9002

3. **Register** with any credentials:
   - Name: Test User
   - Email: test@example.com
   - Password: test123

4. **Login** works with any email/password

5. **Test all features** - everything works!

## Switch to Real Firebase Authentication

When you're ready to use real Firebase authentication:

### Step 1: Set up Firebase (5 minutes)

Follow the guide in `FIREBASE_SETUP_GUIDE.md`:
1. Create Firebase project
2. Enable Email/Password authentication
3. Get configuration values
4. Update `.env` file

### Step 2: Switch to Real Auth

Open `src/app/layout.tsx` and change this line:

**FROM (Demo Mode):**
```typescript
import { DemoAuthProvider as AuthProvider } from "@/contexts/DemoAuthContext";
```

**TO (Real Firebase):**
```typescript
import { AuthProvider } from "@/contexts/AuthContext";
```

### Step 3: Restart Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

That's it! Now you're using real Firebase authentication.

## Comparison

| Feature | Demo Mode | Firebase Mode |
|---------|-----------|---------------|
| Setup Required | ❌ None | ✅ 5 minutes |
| Real Authentication | ❌ No | ✅ Yes |
| Secure | ❌ No | ✅ Yes |
| Production Ready | ❌ No | ✅ Yes |
| Works Offline | ✅ Yes | ⚠️ Partial |
| User Management | ❌ No | ✅ Yes |
| Password Reset | ❌ No | ✅ Yes |
| Email Verification | ❌ No | ✅ Yes |
| Multi-device Sync | ❌ No | ✅ Yes (with Firestore) |

## Recommendation

- **For Development/Testing**: Use Demo Mode (current)
- **For Production**: Use Firebase Mode

## Current Configuration

Your `src/app/layout.tsx` is set to:
```typescript
import { DemoAuthProvider as AuthProvider } from "@/contexts/DemoAuthContext";
```

This means you're in **Demo Mode** and can start testing immediately!

## Testing Demo Mode Now

1. Make sure dev server is running:
   ```bash
   npm run dev
   ```

2. Open http://localhost:9002

3. You should see the login page

4. Click "Don't have an account? Register"

5. Enter ANY credentials (they all work in demo mode):
   - Name: John Doe
   - Email: john@test.com
   - Password: 123456

6. Click "Create Account"

7. You'll be logged in and see the dashboard!

8. Add some tasks, logout, login again - your data persists!

## Troubleshooting Demo Mode

### "Still getting Firebase error"
- Make sure you saved `src/app/layout.tsx`
- Restart the dev server
- Clear browser cache (Ctrl+Shift+R)

### "Can't login"
- Any email/password works in demo mode
- Just make sure password is at least 6 characters

### "Data not persisting"
- Check browser console for errors
- Make sure localStorage is enabled
- Try a different browser

## Need Help?

- Demo Mode issues: Check browser console (F12)
- Firebase setup: See `FIREBASE_SETUP_GUIDE.md`
- General auth: See `AUTH_SETUP_COMPLETE.md`
