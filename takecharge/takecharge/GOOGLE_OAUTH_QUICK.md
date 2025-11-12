# Google OAuth Quick Setup (Updated)

## ✅ Good News: No API to Enable!

You **don't need** to search for or enable "Google Identity Services API". Google OAuth works directly with credentials.

## 🚀 Quick Setup Steps

### Step 1: Configure OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Go to **APIs & Services** → **OAuth consent screen**
4. Select **External** → Click **Create**
5. Fill in:
   - **App name**: `TakeCharge`
   - **User support email**: Your email
   - **Developer contact information**: Your email
6. Click **Save and Continue**
7. **Scopes**: Click **Add or Remove Scopes**
   - Search for: `userinfo.email`
   - Search for: `userinfo.profile`
   - Add both
   - Click **Update**
   - Click **Save and Continue**
8. **Test users**: Add your email (for testing)
9. Click **Save and Continue**
10. Review and click **Back to Dashboard**

### Step 2: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. If you see "Configure consent screen" - you already did this, just click it
4. Select **Web application**
5. Fill in:
   - **Name**: `TakeCharge Web Client`
   - **Authorized JavaScript origins**: 
     ```
     http://localhost:3000
     ```
   - **Authorized redirect URIs**: 
     ```
     https://xebzbdbvijjgtchefdva.supabase.co/auth/v1/callback
     ```
6. Click **Create**
7. **IMPORTANT**: Copy the **Client ID** and **Client Secret**!

### Step 3: Add to Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Click **Google**
5. Toggle **Enable Google provider** to **ON**
6. Enter:
   - **Client ID (for OAuth)**: Paste your Google Client ID
   - **Client Secret (for OAuth)**: Paste your Google Client Secret
7. Click **Save**

### Step 4: Test

1. Start your app: `npm start`
2. Go to login/register page
3. Click **"Continue with Google"**
4. Sign in with Google
5. Should redirect back to your app ✅

## 🔑 Key URLs

**Authorized redirect URI** (in Google Cloud Console):
```
https://xebzbdbvijjgtchefdva.supabase.co/auth/v1/callback
```

**Authorized JavaScript origin** (in Google Cloud Console):
```
http://localhost:3000
```

## ⚠️ Common Mistakes

1. **Wrong redirect URI**: Must be exactly `https://xebzbdbvijjgtchefdva.supabase.co/auth/v1/callback`
2. **Missing scopes**: Make sure `userinfo.email` and `userinfo.profile` are added
3. **Not adding test user**: Add your email in OAuth consent screen test users

## ✅ That's It!

No API to enable - just OAuth consent screen + credentials + Supabase config!









