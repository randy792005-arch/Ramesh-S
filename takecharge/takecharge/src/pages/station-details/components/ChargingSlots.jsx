import React, { useState } from 'react';
import { toINR } from '../../../utils/currency';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChargingSlots = ({ slots, onBookSlot }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-success text-success-foreground';
      case 'occupied':
        return 'bg-destructive text-destructive-foreground';
      case 'reserved':
        return 'bg-warning text-warning-foreground';
      case 'maintenance':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getConnectorIcon = (type) => {
    switch (type) {
      case 'CCS':
        return 'Zap';
      case 'CHAdeMO':
        return 'Battery';
      case 'Type 2':
        return 'Plug';
      default:
        return 'Zap';
    }
  };

  const handleSlotSelect = (slot) => {
    if (slot?.status === 'available') {
      setSelectedSlot(slot?.id);
    }
  };

  const handleBookNow = (slot) => {
    onBookSlot(slot);
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Charging Slots</h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-destructive rounded-full"></div>
            <span className="text-muted-foreground">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-muted-foreground">Reserved</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots?.map((slot) => (
          <div
            key={slot?.id}
            className={`border-2 rounded-lg p-4 transition-all duration-200 cursor-pointer hover-lift ${
              selectedSlot === slot?.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            } ${slot?.status !== 'available' ? 'opacity-60 cursor-not-allowed' : ''}`}
            onClick={() => handleSlotSelect(slot)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon name={getConnectorIcon(slot?.connectorType)} size={20} className="text-primary" />
                <span className="font-medium text-foreground">Slot {slot?.id}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(slot?.status)}`}>
                {slot?.status?.charAt(0)?.toUpperCase() + slot?.status?.slice(1)}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Connector</span>
                <span className="font-medium text-foreground">{slot?.connectorType}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Power</span>
                <span className="font-medium text-foreground">{slot?.power} kW</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium text-foreground">{toINR(slot?.pricePerKwh)}/kWh</span>
              </div>
              {slot?.estimatedTime && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Est. Time</span>
                  <span className="font-medium text-foreground">{slot?.estimatedTime}</span>
                </div>
              )}
            </div>

            {slot?.status === 'available' ? (
              <Button
                variant="default"
                size="sm"
                fullWidth
                onClick={(e) => {
                  e?.stopPropagation();
                  handleBookNow(slot);
                }}
                iconName="Calendar"
                iconPosition="left"
                iconSize={16}
              >
                Book Now
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                fullWidth
                disabled
                iconName="Clock"
                iconPosition="left"
                iconSize={16}
              >
                {slot?.status === 'occupied' ? 'In Use' : 
                 slot?.status === 'reserved' ? 'Reserved' : 'Maintenance'}
              </Button>
            )}

            {slot?.status === 'occupied' && slot?.availableAt && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Available at {slot?.availableAt}
              </p>
            )}
          </div>
        ))}
      </div>
      {/* Real-time Updates Notice */}
      <div className="flex items-center justify-center gap-2 mt-6 p-3 bg-muted rounded-lg">
        <div className="w-2 h-2 bg-success rounded-full animate-pulse-status"></div>
        <span className="text-sm text-muted-foreground">
          Slot availability updates in real-time
        </span>
      </div>
    </div>
  );
};

export default ChargingSlots;