import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import { toINR } from '../../../utils/currency';
import Button from '../../../components/ui/Button';
import GoogleMap from '../../../components/GoogleMap';

const MapContainer = ({ 
  stations, 
  selectedStation, 
  onStationSelect, 
  userLocation, 
  filters,
  searchQuery,
  onLocationSearch 
}) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Mock Google Maps iframe with dynamic markers
  // Default center set to Chennai, India when userLocation is not provided
  const generateMapUrl = () => {
    const baseUrl = "https://www.google.com/maps/embed/v1/view";
    const center = userLocation ? `${userLocation?.lat},${userLocation?.lng}` : "13.0827,80.2707";
    return `https://www.google.com/maps?q=${center}&z=13&output=embed`;
  };

  const handleMyLocation = () => {
    setIsLocating(true);
    // Simulate geolocation
    setTimeout(() => {
      setIsLocating(false);
      // Mock user location update
      if (onLocationSearch) {
        onLocationSearch("Current Location");
      }
    }, 1500);
  };

  const getStationStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-success';
      case 'occupied': return 'bg-destructive';
      case 'reserved': return 'bg-warning';
      default: return 'bg-muted';
    }
  };

  const filteredStations = stations?.filter(station => {
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
    
    return true;
  });

  return (
    <div className="relative w-full h-full bg-muted rounded-lg overflow-hidden">
      {/* Map Controls */}
  <div className="absolute bottom-20 right-4 z-30 hidden sm:flex flex-col space-y-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMyLocation}
            loading={isLocating}
            iconName="MapPin"
            iconPosition="left"
            className="bg-card shadow-elevation-2"
          >
            My Location
          </Button>

          {/* Zoom is handled by the embedded map; overlay zoom buttons removed to avoid duplication */}
        </div>
      {/* Station Count Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-card px-3 py-2 rounded-lg shadow-elevation-2 border border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Zap" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              {filteredStations?.length} stations
            </span>
          </div>
        </div>
      </div>
      {/* Map area: use GoogleMap JS API when API key present, otherwise fallback to iframe */}
      {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
        <GoogleMap
          ref={mapRef}
          // Default center to Chennai, India when userLocation isn't available
          center={{ lat: userLocation?.lat || 13.0827, lng: userLocation?.lng || 80.2707 }}
          zoom={13}
          stations={stations}
          onMarkerClick={(s) => onStationSelect(s)}
        />
      ) : (
        <iframe
          ref={mapRef}
          width="100%"
          height="100%"
          loading="lazy"
          title="EV Charging Stations Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={generateMapUrl()}
          className="w-full h-full"
          onLoad={() => setMapLoaded(true)}
        />
      )}
      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      {/* Station Markers Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {filteredStations?.map((station, index) => (
          <div
            key={station?.id}
            className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${20 + (index % 5) * 15}%`,
              top: `${30 + Math.floor(index / 5) * 20}%`
            }}
            onClick={() => onStationSelect(station)}
          >
            <div className={`
              w-6 h-6 rounded-full border-2 border-white shadow-elevation-2 hover-lift
              ${getStationStatusColor(station?.status)}
              ${selectedStation?.id === station?.id ? 'ring-2 ring-primary ring-offset-2' : ''}
            `}>
              <div className="w-full h-full flex items-center justify-center">
                <Icon 
                  name="Zap" 
                  size={12} 
                  color="white" 
                  strokeWidth={2.5}
                />
              </div>
            </div>
            
            {/* Station Info Tooltip */}
            {selectedStation?.id === station?.id && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-card border border-border rounded-lg shadow-elevation-3 p-3 z-20">
                <div className="text-sm">
                  <h4 className="font-semibold text-foreground mb-1">{station?.name}</h4>
                  <p className="text-muted-foreground text-xs mb-2">{station?.address}</p>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Available:</span>
                    <span className="text-xs font-medium text-foreground">
                      {station?.availableSlots}/{station?.totalSlots}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Price:</span>
                    <span className="text-xs font-medium text-foreground">
                      {toINR(station?.pricePerKwh)}/kWh
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Distance:</span>
                    <span className="text-xs font-medium text-foreground">
                      {station?.distance} km
                    </span>
                  </div>
                </div>
                
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border" />
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-card border border-border rounded-lg shadow-elevation-2 p-3">
          <h4 className="text-xs font-semibold text-foreground mb-2">Status</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full" />
              <span className="text-xs text-muted-foreground">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full" />
              <span className="text-xs text-muted-foreground">Reserved</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-destructive rounded-full" />
              <span className="text-xs text-muted-foreground">Occupied</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapContainer;