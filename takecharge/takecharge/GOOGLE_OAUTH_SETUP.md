# Google OAuth Setup Guide for TakeCharge

This guide will walk you through setting up Google authentication for your TakeCharge application.

## 📋 Prerequisites

- A Google account
- Access to Google Cloud Console
- Supabase project already set up

## 🚀 Step-by-Step Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter project details:
   - **Project name**: `TakeCharge` (or any name)
   - **Organization**: Leave as default (if applicable)
5. Click **"Create"**
6. Wait for the project to be created
7. Select the new project from the dropdown

### Step 2: Configure OAuth Consent Screen

**Note:** You don't need to enable any specific API for Google OAuth. Just configure the OAuth consent screen and create credentials.

### Step 3: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**
4. If prompted, configure the OAuth consent screen first:
   - **User Type**: Select **"External"** (unless you have a Google Workspace)
   - Click **"Create"**
   - **App name**: `TakeCharge`
   - **User support email**: Your email
   - **Developer contact information**: Your email
   - Click **"Save and Continue"**
   - **Scopes**: Click **"Add or Remove Scopes"**
     - Select: `userinfo.email` and `userinfo.profile`
     - Click **"Update"**
     - Click **"Save and Continue"**
   - **Test users**: Add your email (optional for testing)
   - Click **"Save and Continue"**
   - Review and click **"Back to Dashboard"**

5. Now create OAuth Client ID:
   - **Application type**: Select **"Web application"**
   - **Name**: `TakeCharge Web Client`
   - **Authorized JavaScript origins**: 
     ```
     http://localhost:3000
     ```
   - **Authorized redirect URIs**: 
     ```
     https://xebzbdbvijjgtchefdva.supabase.co/auth/v1/callback
     ```
   - Click **"Create"**
6. **IMPORTANT**: Copy the **Client ID** and **Client Secret** - you'll need these!

### Step 4: Configure Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **"Google"** in the list
5. Click on **"Google"** provider
6. Toggle **"Enable Google provider"** to **ON**
7. Enter your credentials:
   - **Client ID (for OAuth)**: Paste your Google Client ID
   - **Client Secret (for OAuth)**: Paste your Google Client Secret
8. Click **"Save"**

### Step 5: Test Google Authentication

1. Start your development server:
   ```bash
   npm start
   ```

2. Go to your app: `http://localhost:3000`

3. Navigate to login or register page

4. Click **"Continue with Google"** button

5. You should be redirected to Google sign-in page

6. After signing in, you'll be redirected back to your app

## ✅ Configuration Checklist

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 Client ID created
- [ ] Authorized redirect URI added: `https://xebzbdbvijjgtchefdva.supabase.co/auth/v1/callback`
- [ ] Client ID and Client Secret copied
- [ ] Google provider enabled in Supabase
- [ ] Client ID added to Supabase
- [ ] Client Secret added to Supabase
- [ ] Tested Google sign-in

## 🔧 Important URLs

### Your Supabase OAuth Callback URL
```
https://xebzbdbvijjgtchefdva.supabase.co/auth/v1/callback
```

**This MUST be added to Google Cloud Console as an Authorized redirect URI**

### Your App URLs (for Authorized JavaScript origins)
```
http://localhost:3000          (Development)
https://yourdomain.com         (Production - when deployed)
```

## 🐛 Troubleshooting

### Issue: "Error 400: redirect_uri_mismatch"
**Solution:**
- Check that the redirect URI in Google Cloud Console exactly matches:
  ```
  https://xebzbdbvijjgtchefdva.supabase.co/auth/v1/callback
  ```
- Make sure there are no trailing slashes or extra characters
- Verify you're using the correct Supabase project URL

### Issue: "OAuth client not found"
**Solution:**
- Verify Client ID is correct in Supabase
- Check that you copied the full Client ID (not truncated)
- Make sure you're using the Web application client ID (not iOS/Android)

### Issue: "Access blocked: This app's request is invalid"
**Solution:**
- Check OAuth consent screen is configured
- Verify your app is in "Testing" mode (for development)
- Add your email as a test user in OAuth consent screen
- Make sure required scopes are added

### Issue: "Google sign-in not redirecting"
**Solution:**
- Check Site URL is set in Supabase: `http://localhost:3000`
- Verify redirect URLs include: `http://localhost:3000/**`
- Check browser console for errors
- Verify Google provider is enabled in Supabase

### Issue: "Invalid client secret"
**Solution:**
- Double-check Client Secret is correct
- Make sure you copied the entire secret (no spaces)
- Regenerate if needed in Google Cloud Console

## 📝 Production Setup

When deploying to production:

1. **Update Google Cloud Console:**
   - Add production domain to **Authorized JavaScript origins**:
     ```
     https://yourdomain.com
     ```
   - Keep the same redirect URI (Supabase handles it)

2. **Update Supabase:**
   - Add production redirect URLs:
     ```
     https://yourdomain.com/**
     ```

3. **OAuth Consent Screen:**
   - Submit for verification (if needed)
   - Add production domain to authorized domains

## 🔐 Security Notes

- **Never commit** Client ID or Client Secret to version control
- Keep Client Secret secure
- Use environment variables for production
- Regularly rotate credentials if compromised

## 📚 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google Cloud Console](https://console.cloud.google.com/)

## ✅ Quick Reference

**Google Cloud Console:**
- Project: Your project name
- OAuth Client: Web application
- Redirect URI: `https://xebzbdbvijjgtchefdva.supabase.co/auth/v1/callback`
- JavaScript Origin: `http://localhost:3000`

**Supabase Dashboard:**
- Provider: Google
- Client ID: (from Google Cloud Console)
- Client Secret: (from Google Cloud Console)

---

**That's it!** 🎉 Your Google authentication should now be working!

