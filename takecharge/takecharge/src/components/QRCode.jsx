import React, { useState, useEffect } from 'react';
import { generateBookingQRCode, generateBookingIdQRCode } from '../services/qrCodeService';

/**
 * QR Code Component - Displays a QR code for bookings
 * @param {Object} props
 * @param {Object} props.booking - Booking data (optional)
 * @param {string} props.bookingId - Booking ID (if no booking object)
 * @param {string} props.qrCode - Pre-generated QR code data URL (optional)
 * @param {number} props.size - Size of QR code in pixels (default: 200)
 * @param {string} props.className - Additional CSS classes
 */
const QRCode = ({ booking, bookingId, qrCode: providedQrCode, size = 200, className = '' }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState(providedQrCode || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generateQR = async () => {
      // If QR code is already provided, use it
      if (providedQrCode) {
        setQrCodeUrl(providedQrCode);
        return;
      }

      // If booking has QR code in database, use it
      if (booking?.qr_code || booking?.qrCode) {
        setQrCodeUrl(booking.qr_code || booking.qrCode);
        return;
      }

      // Otherwise, generate new QR code
      setIsGenerating(true);
      setError(null);
      
      try {
        let qrCode;
        
        if (booking) {
          // Generate QR code with full booking data
          qrCode = await generateBookingQRCode({
            bookingId: booking.bookingId || booking.booking_id,
            userId: booking.userId || booking.user_id,
            stationId: booking.stationId || booking.station_id,
            booking_id: booking.id,
            user_id: booking.user_id,
            station_id: booking.station_id,
          });
        } else if (bookingId) {
          // Generate simple QR code with just booking ID
          qrCode = await generateBookingIdQRCode(bookingId);
        } else {
          throw new Error('No booking data or booking ID provided');
        }
        
        setQrCodeUrl(qrCode);
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError(err.message);
      } finally {
        setIsGenerating(false);
      }
    };

    generateQR();
  }, [booking, bookingId, providedQrCode]);

  if (isGenerating) {
    return (
      <div 
        className={`flex items-center justify-center bg-white rounded-lg ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted rounded-lg text-muted-foreground text-sm ${className}`}
        style={{ width: size, height: size }}
      >
        <p>Failed to load QR code</p>
      </div>
    );
  }

  if (!qrCodeUrl) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted rounded-lg text-muted-foreground text-sm ${className}`}
        style={{ width: size, height: size }}
      >
        <p>No QR code available</p>
      </div>
    );
  }

  return (
    <div className={`bg-white p-2 rounded-lg inline-block ${className}`}>
      <img
        src={qrCodeUrl}
        alt="QR Code"
        className="mx-auto"
        style={{ width: size, height: size }}
        onError={(e) => {
          console.error('Error loading QR code image');
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
};

export default QRCode;









