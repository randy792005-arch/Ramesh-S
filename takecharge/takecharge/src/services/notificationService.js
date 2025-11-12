import axios from 'axios';
import { supabase } from '../lib/supabase';

/**
 * Notification Service
 * Handles sending email notifications
 */

// Get API keys from environment variables
const EMAIL_API_KEY = import.meta.env.VITE_EMAIL_API_KEY;
const SMS_API_KEY = import.meta.env.VITE_SMS_API_KEY;
const SMS_SENDER_ID = import.meta.env.VITE_SMS_SENDER_ID || 'TAKECHG';

/**
 * Validate Indian phone number format
 * @param {string} phone - Phone number
 * @returns {boolean} True if valid Indian phone number
 */
export const validateIndianPhoneNumber = (phone) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Indian phone numbers: 10 digits, optionally prefixed with +91 or 91
  // Valid formats: +91XXXXXXXXXX, 91XXXXXXXXXX, 0XXXXXXXXXX, XXXXXXXXXX
  const patterns = [
    /^\+91[6-9]\d{9}$/,  // +91 followed by 10 digits starting with 6-9
    /^91[6-9]\d{9}$/,    // 91 followed by 10 digits starting with 6-9
    /^0[6-9]\d{9}$/,     // 0 followed by 10 digits starting with 6-9
    /^[6-9]\d{9}$/       // 10 digits starting with 6-9
  ];
  
  return patterns.some(pattern => pattern.test(cleaned));
};

/**
 * Format Indian phone number to international format
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number (+91XXXXXXXXXX)
 */
export const formatIndianPhoneNumber = (phone) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Remove leading 0 or 91 if present
  let number = cleaned;
  if (number.startsWith('91') && number.length === 12) {
    number = number.substring(2);
  } else if (number.startsWith('0') && number.length === 11) {
    number = number.substring(1);
  }
  
  // Ensure it's 10 digits starting with 6-9
  if (number.length === 10 && /^[6-9]/.test(number)) {
    return `+91${number}`;
  }
  
  return phone; // Return original if can't format
};

/**
 * Get user notification preferences
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Notification preferences
 */
export const getUserNotificationPreferences = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      throw error;
    }

    // Return default preferences if not found
    return {
      data: data || {
        email_enabled: true,
        email_confirmation: true,
        email_reminders: true,
        email_updates: true,
        email_promotions: false
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return { data: null, error };
  }
};

/**
 * Save user notification preferences
 * @param {string} userId - User ID
 * @param {Object} preferences - Notification preferences
 * @returns {Promise<Object>} Saved preferences
 */
export const saveUserNotificationPreferences = async (userId, preferences) => {
  try {
    const { data, error } = await supabase
      .from('user_notification_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving notification preferences:', error);
    return { data: null, error };
  }
};

/**
 * Send email notification
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 * @returns {Promise<Object>} { success: boolean, error: null | Error }
 */
