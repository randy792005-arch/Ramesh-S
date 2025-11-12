import { supabase } from '../lib/supabase';

/**
 * Booking Service - Handles all booking-related database operations
 */

/**
 * Create a new booking
 * @param {Object} bookingData - Booking information
 * @returns {Promise<Object>} Created booking
 */
export const createBooking = async (bookingData) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          user_id: bookingData.userId,
          station_id: bookingData.stationId,
          station_name: bookingData.stationName,
          station_address: bookingData.stationAddress,
          station_image: bookingData.stationImage,
          slot_id: bookingData.slotId,
          connector_type: bookingData.connectorType,
          charging_speed: bookingData.chargingSpeed,
          scheduled_date: bookingData.scheduledDate,
          start_time: bookingData.startTime,
          end_time: bookingData.endTime,
          duration_minutes: bookingData.durationMinutes,
          rate_per_kwh: bookingData.ratePerKwh,
          charging_cost: bookingData.chargingCost,
          platform_fee: bookingData.platformFee,
          taxes: bookingData.taxes,
          total_cost: bookingData.totalCost,
          payment_method: bookingData.paymentMethod,
          status: bookingData.status || 'pending',
          qr_code: bookingData.qrCode,
          latitude: bookingData.latitude,
          longitude: bookingData.longitude,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { data: null, error };
  }
};

/**
 * Get all bookings for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of bookings
 */
export const getUserBookings = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return { data: null, error };
  }
};

/**
 * Get a single booking by ID
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Object>} Booking details
 */
export const getBookingById = async (bookingId) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching booking:', error);
    return { data: null, error };
  }
};

/**
 * Update booking status
 * @param {string} bookingId - Booking ID
 * @param {string} status - New status (pending, confirmed, active, completed, cancelled)
 * @returns {Promise<Object>} Updated booking
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating booking status:', error);
    return { data: null, error };
  }
};

/**
 * Update booking details
 * @param {string} bookingId - Booking ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated booking
 */
export const updateBooking = async (bookingId, updates) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating booking:', error);
    return { data: null, error };
  }
};

/**
 * Cancel a booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Object>} Updated booking
 */
export const cancelBooking = async (bookingId) => {
  return updateBookingStatus(bookingId, 'cancelled');
};

/**
 * Get bookings by status
 * @param {string} userId - User ID
 * @param {string} status - Booking status
 * @returns {Promise<Array>} List of bookings
 */
export const getBookingsByStatus = async (userId, status) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching bookings by status:', error);
    return { data: null, error };
  }
};

/**
 * Complete a booking (mark as completed with actual charging data)
 * @param {string} bookingId - Booking ID
 * @param {Object} completionData - Actual charging data
 * @returns {Promise<Object>} Updated booking
 */
export const completeBooking = async (bookingId, completionData) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        status: 'completed',
        actual_duration_minutes: completionData.actualDurationMinutes,
        energy_delivered_kwh: completionData.energyDeliveredKwh,
        actual_total_cost: completionData.actualTotalCost,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error completing booking:', error);
    return { data: null, error };
  }
};









