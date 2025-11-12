import React from 'react';
import Icon from '../../../components/AppIcon';

const StationAmenities = ({ amenities }) => {
  const getAmenityIcon = (type) => {
    const iconMap = {
      'restaurant': 'UtensilsCrossed',
      'shopping': 'ShoppingBag',
      'restroom': 'Home',
      'wifi': 'Wifi',
      'parking': 'Car',
      'atm': 'CreditCard',
      'pharmacy': 'Plus',
      'gas_station': 'Fuel',
      'hotel': 'Bed',
      'coffee': 'Coffee',
      'convenience': 'Store',
      'repair': 'Wrench'
    };
    return iconMap?.[type] || 'MapPin';
  };

  const getDistanceColor = (distance) => {
    if (distance <= 100) return 'text-success';
    if (distance <= 300) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-1 p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Nearby Amenities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {amenities?.map((amenity, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors duration-200"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg flex-shrink-0">
              <Icon name={getAmenityIcon(amenity?.type)} size={20} className="text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">{amenity?.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{amenity?.category}</p>
              
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Icon name="Navigation" size={12} className={getDistanceColor(amenity?.distance)} />
                  <span className={getDistanceColor(amenity?.distance)}>
                    {amenity?.distance}m
                  </span>
                </div>
                
                {amenity?.rating && (
                  <div className="flex items-center gap-1">
                    <Icon name="Star" size={12} className="text-warning fill-current" />
                    <span className="text-muted-foreground">{amenity?.rating}</span>
                  </div>
                )}
                
                {amenity?.openNow !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    amenity?.openNow 
                      ? 'bg-success/10 text-success' :'bg-destructive/10 text-destructive'
                  }`}>
                    {amenity?.openNow ? 'Open' : 'Closed'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* View All Button */}
      <div className="flex justify-center mt-6">
        <button className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/5 rounded-lg transition-colors duration-200">
          <Icon name="MapPin" size={16} />
          <span className="font-medium">View All on Map</span>
        </button>
      </div>
    </div>
  );
};

export default StationAmenities;