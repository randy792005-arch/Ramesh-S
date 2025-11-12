import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SlotSelectorModal = ({ station, isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  // Generate mock slots from station data (in a real app these come from API)
  const slots = Array.from({ length: Math.max(2, station?.totalSlots || 4) }).map((_, idx) => {
    const id = `S-${station?.id || '0'}-${idx + 1}`;
    const available = idx < (station?.availableSlots || 2);
    return {
      id,
      connectorType: station?.connectors?.[idx % (station?.connectors?.length || 1)] || 'CCS',
      power: station?.maxPower || 150,
      pricePerKwh: station?.pricePerKwh || 0.35,
      status: available ? 'available' : 'occupied'
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-card rounded-lg shadow-elevation-4 p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Select Slot — {station?.name}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} iconName="X" />
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto mb-4">
          {slots.map(slot => (
            <div key={slot.id} className={`p-3 rounded-lg border ${slot.status !== 'available' ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">Slot {slot.id}</div>
                  <div className="text-xs text-muted-foreground">{slot.connectorType} • {slot.power} kW</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-foreground">{slot.status === 'available' ? 'Available' : 'In Use'}</div>
                  <Button
                    variant="default"
                    size="sm"
                    disabled={slot.status !== 'available'}
                    onClick={() => onSelect(slot)}
                    iconName="Calendar"
                  >
                    Choose
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default SlotSelectorModal;
