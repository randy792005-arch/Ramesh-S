# Email Setup Guide for TakeCharge

This guide explains how to enable and configure user email addresses in your TakeCharge application.

## 📧 Email Authentication Setup

### Step 1: Enable Email Authentication in Supabase

1. **Go to Supabase Dashboard:**
   - Visit https://app.supabase.com
   - Select your project

2. **Enable Email Provider:**
   - Click on **Authentication** in the left sidebar
   - Click on **Providers** tab
   - Find **Email** provider
   - Toggle **Enable Email provider** to **ON** ✅

3. **Configure Email Settings:**
   - **Enable email confirmations**: 
     - Toggle **ON** for production (users must verify email)
     - Toggle **OFF** for development/testing (auto-verify)
   - **Enable secure email change**: Toggle **ON** ✅
   - **Double confirm email changes**: Toggle **ON** (optional) ✅

### Step 2: Configure Email Templates

1. **Go to Email Templates:**
   - In **Authentication** → **Email Templates**

2. **Customize Templates:**
   - **Confirm signup** - Sent when user registers
   - **Magic Link** - For passwordless login
   - **Change Email Address** - When user changes email
   - **Reset Password** - For password reset

3. **Email Template Variables:**
   - `{{ .ConfirmationURL }}` - Email confirmation link
   - `{{ .Email }}` - User's email address
   - `{{ .SiteURL }}` - Your site URL
   - `{{ .Token }}` - Confirmation token

### Step 3: Set Up Site URL and Redirect URLs

1. **Go to URL Configuration:**
   - In **Authentication** → **URL Configuration**

2. **Set Site URL:**
   - **Development**: `http://localhost:5173` (or your Vite dev port)
   - **Production**: `https://yourdomain.com`

3. **Add Redirect URLs:**
   - `http://localhost:5173/**`
   - `http://localhost:5173/main-dashboard`
   - `http://localhost:5173/login`
   - `https://yourdomain.com/**` (for production)

### Step 4: Configure SMTP (Optional - For Custom Email)

By default, Supabase uses their email service. For production, you can configure custom SMTP:

1. **Go to Project Settings:**
   - Click on **Settings** → **Auth**

2. **Configure SMTP:**
   - **SMTP Host**: Your SMTP server (e.g., smtp.gmail.com)
   - **SMTP Port**: 587 (TLS) or 465 (SSL)
   - **SMTP User**: Your email address
   - **SMTP Password**: Your email password or app password
   - **Sender Email**: Email address to send from
   - **Sender Name**: Display name (e.g., "TakeCharge")

**Popular SMTP Providers:**
- **Gmail**: smtp.gmail.com (port 587)
- **SendGrid**: smtp.sendgrid.net (port 587)
- **Mailgun**: smtp.mailgun.org (port 587)
- **AWS SES**: email-smtp.region.amazonaws.com (port 587)

## ✅ Email Verification Flow

### Current Implementation

The app already handles email verification:

1. **User Registration:**
   - User signs up with email and password
   - If email confirmation is enabled → User receives confirmation email
   - User clicks link in email → Email is verified
   - User can then sign in

2. **Auto-Sign In (if confirmation disabled):**
   - User signs up → Automatically signed in
   - No email confirmation required

### Code Flow

```javascript
// In registration (src/pages/register/index.jsx)
const { data, error } = await signUp(email, password, metadata);

if (data?.user && !data?.session) {
  // Email confirmation required
  alert('Please check your email to confirm your account');
} else {
  // Auto-signed in (confirmation disabled)
  navigate('/main-dashboard');
}
```

## 📬 Email Notifications Setup

### Step 1: Configure Email Service for Notifications

1. **Sign up for Email Service:**
   - **Resend** (Recommended - Free tier): https://resend.com
   - **SendGrid**: https://sendgrid.com
   - **Mailgun**: https://mailgun.com

2. **Get API Key:**
   - For Resend: Go to https://resend.com/api-keys
   - Create API key
   - Copy the key

3. **Add to Environment Variables:**
   - Open `.env` file
   - Add: `VITE_EMAIL_API_KEY=re_xxxxxxxxxxxxx`

### Step 2: Verify Email Notifications Work

1. **Test Booking Confirmation:**
   - Create a booking
   - Check user's email for confirmation
   - Email should contain booking details

2. **Check Notification Preferences:**
   - Go to Settings → Notifications
   - Ensure "Email notifications" is enabled
   - Ensure "Booking confirmations" is checked

## 🔧 Troubleshooting

### Issue: "Email not being sent"

**Solutions:**
1. Check Supabase email settings are enabled
2. Verify Site URL is set correctly
3. Check spam/junk folder
4. Verify email address is correct
5. Check Supabase logs for errors

### Issue: "Email confirmation not working"

**Solutions:**
1. Check redirect URLs are configured
2. Verify email template has correct confirmation link
3. Check if email confirmation is enabled in Supabase
4. Verify Site URL matches your app URL

### Issue: "Notifications not sending"

**Solutions:**
1. Check `VITE_EMAIL_API_KEY` is set in `.env`
2. Verify email service API key is valid
3. Check user's email address is verified
4. Check notification preferences are enabled
5. Check browser console for errors

### Issue: "User email not showing"

**Solutions:**
1. Check user is authenticated
2. Verify `user.email` exists in auth context
3. Check Supabase auth is working
4. Verify user signed up with email

## 📋 Checklist

- [ ] Email provider enabled in Supabase
- [ ] Email confirmations configured (ON for production, OFF for dev)
- [ ] Site URL set correctly
- [ ] Redirect URLs added
- [ ] Email templates customized (optional)
- [ ] SMTP configured (optional - for custom email)
- [ ] Email notification service configured (Resend/SendGrid)
- [ ] `VITE_EMAIL_API_KEY` added to `.env`
- [ ] Test registration with email
- [ ] Test email confirmation
- [ ] Test email notifications

## 🎯 Quick Setup (Development)

For quick development setup:

1. **Disable Email Confirmation:**
   - Supabase Dashboard → Authentication → Providers → Email
   - Toggle **Enable email confirmations** to **OFF**
   - Users can sign in immediately after registration

2. **Use Supabase Default Email:**
   - No SMTP configuration needed
   - Supabase sends emails automatically
   - Limited to development/testing

3. **Test Email Notifications:**
   - Add `VITE_EMAIL_API_KEY` to `.env` (optional)
   - Create a booking
   - Check email for confirmation

## 🚀 Production Setup

For production:

1. **Enable Email Confirmation:**
   - Toggle **Enable email confirmations** to **ON**
   - Users must verify email before signing in

2. **Configure Custom SMTP:**
   - Set up professional email service
   - Configure SMTP in Supabase
   - Use branded email address

3. **Set Production URLs:**
   - Update Site URL to production domain
   - Add production redirect URLs
   - Test email flows

4. **Configure Email Service:**
   - Set up Resend/SendGrid account
   - Add API key to production environment
   - Test email delivery

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Resend Documentation](https://resend.com/docs)
- [SendGrid Documentation](https://docs.sendgrid.com)

---

**Your email system is now configured!** ✅

Users can:
- ✅ Register with email
- ✅ Verify their email address
- ✅ Receive booking confirmations via email
- ✅ Get email reminders and updates




