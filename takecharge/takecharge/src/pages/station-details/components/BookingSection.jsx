import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import { toINR } from '../../../utils/currency';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const BookingSection = ({ station, selectedSlot }) => {
  const navigate = useNavigate();
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [duration, setDuration] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const durationOptions = [
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' },
    { value: '180', label: '3 hours' },
    { value: '240', label: '4 hours' },
    { value: '360', label: '6 hours' },
    { value: '480', label: '8 hours' }
  ];

  const timeSlots = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];

  const timeOptions = timeSlots?.map(time => ({ value: time, label: time }));

  const calculateTotalCost = () => {
    if (!selectedSlot || !duration) return 0;
    const hours = parseInt(duration) / 60;
    const estimatedKwh = hours * (selectedSlot?.power * 0.8); // Assuming 80% efficiency
    return estimatedKwh * selectedSlot?.pricePerKwh;
  };

  const handleBooking = async () => {
    if (!bookingDate || !bookingTime || !duration) {
      return;
    }

    setIsLoading(true);
    
    // Simulate booking process
    setTimeout(() => {
      const bookingData = {
        stationId: station?.id,
        stationName: station?.name,
        slotId: selectedSlot?.id,
        date: bookingDate,
        time: bookingTime,
        duration: parseInt(duration),
        totalCost: calculateTotalCost(),
        bookingId: `BK${Date.now()}`,
        connectorType: selectedSlot?.connectorType,
        power: selectedSlot?.power
      };
      
      // Store booking data for confirmation page
      localStorage.setItem('currentBooking', JSON.stringify(bookingData));
      navigate('/booking-confirmation');
    }, 2000);
  };

  const getMinDate = () => {
    const today = new Date();
    return today?.toISOString()?.split('T')?.[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate?.setDate(maxDate?.getDate() + 30); // Allow booking up to 30 days in advance
    return maxDate?.toISOString()?.split('T')?.[0];
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-1 p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Book Charging Slot</h2>
      {selectedSlot ? (
        <div className="space-y-6">
          {/* Selected Slot Info */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="Zap" size={20} className="text-primary" />
              <h3 className="font-medium text-foreground">Selected Slot {selectedSlot?.id}</h3>
            </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Connector:</span>
                <span className="ml-2 font-medium text-foreground">{selectedSlot?.connectorType}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Power:</span>
                <span className="ml-2 font-medium text-foreground">{selectedSlot?.power} kW</span>
              </div>
              <div>
                <span className="text-muted-foreground">Rate:</span>
                <span className="ml-2 font-medium text-foreground">{toINR(selectedSlot?.pricePerKwh)}/kWh</span>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <span className="ml-2 px-2 py-0.5 bg-success text-success-foreground rounded-full text-xs font-medium">
                  Available
                </span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Booking Date"
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e?.target?.value)}
              min={getMinDate()}
              max={getMaxDate()}
              required
            />

            <Select
              label="Preferred Time"
              placeholder="Select time slot"
              options={timeOptions}
              value={bookingTime}
              onChange={setBookingTime}
              required
            />

            <div className="md:col-span-2">
              <Select
                label="Charging Duration"
                placeholder="How long do you need?"
                options={durationOptions}
                value={duration}
                onChange={setDuration}
                required
              />
            </div>
          </div>

          {/* Cost Summary */}
          {duration && (
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-3">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium text-foreground">
                    {parseInt(duration) >= 60 
                      ? `${Math.floor(parseInt(duration) / 60)}h ${parseInt(duration) % 60 > 0 ? `${parseInt(duration) % 60}m` : ''}`
                      : `${duration}m`
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Energy:</span>
                  <span className="font-medium text-foreground">
                    {((parseInt(duration) / 60) * (selectedSlot?.power * 0.8))?.toFixed(1)} kWh
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee:</span>
                  <span className="font-medium text-foreground">{toINR(2.50)}</span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Estimated Total:</span>
                    <span className="font-bold text-foreground text-lg">
                      {toINR((calculateTotalCost() + 2.50))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Emergency Contact */}
          <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Phone" size={16} className="text-warning" />
              <span className="font-medium text-foreground">Emergency Support</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Need help during charging? Contact station support:
            </p>
            <div className="flex items-center gap-4 text-sm">
              <a href="tel:+1-800-CHARGE" className="flex items-center gap-1 text-primary hover:underline">
                <Icon name="Phone" size={14} />
                +1-800-CHARGE
              </a>
              <a href="mailto:support@takecharge.com" className="flex items-center gap-1 text-primary hover:underline">
                <Icon name="Mail" size={14} />
                support@takecharge.com
              </a>
            </div>
          </div>

          {/* Book Button */}
          <Button
            variant="default"
            size="lg"
            fullWidth
            onClick={handleBooking}
            loading={isLoading}
            disabled={!bookingDate || !bookingTime || !duration}
            iconName="Calendar"
            iconPosition="left"
            iconSize={20}
          >
            {isLoading ? 'Processing Booking...' : 'Book Charging Slot'}
          </Button>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center">
            By booking, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary hover:underline">Cancellation Policy</a>
          </p>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-full mx-auto mb-4">
            <Icon name="Calendar" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="font-medium text-foreground mb-2">Select a Charging Slot</h3>
          <p className="text-muted-foreground">
            Choose an available charging slot above to start your booking
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingSection;