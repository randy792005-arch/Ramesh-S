import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import { toINR } from '../../../utils/currency';
import { generateInvoice } from '../../../services/invoiceService';
import { useAuth } from '../../../contexts/AuthContext';

const ConfirmationSuccess = ({ bookingData, bookingId, qrCode }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [countdown, setCountdown] = useState(10);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleViewBookings = () => {
    navigate('/booking-history');
  };

  const handleGoToDashboard = () => {
    navigate('/main-dashboard');
  };

  const handleDownloadInvoice = async () => {
    setIsGeneratingInvoice(true);
    try {
      // Transform bookingData to match invoice service format
      const invoiceBookingData = {
        bookingId: bookingId,
        booking_id: bookingId,
        stationName: bookingData?.station?.name,
        station_name: bookingData?.station?.name,
        stationAddress: bookingData?.station?.address,
        station_address: bookingData?.station?.address,
        scheduledDate: bookingData?.scheduledDate,
        scheduled_date: bookingData?.scheduledDate,
        startTime: bookingData?.startTime ? new Date(`${bookingData.scheduledDate}T${bookingData.startTime}`).toISOString() : null,
        start_time: bookingData?.startTime ? new Date(`${bookingData.scheduledDate}T${bookingData.startTime}`).toISOString() : null,
        endTime: bookingData?.endTime ? new Date(`${bookingData.scheduledDate}T${bookingData.endTime}`).toISOString() : null,
        end_time: bookingData?.endTime ? new Date(`${bookingData.scheduledDate}T${bookingData.endTime}`).toISOString() : null,
        durationMinutes: (bookingData?.duration?.hours || 0) * 60 + (bookingData?.duration?.minutes || 0),
        duration_minutes: (bookingData?.duration?.hours || 0) * 60 + (bookingData?.duration?.minutes || 0),
        connectorType: bookingData?.chargingDetails?.portType,
        connector_type: bookingData?.chargingDetails?.portType,
        chargingSpeed: bookingData?.chargingDetails?.power,
        charging_speed: bookingData?.chargingDetails?.power,
        ratePerKwh: parseFloat(bookingData?.pricing?.rate || 0),
        rate_per_kwh: parseFloat(bookingData?.pricing?.rate || 0),
        chargingCost: parseFloat(bookingData?.pricing?.chargingCost || 0),
        charging_cost: parseFloat(bookingData?.pricing?.chargingCost || 0),
        platformFee: parseFloat(bookingData?.pricing?.platformFee || 0),
        platform_fee: parseFloat(bookingData?.pricing?.platformFee || 0),
        taxes: parseFloat(bookingData?.pricing?.taxes || 0),
        totalCost: parseFloat(bookingData?.pricing?.total || 0),
        total_cost: parseFloat(bookingData?.pricing?.total || 0),
        paymentMethod: bookingData?.paymentMethod,
        payment_method: bookingData?.paymentMethod,
        status: 'confirmed',
        qr_code: qrCode,
      };

      await generateInvoice(invoiceBookingData, user);
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice. Please try again.');
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`)?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={40} color="white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
        <p className="text-lg text-muted-foreground">
          Your charging slot has been successfully reserved
        </p>
      </div>
      {/* Booking Details Card */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-elevation-2 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Booking Details</h2>
          <div className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
            Confirmed
          </div>
        </div>

        {/* Booking ID */}
        <div className="bg-primary/5 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
              <p className="text-2xl font-mono font-bold text-primary">{bookingId}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="Copy"
              iconPosition="left"
              onClick={() => navigator.clipboard?.writeText(bookingId)}
            >
              Copy
            </Button>
          </div>
        </div>

        {/* Station & Schedule Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Station Details</h3>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">{bookingData?.station?.name}</p>
              <div className="flex items-center text-muted-foreground text-sm">
                <Icon name="MapPin" size={14} className="mr-2" />
                <span>{bookingData?.station?.address}</span>
              </div>
              <div className="flex items-center text-muted-foreground text-sm">
                <Icon name="Zap" size={14} className="mr-2" />
                <span>{bookingData?.chargingDetails?.portType} • Port #{bookingData?.chargingDetails?.portNumber}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Schedule</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Icon name="Calendar" size={14} className="mr-2 text-primary" />
                <span className="font-medium text-foreground">
                  {formatDate(bookingData?.scheduledDate)}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Icon name="Clock" size={14} className="mr-2 text-primary" />
                <span className="font-medium text-foreground">
                  {formatTime(bookingData?.startTime)} - {formatTime(bookingData?.endTime)}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Icon name="Timer" size={14} className="mr-2 text-primary" />
                <span className="font-medium text-foreground">
                  {bookingData?.duration?.hours}h {bookingData?.duration?.minutes}m
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="text-center mb-6">
          <h3 className="text-sm font-medium text-foreground mb-3">Check-in QR Code</h3>
          <div className="inline-block p-4 bg-white rounded-lg border border-border">
            <Image
              src={qrCode}
              alt="Booking QR Code"
              className="w-32 h-32 mx-auto"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Show this QR code at the charging station to start your session
          </p>
        </div>

        {/* Payment Summary */}
        <div className="border-t border-border pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-foreground">Amount Paid</span>
            <span className="text-2xl font-bold text-success">{toINR(bookingData?.pricing?.total)}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Payment processed successfully via {bookingData?.paymentMethod}
          </p>
        </div>
      </div>
      {/* Emergency Contact */}
      <div className="bg-warning/5 border border-warning/20 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Icon name="Phone" size={18} className="text-warning mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground mb-1">Emergency Contact</h4>
            <p className="text-sm text-muted-foreground mb-2">
              If you face any issues at the charging station:
            </p>
            <div className="space-y-1 text-sm">
              <p className="font-medium text-foreground">24/7 Support: +1 (555) 123-4567</p>
              <p className="text-muted-foreground">Station Support: +1 (555) 987-6543</p>
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadInvoice}
          iconName="Download"
          iconPosition="left"
          fullWidth
          loading={isGeneratingInvoice}
          disabled={isGeneratingInvoice}
        >
          {isGeneratingInvoice ? 'Generating...' : 'Download Invoice'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewBookings}
          iconName="History"
          iconPosition="left"
          fullWidth
        >
          View All Bookings
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleGoToDashboard}
          iconName="Home"
          iconPosition="left"
          fullWidth
        >
          Go to Dashboard
        </Button>
      </div>
      {/* Auto Redirect Notice */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Redirecting to dashboard in {countdown} seconds...
        </p>
      </div>
      {/* Confirmation Email Notice */}
      <div className="bg-muted/50 rounded-lg p-4 mt-6">
        <div className="flex items-start space-x-3">
          <Icon name="Mail" size={16} className="text-primary mt-0.5" />
          <div className="text-sm">
            <p className="text-foreground font-medium mb-1">Confirmation Email Sent</p>
            <p className="text-muted-foreground">
              A detailed booking confirmation with PDF invoice has been sent to your registered email address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationSuccess;