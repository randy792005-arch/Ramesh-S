# Supabase Authentication Setup Guide

This guide will help you set up Supabase Authentication for your TakeCharge application.

## ✅ What's Already Done

- ✅ Auth service created (`src/services/authService.js`)
- ✅ Auth context/provider created (`src/contexts/AuthContext.jsx`)
- ✅ Login form integrated with Supabase Auth
- ✅ Registration form integrated with Supabase Auth
- ✅ Header component shows user info and logout
- ✅ Booking confirmation requires authentication

## 🚀 Setup Steps

### Step 1: Enable Email Authentication in Supabase

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Click on **Authentication** in the left sidebar
4. Click on **Providers** tab
5. Find **Email** provider and make sure it's **Enabled**
6. Configure email settings:
   - **Enable email confirmations**: Toggle ON (recommended for production)
   - **Enable secure email change**: Toggle ON
   - **Double confirm email changes**: Toggle ON (optional)

### Step 2: Configure Email Templates (Optional)

1. In **Authentication** → **Email Templates**
2. Customize email templates for:
   - **Confirm signup** - Sent when user registers
   - **Magic Link** - For passwordless login
   - **Change Email Address** - When user changes email
   - **Reset Password** - For password reset

### Step 3: Set Up Site URL

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `http://localhost:3000` (for development)
3. Add **Redirect URLs**:
   - `http://localhost:3000/**`
   - `http://localhost:3000/main-dashboard`
   - `http://localhost:3000/login`

### Step 4: Enable Google OAuth (Optional)

1. Go to **Authentication** → **Providers**
2. Click on **Google** provider
3. Toggle **Enable Google provider** to ON
4. You'll need:
   - **Google Client ID** (from Google Cloud Console)
   - **Google Client Secret** (from Google Cloud Console)
5. Get credentials from: https://console.cloud.google.com/apis/credentials

**To get Google OAuth credentials:**
1. Go to Google Cloud Console
2. Create a new project or select existing
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set **Application type** to **Web application**
6. Add **Authorized redirect URIs**: `https://xebzbdbvijjgtchefdva.supabase.co/auth/v1/callback`
7. Copy **Client ID** and **Client Secret** to Supabase

### Step 5: Enable Phone Authentication (Optional)

1. Go to **Authentication** → **Providers**
2. Click on **Phone** provider
3. Toggle **Enable Phone provider** to ON
4. Configure SMS provider (Twilio recommended)
5. Add Twilio credentials:
   - **Account SID**
   - **Auth Token**
   - **Phone Number**

### Step 6: Test Authentication

1. **Test Registration:**
   - Go to `/register` page
   - Fill in the form
   - Submit registration
   - Check email for confirmation (if enabled)

2. **Test Login:**
   - Go to `/login` page
   - Enter email and password
   - Should redirect to dashboard

3. **Test Logout:**
   - Click user menu → Sign Out
   - Should redirect to login page

## 📝 User Flow

### Registration Flow
1. User fills registration form
2. `signUp()` creates account in Supabase
3. If email confirmation enabled → User receives email
4. User confirms email → Can sign in
5. If auto-signin → Redirects to dashboard

### Login Flow
1. User enters email/password
2. `signIn()` authenticates with Supabase
3. On success → Redirects to dashboard
4. Auth context updates with user data

### Booking Flow
1. User must be authenticated
2. If not authenticated → Redirects to login
3. Booking uses `user.id` from auth context
4. Booking saved with authenticated user ID

## 🔐 Security Features

- ✅ Password hashing (handled by Supabase)
- ✅ Email verification (optional)
- ✅ Session management (automatic)
- ✅ JWT tokens (automatic)
- ✅ Row Level Security (RLS) policies

## 🧪 Testing Credentials

After setting up, you can test with:

1. **Create a test account:**
   - Go to `/register`
   - Use a real email address
   - Create password (min 8 characters)

2. **Sign in:**
   - Go to `/login`
   - Use the email/password you created

## 🐛 Troubleshooting

### Issue: "Email not confirmed"
**Solution:** Check email for confirmation link, or disable email confirmation in Supabase settings for testing.

### Issue: "Invalid login credentials"
**Solution:** 
- Check email/password are correct
- Make sure account exists
- Check if email is confirmed (if confirmation enabled)

### Issue: "Google OAuth not working"
**Solution:**
- Check redirect URI matches Supabase callback URL
- Verify Google credentials are correct
- Check Site URL is set correctly

### Issue: "User not authenticated in booking"
**Solution:**
- Make sure user is logged in
- Check auth context is working
- Verify session is active

## 📚 Next Steps

1. **Add Protected Routes:**
   - Protect routes that require authentication
   - Redirect to login if not authenticated

2. **Add User Profile:**
   - Create profile page
   - Allow users to update their info

3. **Add Password Reset:**
   - Implement forgot password flow
   - Add reset password page

4. **Add Social Auth:**
   - Set up Google OAuth
   - Add other providers (Facebook, Apple, etc.)

## ✅ Checklist

- [ ] Email authentication enabled in Supabase
- [ ] Site URL configured
- [ ] Redirect URLs added
- [ ] Test registration works
- [ ] Test login works
- [ ] Test logout works
- [ ] User info shows in header
- [ ] Bookings require authentication
- [ ] Google OAuth configured (optional)
- [ ] Phone auth configured (optional)

---

**Congratulations!** 🎉 Your authentication is now set up and ready to use!









