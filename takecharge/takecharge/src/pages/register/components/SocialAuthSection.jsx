import React from 'react';
import Button from '../../../components/ui/Button';


const SocialAuthSection = ({ onGoogleSignUp, isLoading }) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-card text-muted-foreground font-medium">
            Or sign up with
          </span>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={onGoogleSignUp}
          disabled={isLoading}
          iconName="Chrome"
          iconPosition="left"
          iconSize={18}
          className="justify-center w-full"
        >
          Google
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Quick and secure registration with your existing account
        </p>
      </div>
    </div>
  );
};

export default SocialAuthSection;