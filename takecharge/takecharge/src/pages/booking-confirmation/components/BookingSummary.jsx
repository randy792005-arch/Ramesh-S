import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { toINR } from '../../../utils/currency';

const BookingSummary = ({ bookingData }) => {
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
    <div className="bg-card rounded-lg border border-border p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Booking Summary</h2>
        <div className="flex items-center space-x-2 text-success">
          <Icon name="CheckCircle" size={20} />
          <span className="text-sm font-medium">Slot Available</span>
        </div>
      </div>
      {/* Station Information */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={bookingData?.station?.image}
              alt={bookingData?.station?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {bookingData?.station?.name}
            </h3>
            <div className="flex items-center text-muted-foreground mb-2">
              <Icon name="MapPin" size={16} className="mr-2" />
              <span className="text-sm">{bookingData?.station?.address}</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Icon name="Navigation" size={14} className="mr-1" />
                <span>{bookingData?.station?.distance} away</span>
              </div>
              <div className="flex items-center text-success">
                <Icon name="Star" size={14} className="mr-1" />
                <span>{bookingData?.station?.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Charging Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Icon name="Zap" size={18} className="mr-2 text-primary" />
            <span className="text-sm font-medium text-foreground">Charging Port</span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {bookingData?.chargingDetails?.portType}
          </p>
          <p className="text-sm text-muted-foreground">
            {bookingData?.chargingDetails?.power} • Port #{bookingData?.chargingDetails?.portNumber}
          </p>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Icon name="Clock" size={18} className="mr-2 text-primary" />
            <span className="text-sm font-medium text-foreground">Duration</span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {bookingData?.duration?.hours}h {bookingData?.duration?.minutes}m
          </p>
          <p className="text-sm text-muted-foreground">
            Estimated charging time
          </p>
        </div>
      </div>
      {/* Date & Time */}
      <div className="bg-primary/5 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-3">
          <Icon name="Calendar" size={18} className="mr-2 text-primary" />
          <span className="text-sm font-medium text-foreground">Scheduled Time</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Date</p>
            <p className="text-lg font-semibold text-foreground">
              {formatDate(bookingData?.scheduledDate)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Time Slot</p>
            <p className="text-lg font-semibold text-foreground">
              {formatTime(bookingData?.startTime)} - {formatTime(bookingData?.endTime)}
            </p>
          </div>
        </div>
      </div>
      {/* Cost Breakdown */}
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Cost Breakdown</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Charging Rate ({bookingData?.pricing?.rate}/kWh)</span>
            <span className="text-foreground">{toINR(bookingData?.pricing?.chargingCost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Platform Fee</span>
            <span className="text-foreground">{toINR(bookingData?.pricing?.platformFee)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taxes & Fees</span>
            <span className="text-foreground">{toINR(bookingData?.pricing?.taxes)}</span>
          </div>
          <div className="border-t border-border pt-2 mt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-foreground">Total Amount</span>
              <span className="text-xl font-bold text-primary">{toINR(bookingData?.pricing?.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;