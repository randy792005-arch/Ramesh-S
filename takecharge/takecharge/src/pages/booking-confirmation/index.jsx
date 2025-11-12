import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BookingSummary from './components/BookingSummary';
import PaymentForm from './components/PaymentForm';
import BookingModification from './components/BookingModification';
import ConfirmationSuccess from './components/ConfirmationSuccess';
import NotificationPreferences from './components/NotificationPreferences';
import { createBooking, updateBooking } from '../../services/bookingService';
import { createTransaction } from '../../services/transactionService';
import { useAuth } from '../../contexts/AuthContext';
import { generateBookingQRCode } from '../../services/qrCodeService';
import { sendBookingConfirmation } from '../../services/notificationService';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState('confirmation');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [qrCode, setQrCode] = useState('');

  // Mock booking data - in real app this would come from props or API
  const [bookingData, setBookingData] = useState({
    station: {
      id: 'st_001',
      name: 'TakeCharge Downtown Station',
      address: '123 Electric Avenue, Downtown, NY 10001',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400&h=300&fit=crop',
      distance: '0.8 miles',
      rating: '4.8'
    },
    chargingDetails: {
      portType: 'CCS Type 1',
      power: '150kW DC Fast',
      portNumber: 'A3'
    },
    scheduledDate: '2025-09-16',
    startTime: '14:30',
    endTime: '16:00',
    duration: {
      hours: 1,
      minutes: 30
    },
    pricing: {
      rate: '0.35',
      chargingCost: '18.50',
      platformFee: '2.50',
      taxes: '1.68',
      total: '22.68'
    },
    paymentMethod: 'Credit Card'
  });

  const availableSlots = [
    { startTime: '13:00', endTime: '14:30', available: true },
    { startTime: '14:30', endTime: '16:00', available: true },
    { startTime: '16:00', endTime: '17:30', available: true },
    { startTime: '17:30', endTime: '19:00', available: false },
    { startTime: '19:00', endTime: '20:30', available: true }
  ];

  useEffect(() => {
    // Priority initialization order:
    // 1) explicit bookingData passed via navigation
    // 2) station object passed via navigation (from StationList -> { state: { station } })
    // 3) booking saved to localStorage by StationDetails booking flow
    if (location?.state?.bookingData) {
      setBookingData(location?.state?.bookingData);
      return;
    }

    if (location?.state?.station) {
      const s = location.state.station;
      const selectedSlot = location.state.selectedSlot;
      // Normalize station -> bookingData shape
      setBookingData({
        station: {
          id: s?.id || s?.stationId || 'st_auto',
          name: s?.name || s?.stationName || 'Selected Station',
          address: s?.address || '',
          image: s?.image || s?.stationImage || '',
          distance: s?.distance ? `${s.distance} km` : s?.distance || '',
          rating: s?.rating || ''
        },
        chargingDetails: selectedSlot ? {
          portType: selectedSlot?.connectorType || s?.connectors?.[0] || 'CCS',
          power: selectedSlot?.power ? `${selectedSlot.power}kW` : (s?.maxPower ? `${s.maxPower}kW` : '150kW'),
          portNumber: selectedSlot?.id || s?.defaultPort || ''
        } : {
          portType: s?.connectors?.[0] || 'CCS',
          power: s?.maxPower ? `${s.maxPower}kW` : (s?.chargingSpeed || '150kW'),
          portNumber: s?.defaultPort || ''
        },
        scheduledDate: new Date()?.toISOString()?.split('T')?.[0],
        startTime: '14:00',
        endTime: '15:00',
        duration: { hours: 1, minutes: 0 },
        pricing: selectedSlot ? {
          rate: selectedSlot?.pricePerKwh ? String(selectedSlot.pricePerKwh) : (s?.pricePerKwh ? String(s.pricePerKwh) : '0.35'),
          chargingCost: selectedSlot?.pricePerKwh ? String((selectedSlot.pricePerKwh * 1).toFixed(2)) : (s?.pricePerKwh ? String((s.pricePerKwh * 1).toFixed(2)) : '0'),
          platformFee: '2.50',
          taxes: '0.00',
          total: selectedSlot?.pricePerKwh ? String((selectedSlot.pricePerKwh * 1 + 2.5).toFixed(2)) : (s?.pricePerKwh ? String((s.pricePerKwh * 1 + 2.5).toFixed(2)) : '0.35')
        } : {
          rate: s?.pricePerKwh ? String(s.pricePerKwh) : '0.35',
          chargingCost: s?.pricePerKwh ? String((s?.pricePerKwh * 1).toFixed(2)) : '0',
          platformFee: '2.50',
          taxes: '0.00',
          total: s?.pricePerKwh ? String((s?.pricePerKwh * 1 + 2.5).toFixed(2)) : '0.35'
        },
        paymentMethod: 'Credit Card'
      });
      return;
    }

    // Fallback: check localStorage (booking flow from StationDetails stored currentBooking)
    try {
      const cb = localStorage.getItem('currentBooking');
      if (cb) {
        const parsed = JSON.parse(cb);
        // If parsed contains station info as stationId/stationName, map to bookingData shape
        setBookingData(prev => ({
          ...prev,
          station: {
            id: parsed?.stationId || prev?.station?.id,
            name: parsed?.stationName || prev?.station?.name,
            address: parsed?.stationAddress || prev?.station?.address || '',
            image: prev?.station?.image || '',
            distance: prev?.station?.distance || '',
            rating: prev?.station?.rating || ''
          },
          scheduledDate: parsed?.date || prev?.scheduledDate,
          startTime: parsed?.time || prev?.startTime,
          duration: parsed?.duration ? { hours: Math.floor(parsed.duration/60), minutes: parsed.duration % 60 } : prev?.duration,
          pricing: {
            ...prev?.pricing,
            total: parsed?.totalCost ? String(parsed.totalCost) : prev?.pricing?.total
          }
        }));
      }
    } catch (e) {
      // ignore parse errors
    }
  }, [location?.state]);

  const handlePaymentSubmit = async (paymentData) => {
    setIsProcessingPayment(true);
    
    try {
      // Get current user ID from auth context
      // If not authenticated, redirect to login
      if (!user) {
        alert('Please sign in to create a booking.');
        navigate('/login');
        return;
      }
      
      const userId = user.id;
      
      // Prepare booking data for database
      const startDateTime = new Date(`${bookingData.scheduledDate}T${bookingData.startTime}`);
      const endDateTime = new Date(startDateTime);
      const durationMinutes = bookingData.duration.hours * 60 + bookingData.duration.minutes;
      endDateTime.setMinutes(endDateTime.getMinutes() + durationMinutes);
      
      const bookingPayload = {
        userId: userId,
        stationId: bookingData.station.id || bookingData.station.stationId || 'ST-001',
        stationName: bookingData.station.name || bookingData.station.stationName || 'Unknown Station',
        stationAddress: bookingData.station.address || '',
        stationImage: bookingData.station.image || '',
        slotId: bookingData.chargingDetails?.portNumber || '',
        connectorType: bookingData.chargingDetails?.portType || '',
        chargingSpeed: bookingData.chargingDetails?.power || '',
        scheduledDate: bookingData.scheduledDate,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        durationMinutes: durationMinutes,
        ratePerKwh: parseFloat(bookingData.pricing.rate) || 0.35,
        chargingCost: parseFloat(bookingData.pricing.chargingCost) || 0,
        platformFee: parseFloat(bookingData.pricing.platformFee) || 0,
        taxes: parseFloat(bookingData.pricing.taxes) || 0,
        totalCost: parseFloat(bookingData.pricing.total) || 0,
        paymentMethod: paymentData?.method === 'card' ? 'Credit Card' : 
                      paymentData?.method === 'upi' ? 'UPI' :
                      paymentData?.method === 'wallet' ? 'Digital Wallet' : 'Net Banking',
        status: 'confirmed',
        latitude: bookingData.station.latitude || null,
        longitude: bookingData.station.longitude || null,
      };
      
      // Create booking in database
      const { data: savedBooking, error: bookingError } = await createBooking(bookingPayload);
      
      if (bookingError) {
        console.error('Error creating booking:', bookingError);
        throw new Error('Failed to create booking: ' + bookingError.message);
      }
      
      // Generate QR code with the actual booking ID
      const newBookingId = savedBooking?.booking_id || `TC${Date.now()?.toString()?.slice(-8)}`;
      
      // Generate QR code using QR code service
      const qrCodeDataURL = await generateBookingQRCode({
        bookingId: newBookingId,
        userId: userId,
        stationId: bookingPayload.stationId,
        booking_id: savedBooking?.id,
        user_id: userId,
        station_id: bookingPayload.stationId,
      });
      
      // Create transaction record
      const transactionPayload = {
        userId: userId,
        bookingId: savedBooking?.id,
        transactionType: 'payment',
        amount: parseFloat(bookingData.pricing.total) || 0,
        currency: 'USD',
        paymentMethod: bookingPayload.paymentMethod,
        paymentProvider: paymentData?.provider || 'manual',
        status: 'completed',
        description: `Payment for booking ${newBookingId} at ${bookingPayload.stationName}`,
      };
      
      const { error: transactionError } = await createTransaction(transactionPayload);
      
      if (transactionError) {
        console.error('Error creating transaction:', transactionError);
        // Don't throw error here - booking is already created
      }
      
      // Update booking with QR code in database
      if (savedBooking?.id) {
        await updateBooking(savedBooking.id, { qr_code: qrCodeDataURL });
      }
      
      // Send notification (email and SMS)
      try {
        const notificationResults = await sendBookingConfirmation(
          {
            ...savedBooking,
            bookingId: newBookingId,
            stationName: bookingPayload.stationName,
            stationAddress: bookingPayload.stationAddress,
            scheduledDate: bookingPayload.scheduledDate,
            startTime: bookingPayload.startTime,
            endTime: bookingPayload.endTime,
            durationMinutes: bookingPayload.durationMinutes,
            totalCost: bookingPayload.totalCost
          },
          user
        );

        if (notificationResults.email.error) {
          console.warn('Email notification failed:', notificationResults.email.error);
        }
      } catch (notificationError) {
        console.error('Error sending notifications:', notificationError);
        // Don't block booking success if notifications fail
      }
      
      // Update local state with saved booking data
      setBookingId(newBookingId);
      setQrCode(qrCodeDataURL);
      setBookingData(prev => ({
        ...prev,
        paymentMethod: bookingPayload.paymentMethod,
      }));
      
      setCurrentStep('success');
    } catch (error) {
      console.error('Payment/Booking failed:', error);
      alert('Failed to save booking. Please try again. Error: ' + error.message);
      // Handle payment failure - you might want to show an error message to the user
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleModifyBooking = (modificationData) => {
    setBookingData(prev => ({
      ...prev,
      scheduledDate: modificationData?.date,
      startTime: modificationData?.startTime,
      duration: modificationData?.duration,
      pricing: {
        ...prev?.pricing,
        total: (parseFloat(prev?.pricing?.total) + 2.50)?.toFixed(2)
      }
    }));
  };

  const handleSaveNotificationPreferences = (preferences) => {
    console.log('Notification preferences saved:', preferences);
    // In real app, save to user profile
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'success':
        return (
          <ConfirmationSuccess
            bookingData={bookingData}
            bookingId={bookingId}
            qrCode={qrCode}
          />
        );
      
      default:
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Booking Details */}
            <div className="xl:col-span-2 space-y-6">
              <BookingSummary bookingData={bookingData} />
              
              <BookingModification
                bookingData={bookingData}
                onModifyBooking={handleModifyBooking}
                availableSlots={availableSlots}
              />
              
              <NotificationPreferences
                onSavePreferences={handleSaveNotificationPreferences}
              />
            </div>
            {/* Right Column - Payment */}
            <div className="xl:col-span-1">
              <div className="sticky top-24">
                <PaymentForm
                  totalAmount={bookingData?.pricing?.total}
                  onPaymentSubmit={handlePaymentSubmit}
                  isProcessing={isProcessingPayment}
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          {currentStep !== 'success' && (
            <div className="mb-8">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                <button 
                  onClick={() => navigate('/station-details')}
                  className="hover:text-primary transition-colors"
                >
                  Station Details
                </button>
                <span>/</span>
                <span className="text-foreground">Booking Confirmation</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Confirm Your Booking
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Review your booking details and complete the payment
                  </p>
                </div>
                
                {/* Progress Indicator */}
                <div className="hidden md:flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">1</span>
                    </div>
                    <span className="text-sm font-medium text-success">Station Selected</span>
                  </div>
                  
                  <div className="w-8 h-0.5 bg-primary"></div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">2</span>
                    </div>
                    <span className="text-sm font-medium text-primary">Confirm & Pay</span>
                  </div>
                  
                  <div className="w-8 h-0.5 bg-border"></div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-border rounded-full flex items-center justify-center">
                      <span className="text-muted-foreground text-sm font-medium">3</span>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Complete</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          {renderStepContent()}
        </div>
      </main>
    </div>
  );
};

export default BookingConfirmation;