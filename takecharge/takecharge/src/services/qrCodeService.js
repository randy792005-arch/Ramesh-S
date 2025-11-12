import QRCode from 'qrcode';

/**
 * QR Code Service - Handles QR code generation and management
 */

/**
 * Generate QR code as data URL (for displaying in <img> tags)
 * @param {string} data - Data to encode in QR code
 * @param {Object} options - QR code options
 * @returns {Promise<string>} Data URL of the QR code image
 */
export const generateQRCodeDataURL = async (data, options = {}) => {
  try {
    const defaultOptions = {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
      ...options,
    };

    const dataURL = await QRCode.toDataURL(data, defaultOptions);
    return dataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

/**
 * Generate QR code as SVG string
 * @param {string} data - Data to encode in QR code
 * @param {Object} options - QR code options
 * @returns {Promise<string>} SVG string
 */
export const generateQRCodeSVG = async (data, options = {}) => {
  try {
    const defaultOptions = {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
      ...options,
    };

    const svg = await QRCode.toString(data, { type: 'svg', ...defaultOptions });
    return svg;
  } catch (error) {
    console.error('Error generating QR code SVG:', error);
    throw error;
  }
};

/**
 * Generate QR code as canvas element
 * @param {string} data - Data to encode in QR code
 * @param {HTMLCanvasElement} canvas - Canvas element to draw on
 * @param {Object} options - QR code options
 * @returns {Promise<void>}
 */
export const generateQRCodeCanvas = async (data, canvas, options = {}) => {
  try {
    const defaultOptions = {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
      ...options,
    };

    await QRCode.toCanvas(canvas, data, defaultOptions);
  } catch (error) {
    console.error('Error generating QR code canvas:', error);
    throw error;
  }
};

/**
 * Generate QR code for a booking
 * @param {Object} bookingData - Booking information
 * @returns {Promise<string>} Data URL of the QR code
 */
export const generateBookingQRCode = async (bookingData) => {
  try {
    // Create QR code data structure
    const qrData = {
      bookingId: bookingData.bookingId || bookingData.booking_id,
      userId: bookingData.userId || bookingData.user_id,
      stationId: bookingData.stationId || bookingData.station_id,
      timestamp: new Date().toISOString(),
      type: 'booking',
    };

    // Convert to JSON string
    const qrDataString = JSON.stringify(qrData);

    // Generate QR code
    const qrCodeDataURL = await generateQRCodeDataURL(qrDataString, {
      width: 300,
      margin: 3,
      errorCorrectionLevel: 'H', // High error correction for reliability
    });

    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating booking QR code:', error);
    throw error;
  }
};

/**
 * Generate QR code with booking ID only (simpler format)
 * @param {string} bookingId - Booking ID
 * @returns {Promise<string>} Data URL of the QR code
 */
export const generateBookingIdQRCode = async (bookingId) => {
  try {
    const qrCodeDataURL = await generateQRCodeDataURL(bookingId, {
      width: 300,
      margin: 3,
      errorCorrectionLevel: 'H',
    });

    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating booking ID QR code:', error);
    throw error;
  }
};

/**
 * Download QR code as image file
 * @param {string} dataURL - QR code data URL
 * @param {string} filename - Filename for download
 */
export const downloadQRCode = (dataURL, filename = 'qrcode.png') => {
  try {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading QR code:', error);
    throw error;
  }
};

/**
 * Share QR code using Web Share API
 * @param {string} dataURL - QR code data URL
 * @param {string} bookingId - Booking ID for share text
 */
export const shareQRCode = async (dataURL, bookingId) => {
  try {
    if (navigator.share) {
      // Convert data URL to blob for sharing
      const response = await fetch(dataURL);
      const blob = await response.blob();
      const file = new File([blob], `booking-${bookingId}.png`, { type: 'image/png' });

      await navigator.share({
        title: `Booking QR Code - ${bookingId}`,
        text: `QR Code for booking ${bookingId}`,
        files: [file],
      });
    } else {
      // Fallback: copy to clipboard or download
      downloadQRCode(dataURL, `booking-${bookingId}.png`);
    }
  } catch (error) {
    console.error('Error sharing QR code:', error);
    // Fallback to download
    downloadQRCode(dataURL, `booking-${bookingId}.png`);
  }
};









