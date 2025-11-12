# How to View Booking Details in Database

## 📍 Where Booking Data is Stored

All booking information is stored in the **`bookings`** table in your Supabase database.

## 🔍 Viewing Bookings in Supabase Dashboard

### Method 1: Table Editor (Visual Interface)

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Click on **"Table Editor"** in the left sidebar
3. Click on the **`bookings`** table
4. You'll see all booking records in a table format
5. Click on any row to view/edit details

### Method 2: SQL Editor (Query Data)

1. Click on **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Run queries like:

```sql
-- View all bookings
SELECT * FROM bookings
ORDER BY created_at DESC;

-- View bookings by status
SELECT * FROM bookings
WHERE status = 'completed'
ORDER BY created_at DESC;

-- View bookings for a specific user
SELECT * FROM bookings
WHERE user_id = 'your-user-id-here'
ORDER BY created_at DESC;

-- View upcoming bookings
SELECT * FROM bookings
WHERE status IN ('pending', 'confirmed', 'active')
AND scheduled_date >= CURRENT_DATE
ORDER BY scheduled_date ASC;
```

## 💻 Viewing Bookings in Your Application Code

### Using the Booking Service

```javascript
import { 
  getUserBookings, 
  getBookingById,
  getBookingsByStatus 
} from './services/bookingService';

// Get all bookings for a user
const { data: bookings, error } = await getUserBookings('user-id-here');
if (error) {
  console.error('Error:', error);
} else {
  console.log('Bookings:', bookings);
}

// Get a specific booking
const { data: booking, error } = await getBookingById('booking-uuid-here');

// Get bookings by status
const { data: completedBookings } = await getBookingsByStatus('user-id', 'completed');
```

## 📊 Booking Data Structure

Each booking record contains:

### Basic Information
- `id` - Unique UUID
- `booking_id` - Human-readable ID (e.g., "TC-2024-001")
- `user_id` - User who made the booking
- `status` - pending, confirmed, active, completed, cancelled

### Station Information
- `station_id` - Station identifier
- `station_name` - Name of the charging station
- `station_address` - Full address
- `station_image` - Image URL
- `latitude` / `longitude` - Location coordinates

### Charging Details
- `slot_id` - Charging slot identifier
- `connector_type` - Type of connector (CCS, CHAdeMO, etc.)
- `charging_speed` - Power rating (e.g., "150 kW")

### Schedule
- `scheduled_date` - Date of booking
- `start_time` - Start time
- `end_time` - End time
- `duration_minutes` - Duration in minutes
- `actual_duration_minutes` - Actual duration (after completion)

### Pricing
- `rate_per_kwh` - Rate per kWh
- `charging_cost` - Base charging cost
- `platform_fee` - Platform service fee
- `taxes` - Tax amount
- `total_cost` - Total amount
- `actual_total_cost` - Actual cost (after completion)

### Payment
- `payment_method` - Payment method used
- `qr_code` - QR code for booking verification

### Timestamps
- `created_at` - When booking was created
- `updated_at` - Last update time
- `completed_at` - When booking was completed
- `cancelled_at` - When booking was cancelled

## 🔐 Security Note

Row Level Security (RLS) is enabled, so:
- Users can only see their own bookings
- Users can only modify their own bookings
- This is enforced automatically by Supabase

## 📝 Example: Viewing Bookings in React Component

```javascript
import React, { useEffect, useState } from 'react';
import { getUserBookings } from '../services/bookingService';

const BookingList = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await getUserBookings(userId);
      if (error) {
        console.error('Error fetching bookings:', error);
      } else {
        setBookings(data || []);
      }
      setLoading(false);
    };

    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>My Bookings</h2>
      {bookings.map(booking => (
        <div key={booking.id}>
          <h3>{booking.booking_id}</h3>
          <p>Station: {booking.station_name}</p>
          <p>Date: {booking.scheduled_date}</p>
          <p>Status: {booking.status}</p>
          <p>Total: ${booking.total_cost}</p>
        </div>
      ))}
    </div>
  );
};
```

## 🎯 Quick Reference

| Location | How to Access |
|----------|---------------|
| **Supabase Dashboard** | Table Editor → `bookings` table |
| **SQL Editor** | Run `SELECT * FROM bookings` |
| **Your Code** | Use `getUserBookings()` or `getBookingById()` |
| **Service File** | `src/services/bookingService.js` |









