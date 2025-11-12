import React, { useState } from 'react';
import { toINR } from '../../../utils/currency';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import SlotSelectorModal from './SlotSelectorModal';
import Image from '../../../components/AppImage';

const StationList = ({ 
  stations, 
  selectedStation, 
  onStationSelect, 
  filters,
  searchQuery,
  className = '' 
}) => {
  const [sortBy, setSortBy] = useState('distance');
  const navigate = useNavigate();

  const sortOptions = [
    { value: 'distance', label: 'Distance', icon: 'Navigation' },
    { value: 'price', label: 'Price', icon: 'DollarSign' },
    { value: 'availability', label: 'Availability', icon: 'Zap' },
    { value: 'rating', label: 'Rating', icon: 'Star' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-success';
      case 'occupied': return 'text-destructive';
      case 'reserved': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Available';
      case 'occupied': return 'Occupied';
      case 'reserved': return 'Reserved';
      default: return 'Unknown';
    }
  };

  const filteredAndSortedStations = stations?.filter(station => {
      if (searchQuery && !station?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) && 
          !station?.address?.toLowerCase()?.includes(searchQuery?.toLowerCase())) {
        return false;
      }
      
      if (filters?.connectorType && !station?.connectors?.includes(filters?.connectorType)) {
        return false;
      }
      
      if (filters?.chargingSpeed && station?.maxPower < filters?.chargingSpeed) {
        return false;
      }
      
      if (filters?.priceRange && station?.pricePerKwh > filters?.priceRange) {
        return false;
      }
      
      if (filters?.distance && station?.distance > filters?.distance) {
        return false;
      }
      
      if (filters?.availableOnly && station?.status !== 'available') {
        return false;
      }
      
      return true;
    })?.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a?.distance - b?.distance;
        case 'price':
          return a?.pricePerKwh - b?.pricePerKwh;
        case 'availability':
          return b?.availableSlots - a?.availableSlots;
        case 'rating':
          return b?.rating - a?.rating;
        default:
          return 0;
      }
    });

  const handleStationClick = (station) => {
    onStationSelect(station);
  };

  const [modalStation, setModalStation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookNow = (station, e) => {
    e?.stopPropagation();
    // Open slot selector modal for this station
    setModalStation(station);
    setIsModalOpen(true);
  };

  const handleSlotSelect = (slot) => {
    setIsModalOpen(false);
    navigate('/booking-confirmation', { state: { station: modalStation, selectedSlot: slot } });
  };

  const handleViewDetails = (station, e) => {
    e?.stopPropagation();
    navigate('/station-details', { state: { station } });
  };

  return (
    <div className={`bg-card border border-border rounded-lg shadow-elevation-1 ${className}`}>
      {/* List Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="List" size={20} className="text-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            Stations ({filteredAndSortedStations?.length})
          </h3>
        </div>
        
        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground hidden sm:block">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="text-xs bg-transparent border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {sortOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Station List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredAndSortedStations?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="MapPin" size={32} className="text-muted-foreground mx-auto mb-3" />
            <h4 className="text-sm font-medium text-foreground mb-1">No stations found</h4>
            <p className="text-xs text-muted-foreground">
              Try adjusting your filters or search criteria
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {filteredAndSortedStations?.map((station) => (
              <div
                key={station?.id}
                onClick={() => handleStationClick(station)}
                className={`
                  p-4 rounded-lg border cursor-pointer transition-all duration-200 hover-lift
                  ${selectedStation?.id === station?.id 
                    ? 'border-primary bg-primary/5 shadow-elevation-2' 
                    : 'border-border hover:border-primary/50 hover:shadow-elevation-1'
                  }
                `}
              >
                <div className="flex items-start space-x-4">
                  {/* Station Image */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={station?.image}
                      alt={station?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Station Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground truncate">
                          {station?.name}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {station?.address}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-2">
                        <Icon name="Star" size={12} className="text-warning fill-current" />
                        <span className="text-xs font-medium text-foreground">
                          {station?.rating}
                        </span>
                      </div>
                    </div>
                    
                    {/* Station Details */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <Icon name="Navigation" size={12} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {station?.distance} km away
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Icon name="DollarSign" size={12} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {toINR(station?.pricePerKwh)}/kWh
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Icon name="Zap" size={12} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {station?.maxPower} kW max
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Icon 
                          name="Circle" 
                          size={12} 
                          className={getStatusColor(station?.status)}
                        />
                        <span className={`text-xs ${getStatusColor(station?.status)}`}>
                          {getStatusText(station?.status)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Availability */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">Available:</span>
                        <span className="text-xs font-medium text-foreground">
                          {station?.availableSlots}/{station?.totalSlots} slots
                        </span>
                      </div>
                      
                      {/* Connector Types */}
                      <div className="flex items-center space-x-1">
                        {station?.connectors?.slice(0, 3)?.map((connector, index) => (
                          <div
                            key={index}
                            className="px-2 py-1 bg-muted rounded text-xs font-medium text-muted-foreground"
                          >
                            {connector}
                          </div>
                        ))}
                        {station?.connectors?.length > 3 && (
                          <div className="px-2 py-1 bg-muted rounded text-xs font-medium text-muted-foreground">
                            +{station?.connectors?.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={(e) => handleBookNow(station, e)}
                        disabled={station?.status !== 'available'}
                        iconName="Calendar"
                        iconPosition="left"
                        iconSize={14}
                        className="flex-1"
                      >
                        Book Now
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleViewDetails(station, e)}
                        iconName="Eye"
                        iconSize={14}
                        className="px-3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Slot selector modal */}
      <SlotSelectorModal
        station={modalStation}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSlotSelect}
      />
    </div>
  );
};

export default StationList;