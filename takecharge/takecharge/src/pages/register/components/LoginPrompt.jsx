import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const LoginPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center pt-6 border-t border-border">
      <p className="text-sm text-muted-foreground mb-4">
        Already have an account?
      </p>
      
      <Button
        variant="outline"
        onClick={() => navigate('/login')}
        iconName="LogIn"
        iconPosition="left"
        iconSize={16}
      >
        Sign In to Your Account
      </Button>
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p>
          By signing up, you agree to our{' '}
          <button className="text-primary hover:underline font-medium">
            Terms of Service
          </button>{' '}
          and{' '}
          <button className="text-primary hover:underline font-medium">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPrompt;