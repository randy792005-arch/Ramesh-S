import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { toINR } from '../../../utils/currency';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BookingModification = ({ bookingData, onModifyBooking, availableSlots }) => {
  const [isModifying, setIsModifying] = useState(false);
  const [selectedDate, setSelectedDate] = useState(bookingData?.scheduledDate);
  const [selectedTime, setSelectedTime] = useState(bookingData?.startTime);
  const [selectedDuration, setSelectedDuration] = useState(`${bookingData?.duration?.hours}:${bookingData?.duration?.minutes?.toString()?.padStart(2, '0')}`);

  // Generate date options dynamically based on current date
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();
    const maxDays = 30; // Show dates for the next 30 days

    for (let i = 0; i < maxDays; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dateValue = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const day = date.getDate();
      const year = date.getFullYear();

      let label;
      if (i === 0) {
        label = `Today - ${monthName} ${day}, ${year}`;
      } else if (i === 1) {
        label = `Tomorrow - ${monthName} ${day}, ${year}`;
      } else {
        label = `${dayName} - ${monthName} ${day}, ${year}`;
      }

      options.push({
        value: dateValue,
        label: label
      });
    }

    return options;
  };

  const dateOptions = generateDateOptions();

  const timeOptions = availableSlots?.map(slot => ({
    value: slot?.startTime,
    label: `${slot?.startTime} - ${slot?.endTime}`,
    disabled: !slot?.available
  }));

  const durationOptions = [
    { value: '1:00', label: '1 hour' },
    { value: '1:30', label: '1.5 hours' },
    { value: '2:00', label: '2 hours' },
    { value: '2:30', label: '2.5 hours' },
    { value: '3:00', label: '3 hours' },
    { value: '4:00', label: '4 hours' }
  ];

  const handleModifySubmit = () => {
    const [hours, minutes] = selectedDuration?.split(':')?.map(Number);
    const modificationData = {
      date: selectedDate,
      startTime: selectedTime,
      duration: { hours, minutes }
    };
    onModifyBooking(modificationData);
    setIsModifying(false);
  };

  const handleCancelModification = () => {
    setIsModifying(false);
    setSelectedDate(bookingData?.scheduledDate);
    setSelectedTime(bookingData?.startTime);
    setSelectedDuration(`${bookingData?.duration?.hours}:${bookingData?.duration?.minutes?.toString()?.padStart(2, '0')}`);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Booking Options</h2>
        {!isModifying && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModifying(true)}
            iconName="Edit"
            iconPosition="left"
          >
            Modify Booking
          </Button>
        )}
      </div>
      {!isModifying ? (
        <div className="space-y-4">
          {/* Current Booking Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">Current Booking</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Date:</span>
                <p className="font-medium text-foreground">
                  {new Date(bookingData.scheduledDate)?.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Time:</span>
                <p className="font-medium text-foreground">
                  {bookingData?.startTime} - {bookingData?.endTime}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <p className="font-medium text-foreground">
                  {bookingData?.duration?.hours}h {bookingData?.duration?.minutes}m
                </p>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Price Impact</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground line-through">
                    {toINR(bookingData?.pricing?.total)}
                  </span>
                  <span className="text-lg font-semibold text-primary">
                    {toINR((parseFloat(bookingData?.pricing?.total) || 0) + 2.5)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Additional {toINR(2.5)} modification fee applies
              </p>
          </div>
          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              size="sm"
              iconName="Clock"
              iconPosition="left"
              className="flex-1"
            >
              Extend Duration
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Calendar"
              iconPosition="left"
              className="flex-1"
            >
              Reschedule
            </Button>
            <Button
              variant="destructive"
              size="sm"
              iconName="X"
              iconPosition="left"
              className="flex-1"
            >
              Cancel Booking
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Modification Form */}
          <div className="space-y-4">
            <Select
              label="Select Date"
              options={dateOptions}
              value={selectedDate}
              onChange={setSelectedDate}
            />

            <Select
              label="Select Time Slot"
              options={timeOptions}
              value={selectedTime}
              onChange={setSelectedTime}
              description="Available time slots for the selected date"
            />

            <Select
              label="Duration"
              options={durationOptions}
              value={selectedDuration}
              onChange={setSelectedDuration}
            />
          </div>

          {/* Price Impact */}
          <div className="bg-primary/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Price Impact</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground line-through">
                  {toINR(bookingData?.pricing?.total)}
                </span>
                <span className="text-lg font-semibold text-primary">
                  {toINR((parseFloat(bookingData?.pricing?.total) || 0) + 2.5)}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Additional {toINR(2.5)} modification fee applies
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelModification}
              iconName="X"
              iconPosition="left"
              className="flex-1"
            >
              Cancel Changes
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleModifySubmit}
              iconName="Check"
              iconPosition="left"
              className="flex-1"
            >
              Confirm Changes
            </Button>
          </div>

          {/* Modification Notice */}
          <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="mb-1">Changes will be reflected immediately after confirmation.</p>
              <p>You will receive an updated booking confirmation via email.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingModification;