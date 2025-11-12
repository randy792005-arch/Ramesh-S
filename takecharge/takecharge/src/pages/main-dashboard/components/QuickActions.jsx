import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { toINR } from '../../../utils/currency';

const QuickActions = ({ className = '' }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'booking-history',
      title: 'Booking History',
      description: 'View past bookings',
      icon: 'History',
      color: 'bg-primary',
      route: '/booking-history',
      count: 12
    },
    {
      id: 'favorites',
      title: 'Favorite Stations',
      description: 'Quick access to saved stations',
      icon: 'Heart',
      color: 'bg-destructive',
      route: '/favorites',
      count: 5
    },
    {
      id: 'active-sessions',
      title: 'Active Sessions',
      description: 'Current charging sessions',
      icon: 'Zap',
      color: 'bg-success',
      route: '/booking-confirmation',
      count: 1
    },
    {
      id: 'wallet',
      title: 'Wallet & Payments',
      description: 'Manage payment methods',
      icon: 'CreditCard',
      color: 'bg-warning',
      route: '/wallet',
      count: null
    }
  ];

  const handleActionClick = (action) => {
    navigate(action?.route);
  };

  return (
    <div className={`bg-card border border-border rounded-lg shadow-elevation-1 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Zap" size={20} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          iconName="MoreHorizontal"
          iconSize={16}
          className="text-muted-foreground"
        />
      </div>
      {/* Actions Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions?.map((action) => (
            <button
              key={action?.id}
              onClick={() => handleActionClick(action)}
              className="flex items-center space-x-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-elevation-1 transition-all duration-200 hover-lift text-left min-h-touch"
            >
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-lg ${action?.color}
              `}>
                <Icon name={action?.icon} size={20} color="white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-semibold text-foreground truncate">
                    {action?.title}
                  </h4>
                  {action?.count !== null && (
                    <div className="flex items-center justify-center w-6 h-6 bg-muted rounded-full">
                      <span className="text-xs font-medium text-muted-foreground">
                        {action?.count}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {action?.description}
                </p>
              </div>
              
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
      {/* Recent Activity */}
      <div className="border-t border-border p-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Recent Activity
        </h4>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-success/10 rounded-lg">
              <Icon name="CheckCircle" size={14} className="text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                Charging completed at Tesla Supercharger
              </p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
              <Icon name="Calendar" size={14} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                Booking confirmed for ChargePoint Station
              </p>
              <p className="text-xs text-muted-foreground">Yesterday</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-warning/10 rounded-lg">
              <Icon name="DollarSign" size={14} className="text-warning" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                Payment of {toINR(24.5)} processed
              </p>
              <p className="text-xs text-muted-foreground">2 days ago</p>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/booking-history')}
          className="w-full mt-4 text-xs"
        >
          View All Activity
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;