export const sendEmailNotification = async ({ to, subject, html, text }) => {
  try {
    // Option 1: Use Supabase Edge Function (recommended)
    if (import.meta.env.VITE_SUPABASE_URL) {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to,
          subject,
          html,
          text
        }
      });

      if (error) throw error;
      return { success: true, error: null };
    }

    // Option 2: Use email service API (e.g., Resend, SendGrid, etc.)
    if (EMAIL_API_KEY) {
      // Example with Resend API
      const response = await axios.post(
        'https://api.resend.com/emails',
        {
          from: 'TakeCharge <noreply@takecharge.com>',
          to,
          subject,
          html,
          text
        },
        {
          headers: {
            'Authorization': `Bearer ${EMAIL_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return { success: true, error: null, data: response.data };
    }

    // Fallback: Log email (for development)
    console.log('Email notification (not sent - no API configured):', {
      to,
      subject,
      html: html.substring(0, 100) + '...'
    });

    return { success: true, error: null, note: 'Email logged (no API configured)' };
  } catch (error) {
    console.error('Error sending email notification:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
};

/**
 * Send SMS notification (Indian numbers)
 * @param {Object} options - SMS options
 * @param {string} options.to - Recipient phone number (Indian format)
 * @param {string} options.message - SMS message
 * @returns {Promise<Object>} { success: boolean, error: null | Error }
 */
export const sendSMSNotification = async ({ to, message }) => {
  try {
    // Validate and format Indian phone number
    if (!validateIndianPhoneNumber(to)) {
      return { success: false, error: 'Invalid Indian phone number format' };
    }

    const formattedPhone = formatIndianPhoneNumber(to);

    // Option 1: Use Supabase Edge Function (recommended)
    if (import.meta.env.VITE_SUPABASE_URL) {
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          to: formattedPhone,
          message
        }
      });

      if (error) throw error;
      return { success: true, error: null };
    }

    // Option 2: Use SMS service API (e.g., MSG91, TextLocal, Twilio for India)
    if (SMS_API_KEY) {
      // Example with MSG91 API (popular in India)
      const response = await axios.post(
        'https://api.msg91.com/api/v5/flow/',
        {
          template_id: 'YOUR_TEMPLATE_ID', // Get from MSG91 dashboard
          sender: SMS_SENDER_ID,
          short_url: '0', // Disable URL shortening
          mobiles: formattedPhone.replace('+', ''),
          message: message
        },
        {
          headers: {
            'authkey': SMS_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      return { success: true, error: null, data: response.data };
    }

    // Fallback: Log SMS (for development)
    console.log('SMS notification (not sent - no API configured):', {
      to: formattedPhone,
      message: message.substring(0, 50) + '...'
    });

    return { success: true, error: null, note: 'SMS logged (no API configured)' };
  } catch (error) {
    console.error('Error sending SMS notification:', error);
    return { success: false, error: error.message || 'Failed to send SMS' };
  }
};

/**
 * Send booking confirmation notification (Email only)
 * @param {Object} booking - Booking data
 * @param {Object} user - User data
 * @returns {Promise<Object>} Notification results
 */
export const sendBookingConfirmation = async (booking, user) => {
  const results = {
    email: { success: false, error: null }
  };

  // Get user notification preferences
  const { data: preferences } = await getUserNotificationPreferences(user.id);

  // Prepare email content
  const emailSubject = `Booking Confirmed - ${booking.stationName || 'Charging Station'}`;
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .detail-row:last-child { border-bottom: none; }
        .label { font-weight: bold; color: #666; }
        .value { color: #333; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚡ Booking Confirmed!</h1>
          <p>Your EV charging session has been booked successfully</p>
        </div>
        <div class="content">
          <div class="booking-details">
            <h2>Booking Details</h2>
            <div class="detail-row">
              <span class="label">Booking ID:</span>
              <span class="value">${booking.bookingId || booking.booking_id || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="label">Station:</span>
              <span class="value">${booking.stationName || booking.station_name || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="label">Address:</span>
              <span class="value">${booking.stationAddress || booking.station_address || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="label">Date:</span>
              <span class="value">${new Date(booking.scheduledDate || booking.scheduled_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="detail-row">
              <span class="label">Time:</span>
              <span class="value">${new Date(booking.startTime || booking.start_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} - ${new Date(booking.endTime || booking.end_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div class="detail-row">
              <span class="label">Duration:</span>
              <span class="value">${booking.durationMinutes || booking.duration_minutes || 0} minutes</span>
            </div>
            <div class="detail-row">
              <span class="label">Total Cost:</span>
              <span class="value">₹${(booking.totalCost || booking.total_cost || 0).toFixed(2)}</span>
            </div>
          </div>
          <a href="${window.location.origin}/booking-history" class="button">View Booking</a>
          <div class="footer">
            <p>Thank you for using TakeCharge!</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailText = `
    Booking Confirmed!
    
    Booking ID: ${booking.bookingId || booking.booking_id || 'N/A'}
    Station: ${booking.stationName || booking.station_name || 'N/A'}
    Address: ${booking.stationAddress || booking.station_address || 'N/A'}
    Date: ${new Date(booking.scheduledDate || booking.scheduled_date).toLocaleDateString('en-IN')}
    Time: ${new Date(booking.startTime || booking.start_time).toLocaleTimeString('en-IN')} - ${new Date(booking.endTime || booking.end_time).toLocaleTimeString('en-IN')}
    Duration: ${booking.durationMinutes || booking.duration_minutes || 0} minutes
    Total Cost: ₹${(booking.totalCost || booking.total_cost || 0).toFixed(2)}
    
    View your booking: ${window.location.origin}/booking-history
  `;

  // Send email if enabled
  if (preferences?.email_enabled && preferences?.email_confirmation && user.email) {
    results.email = await sendEmailNotification({
      to: user.email,
      subject: emailSubject,
      html: emailHtml,
      text: emailText
    });
  }

  return results;
};

/**
 * Send booking reminder notification (Email only)
 * @param {Object} booking - Booking data
 * @param {Object} user - User data
 * @param {string} reminderType - Type of reminder (24h, 2h, 30m, etc.)
 * @returns {Promise<Object>} Notification results
 */
export const sendBookingReminder = async (booking, user, reminderType = '2h') => {
  const results = {
    email: { success: false, error: null }
  };

  // Get user notification preferences
  const { data: preferences } = await getUserNotificationPreferences(user.id);

  const reminderText = {
    '24h': '24 hours',
    '12h': '12 hours',
    '2h': '2 hours',
    '30m': '30 minutes'
  }[reminderType] || reminderType;

  // Prepare email content
  const emailSubject = `Reminder: Your charging session starts in ${reminderText}`;
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .detail-row:last-child { border-bottom: none; }
        .label { font-weight: bold; color: #666; }
        .value { color: #333; }
        .button { display: inline-block; padding: 12px 30px; background: #f59e0b; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Reminder: Charging Session</h1>
          <p>Your booking starts in ${reminderText}</p>
        </div>
        <div class="content">
          <div class="booking-details">
            <h2>Booking Details</h2>
            <div class="detail-row">
              <span class="label">Station:</span>
              <span class="value">${booking.stationName || booking.station_name || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="label">Date & Time:</span>
              <span class="value">${new Date(booking.startTime || booking.start_time).toLocaleString('en-IN')}</span>
            </div>
            <div class="detail-row">
              <span class="label">Address:</span>
              <span class="value">${booking.stationAddress || booking.station_address || 'N/A'}</span>
            </div>
          </div>
          <a href="${window.location.origin}/booking-history" class="button">View Booking</a>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send email if enabled
  if (preferences?.email_enabled && preferences?.email_reminders && user.email) {
    results.email = await sendEmailNotification({
      to: user.email,
      subject: emailSubject,
      html: emailHtml
    });
  }

  return results;
};

