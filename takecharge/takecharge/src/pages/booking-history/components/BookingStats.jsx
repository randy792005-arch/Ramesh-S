import React from 'react';
import Icon from '../../../components/AppIcon';
import { toINR } from '../../../utils/currency';

const BookingStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Bookings',
      value: stats?.totalBookings,
      icon: 'Calendar',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Completed Sessions',
      value: stats?.completedBookings,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Total Spent',
      value: toINR(stats?.totalSpent || 0),
      icon: 'DollarSign',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Energy Consumed',
      value: `${stats?.totalEnergy} kWh`,
      icon: 'Zap',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards?.map((stat, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-lg p-4 lg:p-6 hover:shadow-elevation-2 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {stat?.title}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stat?.value}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${stat?.bgColor} flex items-center justify-center`}>
              <Icon name={stat?.icon} size={24} className={stat?.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingStats;