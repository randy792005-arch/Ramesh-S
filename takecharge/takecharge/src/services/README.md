# Services Documentation

This directory contains service files for interacting with the Supabase backend and external APIs.

## Services

### `bookingService.js`
Handles all booking-related database operations.

**Functions:**
- `createBooking(bookingData)` - Create a new booking
- `getUserBookings(userId)` - Get all bookings for a user
- `getBookingById(bookingId)` - Get a single booking by ID
- `updateBookingStatus(bookingId, status)` - Update booking status
- `updateBooking(bookingId, updates)` - Update booking details
- `cancelBooking(bookingId)` - Cancel a booking
- `getBookingsByStatus(userId, status)` - Get bookings by status
- `completeBooking(bookingId, completionData)` - Complete a booking with actual data

**Example Usage:**
```javascript
import { createBooking, getUserBookings } from './services/bookingService';

// Create a booking
const booking = await createBooking({
  userId: 'user-123',
  stationId: 'ST-001',
  stationName: 'Downtown Station',
  scheduledDate: '2024-12-01',
  startTime: '2024-12-01T14:00:00Z',
  endTime: '2024-12-01T15:30:00Z',
  durationMinutes: 90,
  totalCost: 22.68,
  // ... other fields
});

// Get user bookings
const { data, error } = await getUserBookings('user-123');
```

### `transactionService.js`
Handles all transaction-related database operations.

**Functions:**
- `createTransaction(transactionData)` - Create a new transaction
- `getUserTransactions(userId)` - Get all transactions for a user
- `getTransactionById(transactionId)` - Get a single transaction by ID
- `getTransactionsByBookingId(bookingId)` - Get transactions for a booking
- `updateTransactionStatus(transactionId, status)` - Update transaction status
- `getTransactionsByStatus(userId, status)` - Get transactions by status
- `getTransactionSummary(userId)` - Get transaction summary/stats

**Example Usage:**
```javascript
import { createTransaction, getUserTransactions } from './services/transactionService';

// Create a transaction
const transaction = await createTransaction({
  userId: 'user-123',
  bookingId: 'booking-uuid',
  transactionType: 'payment',
  amount: 22.68,
  paymentMethod: 'Credit Card',
  status: 'completed',
  // ... other fields
});

// Get user transactions
const { data, error } = await getUserTransactions('user-123');
```

### `openChargeService.js`
Handles all interactions with the Open Charge Map API for fetching real charging station data.

**Functions:**
- `getStationsNearLocation(latitude, longitude, distance, maxResults, options)` - Get stations near a location
- `getStationsByBoundingBox(north, south, east, west, maxResults, options)` - Get stations in a bounding box
- `getStationsByCountry(countryCode, maxResults, options)` - Get stations by country code
- `getStationById(stationId)` - Get a single station by ID
- `getReferenceData(type)` - Get reference data (connection types, operators, etc.)

**Example Usage:**
```javascript
import { getStationsNearLocation, getStationById } from './services/openChargeService';

// Get stations near user location
const { data, error } = await getStationsNearLocation(
  13.0827,  // latitude
  80.2707,  // longitude
  20,       // distance in km
  50        // max results
);

if (error) {
  console.error('Failed to fetch stations:', error);
} else {
  console.log('Found stations:', data);
}

// Get a specific station
const { data: station, error: stationError } = await getStationById(12345);
```

**Setup:**
1. Register for a free API key at [Open Charge Map](https://openchargemap.org/site/register)
2. Add your API key to `.env` file:
   ```
   VITE_OPEN_CHARGE_API_KEY=your-api-key-here
   ```
3. The service automatically transforms Open Charge Map data to match the app's station format

## Error Handling

All service functions return an object with `{ data, error }`:
- `data`: The result data (null if error)
- `error`: Error object (null if success)

Always check for errors:
```javascript
const { data, error } = await createBooking(bookingData);
if (error) {
  console.error('Failed to create booking:', error);
  // Handle error
} else {
  console.log('Booking created:', data);
  // Use data
}
```






