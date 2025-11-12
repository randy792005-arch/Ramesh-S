import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { toINR } from '../../../utils/currency';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const BookingCard = ({ booking, onModify, onCancel, onDownloadInvoice, onViewQR }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'upcoming':
        return 'bg-primary text-primary-foreground';
      case 'active':
        return 'bg-warning text-warning-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    return new Date(time)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-200">
      {/* Main Card Content */}
      <div className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Station Info */}
          <div className="flex items-start space-x-4 flex-1">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={booking?.stationImage}
                alt={booking?.stationName}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-foreground truncate">
                  {booking?.stationName}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking?.status)}`}>
                  {booking?.status}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Icon name="MapPin" size={14} className="mr-1" />
                <span className="truncate">{booking?.location}</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-foreground">
                <div className="flex items-center">
                  <Icon name="Calendar" size={14} className="mr-1 text-muted-foreground" />
                  <span>{formatDate(booking?.date)}</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Clock" size={14} className="mr-1 text-muted-foreground" />
                  <span>{formatTime(booking?.startTime)} - {formatTime(booking?.endTime)}</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Zap" size={14} className="mr-1 text-muted-foreground" />
                  <span>{booking?.duration} mins</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cost & Actions */}
          <div className="flex flex-col lg:items-end gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{toINR(booking?.totalCost)}</div>
              <div className="text-sm text-muted-foreground">
                ID: {booking?.bookingId}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              {booking?.status === 'upcoming' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewQR(booking)}
                    iconName="QrCode"
                    iconPosition="left"
                    iconSize={16}
                  >
                    QR Code
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onModify(booking)}
                    iconName="Edit"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Modify
                  </Button>
                </>
              )}
              
              {(booking?.status === 'completed' || booking?.status === 'cancelled') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownloadInvoice(booking)}
                  iconName="Download"
                  iconPosition="left"
                  iconSize={16}
                >
                  Invoice
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                iconSize={16}
              >
                {isExpanded ? 'Less' : 'Details'}
              </Button>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Charging Details */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Charging Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Connector Type:</span>
                    <span className="text-foreground font-medium">{booking?.connectorType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Charging Speed:</span>
                    <span className="text-foreground font-medium">{booking?.chargingSpeed}</span>
                  </div>
                  {booking?.status === 'completed' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Energy Delivered:</span>
                        <span className="text-foreground font-medium">{booking?.energyDelivered} kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Actual Duration:</span>
                        <span className="text-foreground font-medium">{booking?.actualDuration} mins</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Payment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="text-foreground font-medium">{booking?.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Cost:</span>
                    <span className="text-foreground font-medium">{toINR(booking?.baseCost)}</span>
                  </div>
                  {booking?.taxes > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxes:</span>
                      <span className="text-foreground font-medium">{toINR(booking?.taxes)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">Total:</span>
                    <span className="text-foreground">{toINR(booking?.totalCost)}</span>
                  </div>
                </div>
              </div>

              {/* Station Amenities */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Station Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {booking?.amenities?.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Actions */}
            {booking?.status === 'upcoming' && (
              <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-3">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onCancel(booking)}
                  iconName="X"
                  iconPosition="left"
                  iconSize={16}
                >
                  Cancel Booking
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`https://maps.google.com/?q=${booking?.latitude},${booking?.longitude}`, '_blank')}
                  iconName="Navigation"
                  iconPosition="left"
                  iconSize={16}
                >
                  Get Directions
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;