import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep = 1, totalSteps = 3 }) => {
  const steps = [
    { id: 1, title: 'Account Info', icon: 'User' },
    { id: 2, title: 'Vehicle Details', icon: 'Car' },
    { id: 3, title: 'Preferences', icon: 'Settings' }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps?.map((step, index) => (
          <React.Fragment key={step?.id}>
            <div className="flex flex-col items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                ${currentStep >= step?.id 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'bg-card border-border text-muted-foreground'
                }
              `}>
                {currentStep > step?.id ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <Icon name={step?.icon} size={16} />
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-xs font-medium ${
                  currentStep >= step?.id ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step?.title}
                </p>
              </div>
            </div>
            
            {index < steps?.length - 1 && (
              <div className={`
                flex-1 h-0.5 mx-4 transition-all duration-300
                ${currentStep > step?.id ? 'bg-primary' : 'bg-border'}
              `} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}: Setting up your TakeCharge account
        </p>
      </div>
    </div>
  );
};

export default ProgressIndicator;