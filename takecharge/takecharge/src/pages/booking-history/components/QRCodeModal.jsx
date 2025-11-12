import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { generateBookingQRCode, downloadQRCode, shareQRCode } from '../../../services/qrCodeService';

const QRCodeModal = ({ booking, isOpen, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen && booking) {
      // Use QR code from database if available, otherwise generate new one
      if (booking.qr_code || booking.qrCode) {
        setQrCodeUrl(booking.qr_code || booking.qrCode);
      } else {
        generateQRCode();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, booking]);

  const generateQRCode = async () => {
    if (!booking) return;
    
    setIsGenerating(true);
    try {
      const qrCode = await generateBookingQRCode({
        bookingId: booking.bookingId || booking.booking_id,
        userId: booking.userId || booking.user_id,
        stationId: booking.stationId || booking.station_id,
        booking_id: booking.id,
        user_id: booking.user_id,
        station_id: booking.station_id,
      });
      setQrCodeUrl(qrCode);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen || !booking) return null;

  const formatDateTime = (date, time) => {
    const dateObj = new Date(date);
    const timeObj = new Date(time);
    return `${dateObj?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })} at ${timeObj?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Booking QR Code</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            iconSize={20}
          />
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-lg inline-block mb-6 shadow-elevation-1">
            {isGenerating ? (
              <div className="w-48 h-48 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="Booking QR Code"
                className="w-48 h-48 mx-auto"
                onError={(e) => {
                  e.target.src = '/assets/images/no_image.png';
                }}
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-muted-foreground">
                <p>Failed to load QR code</p>
              </div>
            )}
          </div>

          {/* Booking Details */}
          <div className="space-y-3 mb-6">
            <div>
              <h3 className="font-semibold text-foreground text-lg">
                {booking?.stationName}
              </h3>
              <p className="text-sm text-muted-foreground">{booking?.location}</p>
            </div>
            
            <div className="flex items-center justify-center text-sm text-foreground">
              <Icon name="Calendar" size={16} className="mr-2 text-muted-foreground" />
              <span>{formatDateTime(booking?.date, booking?.startTime)}</span>
            </div>
            
            <div className="flex items-center justify-center text-sm text-foreground">
              <Icon name="Clock" size={16} className="mr-2 text-muted-foreground" />
              <span>{booking?.duration} minutes</span>
            </div>
            
            <div className="bg-muted rounded-lg p-3 mt-4">
              <p className="text-xs text-muted-foreground mb-1">Booking ID</p>
              <p className="font-mono text-sm font-semibold text-foreground">
                {booking?.bookingId}
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-primary/10 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground mb-2">
                  How to use this QR code:
                </p>
                <ol className="text-xs text-muted-foreground space-y-1">
                  <li>1. Arrive at the charging station</li>
                  <li>2. Scan this QR code at the station terminal</li>
                  <li>3. Follow the on-screen instructions</li>
                  <li>4. Start your charging session</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                if (qrCodeUrl) {
                  downloadQRCode(qrCodeUrl, `booking-qr-${booking?.bookingId || booking?.booking_id}.png`);
                }
              }}
              iconName="Download"
              iconPosition="left"
              iconSize={16}
              disabled={!qrCodeUrl || isGenerating}
            >
              Save QR Code
            </Button>
            
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                if (qrCodeUrl) {
                  shareQRCode(qrCodeUrl, booking?.bookingId || booking?.booking_id);
                }
              }}
              iconName="Share"
              iconPosition="left"
              iconSize={16}
              disabled={!qrCodeUrl || isGenerating}
            >
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;