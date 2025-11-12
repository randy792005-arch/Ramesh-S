import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const StationHeader = ({ station }) => {
  return (
    <div className="bg-card rounded-lg shadow-elevation-1 overflow-hidden">
      {/* Station Images */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {station?.images?.map((image, index) => (
            <div key={index} className="flex-shrink-0 w-full snap-start">
              <Image
                src={image}
                alt={`${station?.name} - Image ${index + 1}`}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
          1 / {station?.images?.length}
        </div>
        
        {/* Favorite Button */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200">
          <Icon name="Heart" size={20} className="text-destructive" />
        </button>
      </div>
      {/* Station Info */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-foreground">{station?.name}</h1>
              <div className="flex items-center gap-1">
                <Icon name="Star" size={16} className="text-warning fill-current" />
                <span className="text-sm font-medium text-foreground">{station?.rating}</span>
                <span className="text-sm text-muted-foreground">({station?.reviewCount} reviews)</span>
              </div>
            </div>
            
            <div className="flex items-start gap-2 mb-3">
              <Icon name="MapPin" size={16} className="text-muted-foreground mt-1 flex-shrink-0" />
              <p className="text-foreground">{station?.address}</p>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <span className="text-foreground">{station?.operatingHours}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                station?.isOpen ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
              }`}>
                {station?.isOpen ? 'Open Now' : 'Closed'}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Icon name="Navigation" size={14} />
                <span>{station?.distance} km away</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Clock" size={14} />
                <span>{station?.eta} min drive</span>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-col gap-2 lg:w-48">
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200">
              <Icon name="Navigation" size={16} />
              <span className="font-medium">Get Directions</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors duration-200">
              <Icon name="Phone" size={16} />
              <span className="font-medium">Call Station</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationHeader;