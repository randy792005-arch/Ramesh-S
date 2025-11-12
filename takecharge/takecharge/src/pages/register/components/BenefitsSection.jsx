import React from 'react';
import Icon from '../../../components/AppIcon';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: 'MapPin',
      title: 'Smart Station Discovery',
      description: 'Find nearby charging stations with real-time availability and pricing',
      color: 'text-primary'
    },
    {
      icon: 'Calendar',
      title: 'Advanced Booking',
      description: 'Reserve charging slots in advance and never wait in line',
      color: 'text-secondary'
    },
    {
      icon: 'CreditCard',
      title: 'Seamless Payments',
      description: 'Secure payment processing with multiple payment options',
      color: 'text-accent'
    },
    {
      icon: 'Bell',
      title: 'Smart Notifications',
      description: 'Get notified about booking confirmations, reminders, and updates',
      color: 'text-warning'
    },
    {
      icon: 'BarChart3',
      title: 'Usage Analytics',
      description: 'Track your charging history, costs, and environmental impact',
      color: 'text-success'
    },
    {
      icon: 'Shield',
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee',
      color: 'text-destructive'
    }
  ];

  return (
    <div className="bg-muted rounded-xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Why Choose TakeCharge?
        </h3>
        <p className="text-sm text-muted-foreground">
          Join thousands of EV owners who trust TakeCharge for their charging needs
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits?.map((benefit, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-card rounded-lg">
            <div className={`flex-shrink-0 ${benefit?.color}`}>
              <Icon name={benefit?.icon} size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground mb-1">
                {benefit?.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {benefit?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <div className="flex items-center justify-center space-x-2 text-primary mb-2">
          <Icon name="Sparkles" size={16} />
          <span className="text-sm font-medium">Limited Time Offer</span>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Get your first 3 charging sessions free when you sign up today!
        </p>
      </div>
    </div>
  );
};

export default BenefitsSection;