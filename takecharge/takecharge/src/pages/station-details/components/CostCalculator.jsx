import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { toINR } from '../../../utils/currency';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const CostCalculator = ({ pricePerKwh }) => {
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [batteryCapacity, setBatteryCapacity] = useState('');
  const [currentCharge, setCurrentCharge] = useState('');
  const [targetCharge, setTargetCharge] = useState('');
  const [chargingSpeed, setChargingSpeed] = useState('');
  const [calculatedCost, setCalculatedCost] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);

  const vehicleOptions = [
    { value: 'tesla-model-3', label: 'Tesla Model 3', capacity: 75 },
    { value: 'tesla-model-s', label: 'Tesla Model S', capacity: 100 },
    { value: 'tesla-model-x', label: 'Tesla Model X', capacity: 100 },
    { value: 'tesla-model-y', label: 'Tesla Model Y', capacity: 75 },
    { value: 'nissan-leaf', label: 'Nissan Leaf', capacity: 40 },
    { value: 'chevy-bolt', label: 'Chevrolet Bolt EV', capacity: 65 },
    { value: 'bmw-i3', label: 'BMW i3', capacity: 42 },
    { value: 'audi-etron', label: 'Audi e-tron', capacity: 95 },
    { value: 'ford-mustang', label: 'Ford Mustang Mach-E', capacity: 88 },
    { value: 'custom', label: 'Custom Vehicle', capacity: 0 }
  ];

  const speedOptions = [
    { value: '7', label: '7 kW (Level 2)' },
    { value: '22', label: '22 kW (Fast)' },
    { value: '50', label: '50 kW (Rapid)' },
    { value: '150', label: '150 kW (Ultra Rapid)' },
    { value: '350', label: '350 kW (Ultra Fast)' }
  ];

  const handleVehicleChange = (value) => {
    setSelectedVehicle(value);
    const vehicle = vehicleOptions?.find(v => v?.value === value);
    if (vehicle && vehicle?.capacity > 0) {
      setBatteryCapacity(vehicle?.capacity?.toString());
    } else {
      setBatteryCapacity('');
    }
  };

  const calculateCost = () => {
    const capacity = parseFloat(batteryCapacity);
    const current = parseFloat(currentCharge);
    const target = parseFloat(targetCharge);
    const speed = parseFloat(chargingSpeed);

    if (!capacity || !current || !target || !speed || target <= current) {
      return;
    }

    const chargeNeeded = ((target - current) / 100) * capacity;
    const cost = chargeNeeded * pricePerKwh;
    const timeHours = chargeNeeded / speed;
    const timeMinutes = Math.round(timeHours * 60);

    setCalculatedCost(cost);
    setEstimatedTime(timeMinutes);
  };

  const resetCalculator = () => {
    setSelectedVehicle('');
    setBatteryCapacity('');
    setCurrentCharge('');
    setTargetCharge('');
    setChargingSpeed('');
    setCalculatedCost(null);
    setEstimatedTime(null);
  };

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Cost Calculator</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="DollarSign" size={16} />
          <span>{toINR(pricePerKwh)}/kWh</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Select
          label="Select Vehicle"
          placeholder="Choose your EV model"
          options={vehicleOptions?.map(v => ({ value: v?.value, label: v?.label }))}
          value={selectedVehicle}
          onChange={handleVehicleChange}
          searchable
        />

        <Input
          label="Battery Capacity (kWh)"
          type="number"
          placeholder="Enter capacity"
          value={batteryCapacity}
          onChange={(e) => setBatteryCapacity(e?.target?.value)}
          min="1"
          max="200"
          disabled={selectedVehicle && selectedVehicle !== 'custom'}
        />

        <Input
          label="Current Charge (%)"
          type="number"
          placeholder="Current battery %"
          value={currentCharge}
          onChange={(e) => setCurrentCharge(e?.target?.value)}
          min="0"
          max="100"
        />

        <Input
          label="Target Charge (%)"
          type="number"
          placeholder="Desired battery %"
          value={targetCharge}
          onChange={(e) => setTargetCharge(e?.target?.value)}
          min="0"
          max="100"
        />

        <div className="md:col-span-2">
          <Select
            label="Charging Speed"
            placeholder="Select charging speed"
            options={speedOptions}
            value={chargingSpeed}
            onChange={setChargingSpeed}
          />
        </div>
      </div>
      <div className="flex gap-3 mb-6">
        <Button
          variant="default"
          onClick={calculateCost}
          iconName="Calculator"
          iconPosition="left"
          iconSize={16}
          disabled={!batteryCapacity || !currentCharge || !targetCharge || !chargingSpeed}
        >
          Calculate Cost
        </Button>
        <Button
          variant="outline"
          onClick={resetCalculator}
          iconName="RotateCcw"
          iconPosition="left"
          iconSize={16}
        >
          Reset
        </Button>
      </div>
      {calculatedCost !== null && estimatedTime !== null && (
        <div className="bg-muted rounded-lg p-4">
          <h3 className="font-medium text-foreground mb-3">Charging Estimate</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
                <Icon name="DollarSign" size={20} className="text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{toINR(calculatedCost)}</p>
              <p className="text-sm text-muted-foreground">Total Cost</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mx-auto mb-2">
                <Icon name="Clock" size={20} className="text-secondary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{formatTime(estimatedTime)}</p>
              <p className="text-sm text-muted-foreground">Est. Time</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-2">
                <Icon name="Zap" size={20} className="text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {((parseFloat(targetCharge) - parseFloat(currentCharge)) / 100 * parseFloat(batteryCapacity))?.toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">kWh Needed</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-card rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Info" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Charging Details</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Charging from {currentCharge}% to {targetCharge}%</p>
              <p>• Using {chargingSpeed} kW charging speed</p>
              <p>• Estimated cost includes service fees</p>
              <p>• Actual time may vary based on battery temperature and condition</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostCalculator;