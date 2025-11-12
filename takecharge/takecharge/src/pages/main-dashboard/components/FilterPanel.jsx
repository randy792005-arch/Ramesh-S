import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import { toINR } from '../../../utils/currency';

const FilterPanel = ({ filters, onFiltersChange, onReset, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const connectorOptions = [
    { value: '', label: 'All Connectors' },
    { value: 'CCS', label: 'CCS (Combined Charging System)' },
    { value: 'CHAdeMO', label: 'CHAdeMO' },
    { value: 'Tesla', label: 'Tesla Supercharger' },
    { value: 'Type2', label: 'Type 2 (AC)' },
    { value: 'Type1', label: 'Type 1 (J1772)' },
  ];

  const chargingSpeedOptions = [
    { value: '', label: 'Any Speed' },
    { value: 50, label: '50+ kW (Fast)' },
    { value: 100, label: '100+ kW (Rapid)' },
    { value: 150, label: '150+ kW (Ultra Fast)' },
    { value: 250, label: '250+ kW (Superfast)' },
  ];

  const priceRangeOptions = [
    { value: '', label: 'Any Price' },
    { value: 0.25, label: `Under ${toINR(0.25)}/kWh` },
    { value: 0.35, label: `Under ${toINR(0.35)}/kWh` },
    { value: 0.45, label: `Under ${toINR(0.45)}/kWh` },
    { value: 0.55, label: `Under ${toINR(0.55)}/kWh` },
  ];

  const distanceOptions = [
    { value: '', label: 'Any Distance' },
    { value: 5, label: 'Within 5 km' },
    { value: 10, label: 'Within 10 km' },
    { value: 25, label: 'Within 25 km' },
    { value: 50, label: 'Within 50 km' },
  ];

  const amenityOptions = [
    { id: 'parking', label: 'Free Parking', icon: 'Car' },
    { id: 'restroom', label: 'Restrooms', icon: 'Home' },
    { id: 'food', label: 'Food & Dining', icon: 'Coffee' },
    { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag' },
    { id: 'wifi', label: 'WiFi', icon: 'Wifi' },
    { id: '24hours', label: '24/7 Access', icon: 'Clock' },
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleAmenityChange = (amenityId, checked) => {
    const currentAmenities = filters?.amenities || [];
    const updatedAmenities = checked
      ? [...currentAmenities, amenityId]
      : currentAmenities?.filter(id => id !== amenityId);
    
    handleFilterChange('amenities', updatedAmenities);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.connectorType) count++;
    if (filters?.chargingSpeed) count++;
    if (filters?.priceRange) count++;
    if (filters?.distance) count++;
    if (filters?.amenities?.length > 0) count++;
    if (filters?.availableOnly) count++;
    return count;
  };

  const activeCount = getActiveFilterCount();

  return (
    <div className={`bg-card border border-border rounded-lg shadow-elevation-1 ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Filters</h3>
          {activeCount > 0 && (
            <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-medium">
              {activeCount}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-xs"
            >
              Reset
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconSize={16}
            className="lg:hidden"
          >
            {isExpanded ? 'Less' : 'More'}
          </Button>
        </div>
      </div>
      {/* Filter Content */}
      <div className={`
        ${isExpanded ? 'block' : 'hidden'} lg:block
        p-4 space-y-6
      `}>
        {/* Quick Filters */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Quick Filters
          </h4>
          
          <div className="space-y-2">
            <Checkbox
              label="Available stations only"
              description="Show only stations with available slots"
              checked={filters?.availableOnly || false}
              onChange={(e) => handleFilterChange('availableOnly', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Connector Type */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Connector Type
          </h4>
          
          <Select
            options={connectorOptions}
            value={filters?.connectorType || ''}
            onChange={(value) => handleFilterChange('connectorType', value)}
            placeholder="Select connector type"
          />
        </div>

        {/* Charging Speed */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Charging Speed
          </h4>
          
          <Select
            options={chargingSpeedOptions}
            value={filters?.chargingSpeed || ''}
            onChange={(value) => handleFilterChange('chargingSpeed', value)}
            placeholder="Select minimum speed"
          />
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Price Range
          </h4>
          
          <Select
            options={priceRangeOptions}
            value={filters?.priceRange || ''}
            onChange={(value) => handleFilterChange('priceRange', value)}
            placeholder="Select price range"
          />
        </div>

        {/* Distance */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Distance
          </h4>
          
          <Select
            options={distanceOptions}
            value={filters?.distance || ''}
            onChange={(value) => handleFilterChange('distance', value)}
            placeholder="Select distance range"
          />
        </div>

        {/* Amenities */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Amenities
          </h4>
          
          <div className="grid grid-cols-1 gap-2">
            {amenityOptions?.map((amenity) => (
              <div key={amenity?.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors duration-200">
                <Checkbox
                  checked={(filters?.amenities || [])?.includes(amenity?.id)}
                  onChange={(e) => handleAmenityChange(amenity?.id, e?.target?.checked)}
                />
                <Icon name={amenity?.icon} size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{amenity?.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Apply Filters Button - Mobile */}
        <div className="lg:hidden pt-4 border-t border-border">
          <Button
            variant="default"
            fullWidth
            onClick={() => setIsExpanded(false)}
            iconName="Check"
            iconPosition="left"
          >
            Apply Filters {activeCount > 0 && `(${activeCount})`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;