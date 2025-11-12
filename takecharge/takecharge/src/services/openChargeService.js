import axios from 'axios';

/**
 * Open Charge Map API Service
 * Documentation: https://openchargemap.org/site/develop/api
 */

const API_BASE_URL = 'https://api.openchargemap.io/v3';
const API_KEY = import.meta.env.VITE_OPEN_CHARGE_API_KEY;

/**
 * Get API key from environment variables
 * @returns {string|null} API key or null if not set
 */
const getApiKey = () => {
  // Silently return null if API key is not set (expected behavior)
  return API_KEY || null;
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Transform Open Charge Map API response to app station format
 * @param {Object} poi - Point of Interest from Open Charge Map API
 * @param {Object} userLocation - User's location { lat, lng }
 * @returns {Object} Transformed station object
 */
const transformStation = (poi, userLocation = null) => {
  const addressInfo = poi.AddressInfo || {};
  const connections = poi.Connections || [];
  
  // Extract connector types
  const connectors = connections.map(conn => {
    const connectionType = conn.ConnectionType || {};
    return connectionType.Title || connectionType.FormalName || 'Unknown';
  }).filter(Boolean);

  // Get max power from connections
  const maxPower = Math.max(...connections.map(conn => conn.PowerKW || 0), 0);

  // Calculate distance if user location is provided
  let distance = null;
  if (userLocation && addressInfo.Latitude && addressInfo.Longitude) {
    distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      addressInfo.Latitude,
      addressInfo.Longitude
    );
  }

  // Determine status based on usage type
  const usageType = poi.UsageType || {};
  const usageTypeId = usageType.ID || 0;
  let status = 'available';
  if (usageTypeId === 1 || usageTypeId === 2) {
    status = 'reserved'; // Private or restricted
  } else if (usageTypeId === 3) {
    status = 'occupied'; // Public but may be in use
  }

  // Estimate available slots (OCM doesn't provide real-time availability)
  // We'll use a random estimate based on the number of connections
  const totalSlots = connections.length || 1;
  const availableSlots = Math.floor(Math.random() * (totalSlots + 1));

  // Get operator info
  const operator = poi.OperatorInfo || {};
  const operatorName = operator.Title || 'Unknown Operator';

  // Build station name
  const stationName = addressInfo.Title || 
    `${operatorName} - ${addressInfo.AddressLine1 || 'Charging Station'}`;

  // Build full address
  const addressParts = [
    addressInfo.AddressLine1,
    addressInfo.AddressLine2,
    addressInfo.Town,
    addressInfo.StateOrProvince,
    addressInfo.Postcode,
    addressInfo.Country?.Title
  ].filter(Boolean);
  const fullAddress = addressParts.join(', ') || 'Address not available';

  // Get general comments
  const generalComments = poi.GeneralComments || '';

  // Estimate price (OCM doesn't always provide pricing)
  // Default to a reasonable estimate based on power level
  const pricePerKwh = maxPower > 50 ? 0.30 : 0.25;

  // Get rating if available
  const rating = poi.UserComments?.length > 0 
    ? poi.UserComments.reduce((sum, comment) => sum + (comment.Rating || 0), 0) / poi.UserComments.length
    : 4.0;

  // Extract amenities from general comments (basic keyword matching)
  const amenities = [];
  const commentLower = generalComments.toLowerCase();
  if (commentLower.includes('parking') || commentLower.includes('park')) amenities.push('parking');
  if (commentLower.includes('restroom') || commentLower.includes('toilet') || commentLower.includes('bathroom')) amenities.push('restroom');
  if (commentLower.includes('food') || commentLower.includes('restaurant') || commentLower.includes('cafe')) amenities.push('food');
  if (commentLower.includes('wifi') || commentLower.includes('wi-fi')) amenities.push('wifi');
  if (commentLower.includes('24') || commentLower.includes('24/7') || commentLower.includes('24 hour')) amenities.push('24hours');
  if (commentLower.includes('shop') || commentLower.includes('shopping')) amenities.push('shopping');

  return {
    id: poi.ID,
    name: stationName,
    address: fullAddress,
    image: poi.MediaItems?.[0]?.ItemURL || '/assets/images/ev_station.svg',
    lat: addressInfo.Latitude,
    lng: addressInfo.Longitude,
    distance: distance ? parseFloat(distance.toFixed(1)) : null,
    pricePerKwh: pricePerKwh,
    maxPower: maxPower || 50,
    totalSlots: totalSlots,
    availableSlots: availableSlots,
    status: status,
    connectors: connectors.length > 0 ? connectors : ['Type2'],
    rating: rating || 4.0,
    amenities: amenities.length > 0 ? amenities : ['parking'],
    operator: operatorName,
    operatorId: operator.ID,
    usageType: usageType.Title || 'Public',
    generalComments: generalComments,
    // Keep original POI data for reference
    _raw: poi
  };
};

/**
 * Fetch charging stations near a location
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @param {number} distance - Distance in kilometers (default: 10)
 * @param {number} maxResults - Maximum number of results (default: 50)
 * @param {Object} options - Additional options (countrycode, operatorid, etc.)
 * @returns {Promise<Object>} { data: stations array, error: null } or { data: null, error }
 */
export const getStationsNearLocation = async (
  latitude,
  longitude,
  distance = 10,
  maxResults = 50,
  options = {}
) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      // Return empty data gracefully when API key is not configured
      // This allows the app to use mock data without errors
      return { data: [], error: null };
    }

    const params = {
      output: 'json',
      key: apiKey,
      latitude: latitude,
      longitude: longitude,
      distance: distance,
      distanceunit: 'km',
      maxresults: maxResults,
      ...options
    };

    const response = await axios.get(`${API_BASE_URL}/poi/`, {
      params,
      headers: {
        'User-Agent': 'TakeCharge/1.0',
        'Accept': 'application/json'
      }
    });

    if (response.data && Array.isArray(response.data)) {
      const userLocation = { lat: latitude, lng: longitude };
      const stations = response.data.map(poi => transformStation(poi, userLocation));
      return { data: stations, error: null };
    }

    return { data: [], error: null };
  } catch (error) {
    console.error('Error fetching stations from Open Charge Map:', error);
    return { 
      data: null, 
      error: error.response?.data || error.message || 'Failed to fetch charging stations' 
    };
  }
};

/**
 * Fetch charging stations by bounding box
 * @param {number} north - North latitude
 * @param {number} south - South latitude
 * @param {number} east - East longitude
 * @param {number} west - West longitude
 * @param {number} maxResults - Maximum number of results (default: 50)
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} { data: stations array, error: null } or { data: null, error }
 */
export const getStationsByBoundingBox = async (
  north,
  south,
  east,
  west,
  maxResults = 50,
  options = {}
) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return { data: [], error: null };
    }

    const params = {
      output: 'json',
      key: apiKey,
      boundingbox: `(${south},${west}),(${north},${east})`,
      maxresults: maxResults,
      ...options
    };

    const response = await axios.get(`${API_BASE_URL}/poi/`, {
      params,
      headers: {
        'User-Agent': 'TakeCharge/1.0',
        'Accept': 'application/json'
      }
    });

    if (response.data && Array.isArray(response.data)) {
      const stations = response.data.map(poi => transformStation(poi));
      return { data: stations, error: null };
    }

    return { data: [], error: null };
  } catch (error) {
    console.error('Error fetching stations from Open Charge Map:', error);
    return { 
      data: null, 
      error: error.response?.data || error.message || 'Failed to fetch charging stations' 
    };
  }
};

/**
 * Fetch charging stations by country code
 * @param {string} countryCode - ISO country code (e.g., 'US', 'GB', 'IN')
 * @param {number} maxResults - Maximum number of results (default: 50)
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} { data: stations array, error: null } or { data: null, error }
 */
export const getStationsByCountry = async (
  countryCode,
  maxResults = 50,
  options = {}
) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return { data: [], error: null };
    }

    const params = {
      output: 'json',
      key: apiKey,
      countrycode: countryCode,
      maxresults: maxResults,
      ...options
    };

    const response = await axios.get(`${API_BASE_URL}/poi/`, {
      params,
      headers: {
        'User-Agent': 'TakeCharge/1.0',
        'Accept': 'application/json'
      }
    });

    if (response.data && Array.isArray(response.data)) {
      const stations = response.data.map(poi => transformStation(poi));
      return { data: stations, error: null };
    }

    return { data: [], error: null };
  } catch (error) {
    console.error('Error fetching stations from Open Charge Map:', error);
    return { 
      data: null, 
      error: error.response?.data || error.message || 'Failed to fetch charging stations' 
    };
  }
};

/**
 * Get a single station by ID
 * @param {number} stationId - Station ID
 * @returns {Promise<Object>} { data: station object, error: null } or { data: null, error }
 */
export const getStationById = async (stationId) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return { data: null, error: new Error('Open Charge Map API key not configured') };
    }

    const params = {
      output: 'json',
      key: apiKey,
      poiid: stationId
    };

    const response = await axios.get(`${API_BASE_URL}/poi/`, {
      params,
      headers: {
        'User-Agent': 'TakeCharge/1.0',
        'Accept': 'application/json'
      }
    });

    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      const station = transformStation(response.data[0]);
      return { data: station, error: null };
    }

    return { data: null, error: new Error('Station not found') };
  } catch (error) {
    console.error('Error fetching station from Open Charge Map:', error);
    return { 
      data: null, 
      error: error.response?.data || error.message || 'Failed to fetch station' 
    };
  }
};

/**
 * Get reference data (connection types, operators, etc.)
 * @param {string} type - Type of reference data ('connectiontype', 'operator', 'statustype', etc.)
 * @returns {Promise<Object>} { data: reference data, error: null } or { data: null, error }
 */
export const getReferenceData = async (type = 'connectiontype') => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return { data: null, error: new Error('Open Charge Map API key not configured') };
    }

    const params = {
      output: 'json',
      key: apiKey
    };

    const response = await axios.get(`${API_BASE_URL}/referencedata/`, {
      params: { ...params, ...{ [type]: true } },
      headers: {
        'User-Agent': 'TakeCharge/1.0',
        'Accept': 'application/json'
      }
    });

    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error fetching reference data from Open Charge Map:', error);
    return { 
      data: null, 
      error: error.response?.data || error.message || 'Failed to fetch reference data' 
    };
  }
};

