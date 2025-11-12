# Troubleshooting: Booking Not Saving to Database

## ✅ What Was Fixed

The booking confirmation page now saves bookings to the Supabase database when payment is submitted.

## 🔍 Check These Things

### 1. Database Tables Created?

**Check if tables exist:**
- Go to Supabase Dashboard → **Table Editor**
- You should see `bookings` and `transactions` tables
- If tables don't exist, run the SQL schema:
  1. Go to **SQL Editor**
  2. Open `database/schema.sql` from your project
  3. Copy and paste the entire SQL into the editor
  4. Click **Run**

### 2. Environment Variables Set?

**Check your `.env` file:**
- Location: `takecharge/takecharge/.env`
- Should contain:
  ```env
  VITE_SUPABASE_URL=https://xebzbdbvijjgtchefdva.supabase.co
  VITE_SUPABASE_ANON_KEY=sb_publishable_kVvkCTvNcmvgFmCHEBHELw_Xxxcrk-D
  ```

**After updating `.env`:**
- Restart your development server (`npm start`)

### 3. Check Browser Console

**Open browser console (F12) and look for:**
- ❌ "Missing Supabase environment variables" → `.env` file not set up
- ❌ "Error creating booking: ..." → Check the error message
- ❌ Network errors → Check Supabase URL and key

### 4. Test Database Connection

**In browser console, test the connection:**
```javascript
// Test if Supabase is connected
import { supabase } from './src/lib/supabase';

// Try to query bookings table
const { data, error } = await supabase
  .from('bookings')
  .select('*')
  .limit(1);

if (error) {
  console.error('Database connection error:', error);
} else {
  console.log('✅ Database connected!', data);
}
```

### 5. Check Row Level Security (RLS)

**If you get "permission denied" errors:**
- Go to Supabase Dashboard → **Table Editor** → `bookings` table
- Click **Settings** → **Row Level Security**
- Make sure RLS policies are enabled (they should be from the schema)

**For testing, you can temporarily disable RLS:**
1. Go to **Authentication** → **Policies**
2. Or run in SQL Editor:
   ```sql
   ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
   ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
   ```
   ⚠️ **Only for testing!** Re-enable RLS for production.

### 6. Check User ID

**Current implementation uses:**
- Authenticated user ID (if logged in)
- Temporary user ID if not authenticated: `temp-user-{timestamp}`

**To use real user authentication:**
- Set up Supabase Auth
- Get user ID from: `supabase.auth.getUser()`

## 🧪 Test Booking Creation

**Test in browser console:**
```javascript
import { createBooking } from './src/services/bookingService';

const testBooking = {
  userId: 'test-user-123',
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

const { data, error } = await createBooking(testBooking);
if (error) {
  console.error('❌ Error:', error);
} else {
  console.log('✅ Booking created!', data);
}
```

## 📊 Verify Data Saved

**Check in Supabase Dashboard:**
1. Go to **Table Editor** → `bookings` table
2. You should see your booking records
3. Check `transactions` table for payment records

## 🐛 Common Errors

### Error: "relation 'bookings' does not exist"
**Solution:** Tables not created. Run the SQL schema.

### Error: "permission denied for table bookings"
**Solution:** RLS policies blocking access. Check RLS settings or temporarily disable for testing.

### Error: "Missing Supabase environment variables"
**Solution:** `.env` file missing or incorrect. Check file exists and has correct values.

### Error: "Invalid API key"
**Solution:** Wrong API key in `.env`. Use the **Publishable key** (starts with `sb_publishable_`).

## ✅ Success Checklist

- [ ] Database tables created (`bookings` and `transactions`)
- [ ] `.env` file exists with correct values
- [ ] Development server restarted after `.env` changes
- [ ] No errors in browser console
- [ ] Can see bookings in Supabase Table Editor
- [ ] Booking ID is generated correctly
- [ ] Transaction record is created

## 🆘 Still Not Working?

1. **Check browser console** for specific error messages
2. **Check Supabase logs** in Dashboard → **Logs**
3. **Verify network tab** in browser DevTools for API calls
4. **Test with a simple query** in SQL Editor:
   ```sql
   SELECT * FROM bookings LIMIT 1;
   ```









