import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const EmptyState = ({ hasFilters, onClearFilters }) => {
  const navigate = useNavigate();

  if (hasFilters) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 lg:p-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Search" size={32} className="text-muted-foreground" />
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No bookings match your filters
        </h3>
        
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Try adjusting your search criteria or clear the filters to see all your bookings.
        </p>
        
        <Button
          variant="outline"
          onClick={onClearFilters}
          iconName="X"
          iconPosition="left"
          iconSize={16}
        >
          Clear All Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-8 lg:p-12 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="Calendar" size={40} className="text-primary" />
      </div>
      
      <h3 className="text-2xl font-semibold text-foreground mb-3">
        No booking history yet
      </h3>
      
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Start your EV charging journey by finding and booking a charging station near you.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="default"
          onClick={() => navigate('/station-details')}
          iconName="MapPin"
          iconPosition="left"
          iconSize={16}
        >
          Find Charging Stations
        </Button>
        
        <Button
          variant="outline"
          onClick={() => navigate('/main-dashboard')}
          iconName="LayoutDashboard"
          iconPosition="left"
          iconSize={16}
        >
          Go to Dashboard
        </Button>
      </div>
      
      {/* Quick Tips */}
      <div className="mt-12 bg-muted rounded-lg p-6 text-left max-w-2xl mx-auto">
        <h4 className="font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Lightbulb" size={20} className="mr-2 text-warning" />
          Getting Started Tips
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-start space-x-3">
            <Icon name="MapPin" size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Find Stations</p>
              <p>Use our map to locate charging stations near you</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Icon name="Clock" size={16} className="text-secondary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Book in Advance</p>
              <p>Reserve your charging slot to avoid waiting</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Icon name="CreditCard" size={16} className="text-success mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Secure Payments</p>
              <p>Pay safely with multiple payment options</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Icon name="Bell" size={16} className="text-warning mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Get Notifications</p>
              <p>Receive updates about your charging sessions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;