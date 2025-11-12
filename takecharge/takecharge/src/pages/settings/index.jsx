import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Preferences from './components/Preferences';
import PaymentBilling from './components/PaymentBilling';
import Notifications from './components/Notifications';
import Security from './components/Security';
import Integrations from './components/Integrations';
import HelpSupport from './components/HelpSupport';

const tabs = [
  { id: 'preferences', label: 'Preferences', icon: 'Settings' },
  { id: 'payment', label: 'Payment & Billing', icon: 'CreditCard' },
  { id: 'notifications', label: 'Notifications', icon: 'Bell' },
  { id: 'security', label: 'Security', icon: 'Shield' },
  { id: 'integrations', label: 'Integrations', icon: 'Calendar' },
  { id: 'help', label: 'Help & Support', icon: 'HelpCircle' }
];

const SettingsPage = () => {
  const [active, setActive] = useState('preferences');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account, preferences and integrations</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
          <div className="flex items-center gap-4 mb-6 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${active === tab.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div>
            {active === 'preferences' && <Preferences />}
            {active === 'payment' && <PaymentBilling />}
            {active === 'notifications' && <Notifications />}
            {active === 'security' && <Security />}
            {active === 'integrations' && <Integrations />}
            {active === 'help' && <HelpSupport />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
