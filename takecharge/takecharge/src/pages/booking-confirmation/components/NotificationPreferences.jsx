import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const NotificationPreferences = ({ onSavePreferences }) => {
  const [preferences, setPreferences] = useState({
    email: {
      confirmation: true,
      reminders: true,
      updates: true,
      promotions: false
    },
    push: {
      confirmation: true,
      reminders: true,
      updates: true,
      promotions: false
    },
    sms: {
      confirmation: false,
      reminders: true,
      updates: false,
      promotions: false
    }
  });

  const [reminderTiming, setReminderTiming] = useState({
    beforeBooking: ['24h', '2h'],
    afterBooking: ['completion']
  });

  const handlePreferenceChange = (category, type, checked) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [type]: checked
      }
    }));
  };

  const handleReminderChange = (timing, value, checked) => {
    setReminderTiming(prev => ({
      ...prev,
      [timing]: checked 
        ? [...prev?.[timing], value]
        : prev?.[timing]?.filter(item => item !== value)
    }));
  };

  const handleSavePreferences = () => {
    onSavePreferences({
      notifications: preferences,
      reminders: reminderTiming
    });
  };

  const notificationTypes = [
    {
      key: 'confirmation',
      label: 'Booking Confirmations',
      description: 'Receive confirmation when booking is successful'
    },
    {
      key: 'reminders',
      label: 'Booking Reminders',
      description: 'Get reminded before your scheduled charging time'
    },
    {
      key: 'updates',
      label: 'Status Updates',
      description: 'Updates about your booking or station changes'
    },
    {
      key: 'promotions',
      label: 'Promotions & Offers',
      description: 'Special deals and promotional offers'
    }
  ];

  const reminderOptions = [
    { value: '24h', label: '24 hours before', category: 'beforeBooking' },
    { value: '12h', label: '12 hours before', category: 'beforeBooking' },
    { value: '2h', label: '2 hours before', category: 'beforeBooking' },
    { value: '30m', label: '30 minutes before', category: 'beforeBooking' },
    { value: 'start', label: 'When charging starts', category: 'afterBooking' },
    { value: 'completion', label: 'When charging completes', category: 'afterBooking' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Notification Preferences</h2>
        <Icon name="Bell" size={20} className="text-primary" />
      </div>
      <div className="space-y-8">
        {/* Notification Channels */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Notification Channels</h3>
          
          {/* Email Notifications */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="Mail" size={18} className="text-primary" />
              <h4 className="text-sm font-medium text-foreground">Email Notifications</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-7">
              {notificationTypes?.map((type) => (
                <div key={`email-${type?.key}`} className="space-y-2">
                  <Checkbox
                    label={type?.label}
                    description={type?.description}
                    checked={preferences?.email?.[type?.key]}
                    onChange={(e) => handlePreferenceChange('email', type?.key, e?.target?.checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Push Notifications */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="Smartphone" size={18} className="text-primary" />
              <h4 className="text-sm font-medium text-foreground">Push Notifications</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-7">
              {notificationTypes?.map((type) => (
                <div key={`push-${type?.key}`} className="space-y-2">
                  <Checkbox
                    label={type?.label}
                    description={type?.description}
                    checked={preferences?.push?.[type?.key]}
                    onChange={(e) => handlePreferenceChange('push', type?.key, e?.target?.checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SMS Notifications */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="MessageSquare" size={18} className="text-primary" />
              <h4 className="text-sm font-medium text-foreground">SMS Notifications</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-7">
              {notificationTypes?.map((type) => (
                <div key={`sms-${type?.key}`} className="space-y-2">
                  <Checkbox
                    label={type?.label}
                    description={type?.description}
                    checked={preferences?.sms?.[type?.key]}
                    onChange={(e) => handlePreferenceChange('sms', type?.key, e?.target?.checked)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reminder Timing */}
        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Reminder Timing</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Before Booking</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {reminderOptions?.filter(option => option?.category === 'beforeBooking')?.map((option) => (
                  <Checkbox
                    key={option?.value}
                    label={option?.label}
                    checked={reminderTiming?.beforeBooking?.includes(option?.value)}
                    onChange={(e) => handleReminderChange('beforeBooking', option?.value, e?.target?.checked)}
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">During/After Booking</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reminderOptions?.filter(option => option?.category === 'afterBooking')?.map((option) => (
                  <Checkbox
                    key={option?.value}
                    label={option?.label}
                    checked={reminderTiming?.afterBooking?.includes(option?.value)}
                    onChange={(e) => handleReminderChange('afterBooking', option?.value, e?.target?.checked)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Quick Presets</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPreferences({
                  email: { confirmation: true, reminders: true, updates: true, promotions: true },
                  push: { confirmation: true, reminders: true, updates: true, promotions: true },
                  sms: { confirmation: true, reminders: true, updates: true, promotions: false }
                });
              }}
            >
              All Notifications
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPreferences({
                  email: { confirmation: true, reminders: true, updates: false, promotions: false },
                  push: { confirmation: true, reminders: true, updates: false, promotions: false },
                  sms: { confirmation: false, reminders: true, updates: false, promotions: false }
                });
              }}
            >
              Essential Only
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPreferences({
                  email: { confirmation: false, reminders: false, updates: false, promotions: false },
                  push: { confirmation: false, reminders: false, updates: false, promotions: false },
                  sms: { confirmation: false, reminders: false, updates: false, promotions: false }
                });
              }}
            >
              Turn Off All
            </Button>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={16} className="text-primary mt-0.5" />
            <div className="text-sm">
              <p className="text-foreground font-medium mb-1">Privacy & Data</p>
              <p className="text-muted-foreground">
                We respect your privacy. You can change these preferences anytime in your account settings. 
                We never share your contact information with third parties.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            variant="default"
            size="sm"
            onClick={handleSavePreferences}
            iconName="Check"
            iconPosition="left"
          >
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;