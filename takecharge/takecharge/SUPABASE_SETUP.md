# Supabase Setup Guide for TakeCharge

This guide will walk you through setting up Supabase as your backend database for the TakeCharge application.

## 📋 Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com) - it's free!)
- Node.js and npm installed
- Basic knowledge of SQL (optional, but helpful)

## 🚀 Step-by-Step Setup

### Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in the project details:
   - **Name**: `takecharge` (or any name you prefer)
   - **Database Password**: Create a strong password (save it securely!)
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Select **Free** (perfect for development)
4. Click **"Create new project"**
5. Wait 2-3 minutes for your project to be provisioned

### Step 2: Get Your API Keys

1. In your Supabase project dashboard, click on **Settings** (gear icon) in the left sidebar
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (a long JWT token)
4. Copy both values - you'll need them in the next step

### Step 3: Configure Environment Variables

1. In your project root (`takecharge/takecharge/`), create a `.env` file:
   ```bash
   cd takecharge/takecharge
   ```

2. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Open the `.env` file and replace the placeholder values:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. Save the file

### Step 4: Install Dependencies

1. Navigate to your project directory:
   ```bash
   cd takecharge/takecharge
   ```

2. Install the Supabase client:
   ```bash
   npm install
   ```

   This will install `@supabase/supabase-js` along with other dependencies.

### Step 5: Create Database Tables

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click **"New query"**
3. Open the file `database/schema.sql` from this project
4. Copy the entire contents of `schema.sql`
5. Paste it into the Supabase SQL Editor
6. Click **"Run"** (or press `Ctrl+Enter`)
7. You should see a success message: "Success. No rows returned"

### Step 6: Verify Tables Were Created

1. In Supabase dashboard, click on **Table Editor** in the left sidebar
2. You should see two tables:
   - `bookings`
   - `transactions`
3. Click on each table to view their structure

### Step 7: Test the Connection

1. Start your development server:
   ```bash
   npm start
   ```

2. Open your browser console (F12)
3. You should not see any Supabase connection errors

## 📊 Database Schema Overview

### Bookings Table
Stores all booking information including:
- Station details (name, address, location)
- Charging details (connector type, speed, slot)
- Schedule (date, time, duration)
- Pricing (rate, costs, fees, taxes)
- Status (pending, confirmed, active, completed, cancelled)
- QR code for booking verification

### Transactions Table
Stores all payment transactions including:
- Payment details (amount, method, provider)
- Transaction type (payment, refund, adjustment)
- Status (pending, completed, failed, refunded)
- Links to bookings

## 🔒 Security (Row Level Security)

The database uses Row Level Security (RLS) policies to ensure:
- Users can only see their own bookings
- Users can only see their own transactions
- Users can only modify their own data

## 🧪 Testing the Backend

### Test Creating a Booking

You can test the booking service in your browser console:

```javascript
import { createBooking } from './src/services/bookingService';

const testBooking = {
  userId: 'test-user-id', // Replace with actual user ID
  stationId: 'ST-001',
  stationName: 'Test Station',
  stationAddress: '123 Test St',
  scheduledDate: '2024-12-01',
  startTime: '2024-12-01T14:00:00Z',
  endTime: '2024-12-01T15:30:00Z',
  durationMinutes: 90,
  ratePerKwh: 0.35,
  chargingCost: 18.50,
  platformFee: 2.50,
  taxes: 1.68,
  totalCost: 22.68,
  paymentMethod: 'Credit Card',
  connectorType: 'CCS Type 1',
  chargingSpeed: '150 kW',
  status: 'confirmed'
};

const result = await createBooking(testBooking);
console.log(result);
```

### Test Creating a Transaction

```javascript
import { createTransaction } from './src/services/transactionService';

const testTransaction = {
  userId: 'test-user-id',
  bookingId: 'booking-uuid-here',
  transactionType: 'payment',
  amount: 22.68,
  currency: 'USD',
  paymentMethod: 'Credit Card',
  paymentProvider: 'stripe',
  status: 'completed',
  description: 'Payment for booking TC-2024-001'
};

const result = await createTransaction(testTransaction);
console.log(result);
```

## 🔧 Troubleshooting

### Issue: "Missing Supabase environment variables"
**Solution**: Make sure your `.env` file exists and contains the correct values.

### Issue: "Invalid API key"
**Solution**: Double-check that you copied the correct `anon` key from Supabase settings.

### Issue: "Table doesn't exist"
**Solution**: Make sure you ran the SQL schema in the Supabase SQL Editor.

### Issue: "Permission denied"
**Solution**: Check that Row Level Security policies are enabled and correct.

## 📚 Next Steps

1. **Set up Authentication**: Configure Supabase Auth for user login/signup
2. **Integrate with Frontend**: Update your React components to use the booking and transaction services
3. **Add Real-time Features**: Use Supabase Realtime to show live booking updates
4. **Set up Storage**: Use Supabase Storage for station images and user avatars

## 🆘 Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [Supabase GitHub](https://github.com/supabase/supabase)

## ✅ Checklist

- [ ] Created Supabase project
- [ ] Copied API keys to `.env` file
- [ ] Installed dependencies (`npm install`)
- [ ] Created database tables (ran `schema.sql`)
- [ ] Verified tables in Table Editor
- [ ] Tested connection (no errors in console)
- [ ] Ready to integrate with frontend!

---

**Congratulations!** 🎉 Your Supabase backend is now set up and ready to use!









