import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-elevation-2">
          <Icon name="Zap" size={32} color="white" strokeWidth={2.5} />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Join TakeCharge
      </h1>
      
      <p className="text-lg text-muted-foreground mb-4">
        Create your account to start charging smarter
      </p>
      
      <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
        <div className="flex items-center">
          <Icon name="MapPin" size={16} className="mr-2 text-primary" />
          <span>Find Stations</span>
        </div>
        <div className="flex items-center">
          <Icon name="Calendar" size={16} className="mr-2 text-secondary" />
          <span>Book Slots</span>
        </div>
        <div className="flex items-center">
          <Icon name="CreditCard" size={16} className="mr-2 text-accent" />
          <span>Secure Payments</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;