# How to Clear PWA Cache After Update

The PWA (Progressive Web App) should auto-update, but if you're experiencing issues with videos not loading, follow these steps:

## Android (Chrome/Edge)

1. **Open the PWA app** on your phone
2. Tap the **three dots menu** (⋮) in the top right
3. Select **"App info"** or **"Site settings"**
4. Tap **"Storage"** or **"Storage & cache"**
5. Tap **"Clear storage"** and **"Clear cache"**
6. **Close the app completely** (swipe away from recent apps)
7. **Reopen the app** - it will download the latest version

## iOS (Safari)

1. **Close the PWA app**
2. Open **Safari**
3. Go to the website: `https://your-app-url.vercel.app`
4. Tap the **share button** (box with arrow)
5. Scroll down and tap **"Remove from Home Screen"**
6. **Refresh the page** in Safari (pull down)
7. Tap **share button** again → **"Add to Home Screen"**
8. Open the app from home screen

## Alternative: Force Refresh (Easier)

### On Desktop:
1. Open the app in Chrome
2. Press **Ctrl + Shift + R** (Windows/Linux) or **Cmd + Shift + R** (Mac)
3. This forces a hard refresh and clears the cache

### On Mobile:
1. Open the PWA app
2. Pull down to refresh multiple times
3. If videos still don't work, follow the full cache clear steps above

## What Was Fixed:

- ✅ Added YouTube player caching support for PWA
- ✅ Added YouTube thumbnail caching support
- ✅ Configured Service Worker to allow YouTube iframes
- ✅ Set proper cache expiration times
- ✅ Added NetworkFirst strategy for YouTube player (always tries network first)

## Technical Details:

The Service Worker now caches:
- **YouTube Player**: `www.youtube.com` and `www.youtube-nocookie.com` (NetworkFirst, 1 day cache)
- **YouTube Thumbnails**: `img.youtube.com` (CacheFirst, 30 days cache)
- **Supabase API**: NetworkFirst with 7 days cache
- **Google Fonts**: CacheFirst with 1 year cache

## Verification:

After clearing cache, open **Developer Tools** (F12 on desktop) and check:
1. Go to **Application** tab
2. Click **Service Workers** on the left
3. You should see a new service worker activated
4. Click **Cache Storage** and verify caches are present

## If Still Not Working:

1. Open browser console (F12)
2. Look for any error messages
3. Check if you see `[VideoPlayer]` logs
4. Share the error messages for debugging
