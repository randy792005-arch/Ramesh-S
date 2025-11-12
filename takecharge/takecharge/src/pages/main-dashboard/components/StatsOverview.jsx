import React from 'react';
import { toINR } from '../../../utils/currency';
import Icon from '../../../components/AppIcon';

const StatsOverview = ({ className = '' }) => {
  const stats = [
    {
      id: 'total-sessions',
      title: 'Total Sessions',
      value: '47',
      change: '+12%',
      changeType: 'positive',
      icon: 'Zap',
      color: 'bg-primary',
      description: 'Charging sessions completed'
    },
    {
      id: 'energy-consumed',
      title: 'Energy Consumed',
      value: '1,247 kWh',
      change: '+8%',
      changeType: 'positive',
      icon: 'Battery',
      color: 'bg-success',
      description: 'Total energy charged'
    },
    {
      id: 'money-saved',
      title: 'Money Saved',
  value: toINR(342),
      change: '+15%',
      changeType: 'positive',
      icon: 'DollarSign',
      color: 'bg-warning',
      description: 'Compared to gas vehicles'
    },
    {
      id: 'co2-avoided',
      title: 'CO₂ Avoided',
      value: '892 kg',
      change: '+18%',
      changeType: 'positive',
      icon: 'Leaf',
      color: 'bg-secondary',
      description: 'Environmental impact'
    }
  ];

  const getChangeColor = (type) => {
    return type === 'positive' ? 'text-success' : 'text-destructive';
  };

  return (
    <div className={`bg-card border border-border rounded-lg shadow-elevation-1 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="BarChart3" size={20} className="text-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Your Impact</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <select className="text-xs bg-transparent border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats?.map((stat) => (
            <div
              key={stat?.id}
              className="p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-elevation-1 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-lg ${stat?.color}
                `}>
                  <Icon name={stat?.icon} size={18} color="white" />
                </div>
                
                <div className={`
                  flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                  ${stat?.changeType === 'positive' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}
                `}>
                  <Icon 
                    name={stat?.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                    size={12} 
                  />
                  <span>{stat?.change}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-foreground">{stat?.value}</h4>
                <p className="text-xs font-medium text-foreground">{stat?.title}</p>
                <p className="text-xs text-muted-foreground">{stat?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Additional Insights */}
      <div className="border-t border-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Favorite Station */}
          <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Icon name="MapPin" size={16} color="white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground">Most Used Station</p>
              <p className="text-xs text-muted-foreground truncate">Tesla Supercharger - Downtown</p>
              <p className="text-xs text-muted-foreground">12 visits this month</p>
            </div>
          </div>
          
          {/* Average Session */}
          <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-lg">
              <Icon name="Clock" size={16} color="white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground">Average Session</p>
              <p className="text-xs text-muted-foreground">45 minutes</p>
              <p className="text-xs text-muted-foreground">26.5 kWh charged</p>
            </div>
          </div>
        </div>
      </div>
      {/* Achievement Badge */}
      <div className="border-t border-border p-4">
        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg">
            <Icon name="Award" size={16} color="white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Eco Warrior Achievement!</p>
            <p className="text-xs text-muted-foreground">
              You've saved over 800kg of CO₂ this year. Keep up the great work!
            </p>
          </div>
          <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;