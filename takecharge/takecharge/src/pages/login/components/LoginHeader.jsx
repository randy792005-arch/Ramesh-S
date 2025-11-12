import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
  <div className="text-center mb-6 animate-fade-in-up">
      {/* Logo */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center justify-center w-14 h-14 bg-primary rounded-2xl shadow-elevation-2">
          <Icon name="Zap" size={28} color="white" strokeWidth={2.2} />
        </div>
      </div>

      {/* Brand Name */}
      <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">TakeCharge</h1>
      <p className="text-sm text-muted-foreground mb-4">EV Charging Network</p>

      {/* Welcome Message */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-foreground">Welcome Back</h2>
        <p className="text-sm text-muted-foreground">Sign in to your account to continue charging</p>
      </div>
    </div>
  );
};

export default LoginHeader;