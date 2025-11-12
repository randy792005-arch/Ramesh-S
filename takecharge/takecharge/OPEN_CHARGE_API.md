# Open Charge Map API Integration Guide

This guide explains how the Open Charge Map API is integrated into the TakeCharge application.

## 📋 Overview

The Open Charge Map API provides real-time data about electric vehicle charging stations worldwide. This integration allows TakeCharge to display actual charging stations instead of mock data.

## 🔑 Getting an API Key

1. Visit [Open Charge Map](https://openchargemap.org/site/register)
2. Create a free account
3. Navigate to the [API page](https://openchargemap.org/site/develop/api)
4. Generate your API key
5. Copy the API key

## ⚙️ Configuration

1. Open your `.env` file in the project root (`takecharge/takecharge/.env`)
2. Add your API key:
   ```env
   VITE_OPEN_CHARGE_API_KEY=your-api-key-here
   ```
3. Save the file
4. Restart your development server if it's running

## 📡 API Service

The Open Charge API service is located at `src/services/openChargeService.js` and provides the following functions:

### `getStationsNearLocation(latitude, longitude, distance, maxResults, options)`

Fetches charging stations near a specific location.

**Parameters:**
- `latitude` (number): Latitude of the location
- `longitude` (number): Longitude of the location
- `distance` (number): Search radius in kilometers (default: 10)
- `maxResults` (number): Maximum number of results (default: 50)
- `options` (object): Additional API parameters (countrycode, operatorid, etc.)

**Returns:**
```javascript
{
  data: [/* array of station objects */],
  error: null
}
```

**Example:**
```javascript
import { getStationsNearLocation } from './services/openChargeService';

const { data, error } = await getStationsNearLocation(
  13.0827,  // Chennai, India
  80.2707,
  20,       // 20km radius
  50        // max 50 results
);
```

### `getStationsByBoundingBox(north, south, east, west, maxResults, options)`

Fetches stations within a geographic bounding box.

**Parameters:**
- `north` (number): Northern latitude boundary
- `south` (number): Southern latitude boundary
- `east` (number): Eastern longitude boundary
- `west` (number): Western longitude boundary
- `maxResults` (number): Maximum number of results
- `options` (object): Additional API parameters

### `getStationsByCountry(countryCode, maxResults, options)`

Fetches stations by ISO country code.

**Parameters:**
- `countryCode` (string): ISO country code (e.g., 'US', 'GB', 'IN')
- `maxResults` (number): Maximum number of results
- `options` (object): Additional API parameters

### `getStationById(stationId)`

Fetches a single station by its Open Charge Map ID.

**Parameters:**
- `stationId` (number): Open Charge Map station ID

### `getReferenceData(type)`

Fetches reference data like connection types, operators, etc.

**Parameters:**
- `type` (string): Type of reference data ('connectiontype', 'operator', 'statustype', etc.)

## 🔄 Data Transformation

The service automatically transforms Open Charge Map API responses to match TakeCharge's station data structure:

**Open Charge Map Format → TakeCharge Format:**
- `AddressInfo.Latitude/Longitude` → `lat/lng`
- `AddressInfo.Title` → `name`
- `Connections` → `connectors` (array of connector types)
- `Connections[].PowerKW` → `maxPower` (maximum power)
- `Connections.length` → `totalSlots`
- Calculated distance from user location → `distance`
- Estimated pricing → `pricePerKwh`
- Extracted amenities from comments → `amenities`

## 🎯 Integration Points

### Main Dashboard

The main dashboard (`src/pages/main-dashboard/index.jsx`) automatically:
1. Gets the user's location (or uses a default location)
2. Fetches nearby charging stations from Open Charge Map API
3. Displays stations on the map and in the station list
4. Falls back to mock data if the API is unavailable or not configured

### Features

- **Automatic Location Detection**: Uses browser geolocation API
- **Real-time Data**: Fetches actual charging stations from Open Charge Map
- **Error Handling**: Gracefully falls back to mock data if API fails
- **Loading States**: Shows loading indicators while fetching data
- **Distance Calculation**: Calculates distance from user location to each station

## 🚨 Error Handling

The service handles errors gracefully:

1. **Missing API Key**: Falls back to mock data with a warning
2. **API Errors**: Displays error message and uses mock data
3. **No Results**: Uses mock data as fallback
4. **Network Errors**: Catches and displays appropriate error messages

## 📝 Usage Notes

- The API key is optional - the app will work with mock data if not configured
- API calls include a custom User-Agent header for identification
- The service respects Open Charge Map's fair usage policy
- Station availability is estimated (Open Charge Map doesn't provide real-time availability)

## 🔗 Resources

- [Open Charge Map Website](https://openchargemap.org/)
- [API Documentation](https://openchargemap.org/site/develop/api)
- [API Registration](https://openchargemap.org/site/register)
- [Fair Usage Policy](https://openchargemap.org/site/develop/api)

## 🐛 Troubleshooting

**Problem**: No stations are showing up
- **Solution**: Check that your API key is correctly set in `.env` file
- **Solution**: Verify your API key is valid by testing it directly
- **Solution**: Check browser console for error messages

**Problem**: API calls are failing
- **Solution**: Verify your internet connection
- **Solution**: Check if Open Charge Map API is accessible
- **Solution**: Review API rate limits and fair usage policy

**Problem**: Stations don't match expected format
- **Solution**: The service automatically transforms data, but some fields may be estimated
- **Solution**: Check the `_raw` property on station objects for original API data




