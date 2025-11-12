# Supabase Redirect URLs Configuration

## 🔗 What Redirect URLs to Add

In your Supabase Dashboard → **Authentication** → **URL Configuration**, add these redirect URLs:

### For Development (Local)
```
http://localhost:3000/**
http://localhost:3000/main-dashboard
http://localhost:3000/login
http://localhost:3000/register
http://localhost:3000
```

### For Production (When you deploy)
```
https://yourdomain.com/**
https://yourdomain.com/main-dashboard
https://yourdomain.com/login
https://yourdomain.com/register
https://yourdomain.com
```

## 📝 Step-by-Step Instructions

1. **Go to Supabase Dashboard:**
   - Open https://app.supabase.com
   - Select your project

2. **Navigate to URL Configuration:**
   - Click **Authentication** in left sidebar
   - Click **URL Configuration** tab

3. **Set Site URL:**
   - **Site URL**: `http://localhost:3000` (for development)
   - This is the base URL where your app is hosted

4. **Add Redirect URLs:**
   - Click **Add URL** or enter in the text area
   - Add each URL on a new line:
     ```
     http://localhost:3000/**
     http://localhost:3000/main-dashboard
     http://localhost:3000/login
     ```

5. **Save Changes:**
   - Click **Save** or the save button

## 🎯 Why Each URL is Needed

### `http://localhost:3000/**`
- **Purpose**: Wildcard that matches all routes
- **Used for**: OAuth callbacks, email confirmations, password resets
- **Why**: Allows Supabase to redirect to any page in your app

### `http://localhost:3000/main-dashboard`
- **Purpose**: Main landing page after login
- **Used for**: After successful authentication
- **Why**: Where users should land after signing in

### `http://localhost:3000/login`
- **Purpose**: Login page
- **Used for**: Redirecting after logout or session expiry
- **Why**: Where users go when not authenticated

### `http://localhost:3000/register`
- **Purpose**: Registration page
- **Used for**: Redirecting after email confirmation
- **Why**: Alternative landing page for new users

### `http://localhost:3000`
- **Purpose**: Root URL
- **Used for**: Default redirect
- **Why**: Fallback redirect location

## 🔐 OAuth Callback URL (Important!)

For **Google OAuth** and other OAuth providers, Supabase automatically uses:
```
https://xebzbdbvijjgtchefdva.supabase.co/auth/v1/callback
```

**You don't need to add this** - it's automatically configured by Supabase.

However, when setting up Google OAuth in Google Cloud Console, you MUST add:
```
https://xebzbdbvijjgtchefdva.supabase.co/auth/v1/callback
```

## 📱 Example Configuration

### Development Environment
```
Site URL: http://localhost:3000

Redirect URLs:
http://localhost:3000/**
http://localhost:3000/main-dashboard
http://localhost:3000/login
http://localhost:3000/register
```

### Production Environment
```
Site URL: https://takecharge.com

Redirect URLs:
https://takecharge.com/**
https://takecharge.com/main-dashboard
https://takecharge.com/login
https://takecharge.com/register
```

## ⚠️ Important Notes

1. **Wildcard (`**`)**: The wildcard `**` matches all sub-paths, so you might only need:
   ```
   http://localhost:3000/**
   ```
   This covers all routes automatically.

2. **HTTPS in Production**: Always use `https://` in production for security.

3. **No Trailing Slash**: Don't add trailing slashes (e.g., use `/login` not `/login/`).

4. **Exact Match**: URLs must match exactly (case-sensitive, protocol matters).

5. **Multiple Environments**: You can add both development and production URLs:
   ```
   http://localhost:3000/**
   https://yourdomain.com/**
   ```

## 🧪 Testing Redirect URLs

After adding URLs, test:

1. **Email Confirmation:**
   - Register a new account
   - Click confirmation link in email
   - Should redirect to your app

2. **OAuth (Google):**
   - Click "Sign in with Google"
   - After Google auth, should redirect back to your app

3. **Password Reset:**
   - Request password reset
   - Click reset link in email
   - Should redirect to your app

## 🐛 Troubleshooting

### Issue: "Redirect URL mismatch"
**Solution:** 
- Check URL is exactly the same (including `http://` vs `https://`)
- Make sure wildcard `**` is included
- Verify Site URL matches your app URL

### Issue: "Redirected to wrong page"
**Solution:**
- Check redirect URLs include the target page
- Verify OAuth redirect URL in provider settings

### Issue: "OAuth not redirecting"
**Solution:**
- Verify callback URL in Google Cloud Console matches Supabase callback
- Check Site URL is set correctly
- Ensure redirect URLs include your app domain

## ✅ Quick Checklist

- [ ] Site URL set to `http://localhost:3000` (development)
- [ ] Redirect URLs added (at least `http://localhost:3000/**`)
- [ ] URLs saved in Supabase
- [ ] Tested email confirmation redirect
- [ ] Tested OAuth redirect (if using)
- [ ] Production URLs added (when deploying)

---

**Quick Setup:** For development, just add:
```
http://localhost:3000/**
```

This wildcard covers all your routes!









